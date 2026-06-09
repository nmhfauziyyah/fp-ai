/* ================================================================
   ImageOcrPanel.jsx — Panel Unggah Gambar (OCR via Backend)
   Props:
   - onAnalyze : (inputData: string, tab: 'image', imageFile: File) => void
   - onReset   : () => void
   - isLoading : boolean

   File gambar dikirim langsung ke backend POST /predict sebagai
   multipart/form-data. Backend (Ardhi) yang menangani EasyOCR.
   Frontend tidak perlu mock OCR lagi.
   ================================================================ */

import React, { useState, useRef, useCallback } from 'react';
import Button from '../ui/Button';



/**
 * @param {Object}   props
 * @param {Function} props.onAnalyze - Dipanggil dengan (filename, 'image', File)
 * @param {Function} props.onReset   - Reset result panel
 * @param {boolean}  props.isLoading
 */
export default function ImageOcrPanel({ onAnalyze, onReset, isLoading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSrc, setPreviewSrc]     = useState('');
  const [isDragOver, setIsDragOver]     = useState(false);

  const fileInputRef = useRef(null);

  // ── Proses file yang dipilih ─────────────────────────────────────────────
  const processFile = useCallback((file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setPreviewSrc(URL.createObjectURL(file));
    onReset();
  }, [onReset]);

  // ── File input change handler ────────────────────────────────────────────
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // ── Drag & Drop handlers (React native approach) ─────────────────────────
  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => { setIsDragOver(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ── Hapus gambar & reset ─────────────────────────────────────────────────
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewSrc('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onReset();
  };

  // ── Trigger analisis ─────────────────────────────────────────────────────
  const handleAnalyze = () => {
    if (!selectedFile) {
      alert('Silakan unggah gambar screenshot berita terlebih dahulu!');
      return;
    }
    // Kirim File object langsung ke hook → hook akan POST ke /predict sebagai FormData
    // Backend (Ardhi) yang handle EasyOCR dan extract text dari gambar
    onAnalyze(selectedFile.name, 'image', selectedFile);
  };

  return (
    <div
      id="content-image"
      role="tabpanel"
      aria-labelledby="tab-image"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-4"
    >
      {/* ── Panel Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-urbanist text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brandMint rounded-full" aria-hidden="true" />
          Pemindaian Gambar (OCR Engine)
        </h2>
        <span className="text-xs text-gray-400">Ekstraksi teks otomatis via EasyOCR</span>
      </div>

      {/* ── Drag & Drop Zone (tersembunyi jika ada preview) ──────── */}
      {!selectedFile && (
        <div
          id="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Area drag dan drop untuk mengunggah gambar"
          onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center gap-3 bg-darkBg/30 transition cursor-pointer group my-4 ${isDragOver
              ? 'border-brandMint bg-brandMint/5'
              : 'border-darkBorder hover:border-brandMint/50'
            }`}
        >
          <div className={`w-16 h-16 rounded-full bg-darkCard flex items-center justify-center transition ${isDragOver ? 'text-brandMint' : 'text-gray-400 group-hover:text-brandMint'}`}>
            <i className="fa-solid fa-cloud-arrow-up text-3xl animate-bounce" aria-hidden="true" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-white">
              {isDragOver ? 'Lepaskan untuk mengunggah' : 'Tarik & Letakkan Screenshot Berita'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Mendukung format PNG, JPG, JPEG</p>
          </div>
          <label
            className="px-4 py-2 rounded-lg bg-darkCard text-xs font-semibold text-gray-300 border border-darkBorder cursor-pointer hover:bg-darkBorder/40 transition"
            onClick={(e) => e.stopPropagation()}
            htmlFor="file-uploader"
          >
            Pilih Berkas
          </label>
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            id="file-uploader"
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            aria-label="Pilih file gambar untuk diunggah"
          />
        </div>
      )}

      {/* ── Image Preview (tampil setelah file dipilih) ───────────── */}
      {selectedFile && (
        <div
          id="image-preview-container"
          className="border border-darkBorder rounded-xl p-4 bg-darkCard/50 flex flex-col md:flex-row gap-4 items-center my-4 animate-fade-in"
        >
          {/* Thumbnail */}
          <div className="w-full md:w-1/3 h-32 rounded-lg overflow-hidden bg-black/40 flex items-center justify-center border border-darkBorder shrink-0">
            <img
              id="image-preview"
              src={previewSrc}
              alt={`Preview: ${selectedFile.name}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* File Info */}
          <div className="flex-grow flex flex-col gap-2 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span
                id="image-filename"
                className="text-xs font-mono text-brandMint font-semibold truncate"
                title={selectedFile.name}
              >
                {selectedFile.name}
              </span>
              <button
                onClick={handleRemoveImage}
                className="text-xs text-brandRed hover:underline shrink-0 flex items-center gap-1"
                aria-label="Hapus gambar yang diunggah"
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
                Hapus Berkas
              </button>
            </div>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Modul EasyOCR akan memetakan koordinat teks, mengekstrak karakter tulisan secara otomatis, lalu mengumpankannya ke normalisasi NLP.
            </p>
            {/* Info: OCR diproses di backend */}
            <div className="mt-1 p-2 rounded-lg bg-darkBg/60 border border-darkBorder/60">
              <span className="text-[9px] text-brandMint font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-server" /> Gambar dikirim ke backend untuk ekstraksi OCR
              </span>
              <p className="text-[10px] text-gray-500 mt-1">
                EasyOCR akan mengekstrak teks dari gambar secara otomatis di server.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Action Buttons ────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-darkBorder/40 pt-4">
        <Button
          id="btn-clear-image"
          variant="ghost"
          onClick={handleRemoveImage}
          disabled={isLoading}
          className="text-xs"
        >
          <i className="fa-solid fa-trash-can" aria-hidden="true" />
          Bersihkan
        </Button>

        <Button
          id="btn-analyze-image"
          variant="primary"
          onClick={handleAnalyze}
          disabled={isLoading || !selectedFile}
          className="px-6 py-3 text-sm tracking-wide"
        >
          <i className="fa-solid fa-eye" aria-hidden="true" />
          Ekstrak &amp; Analisis
        </Button>
      </div>
    </div>
  );
}

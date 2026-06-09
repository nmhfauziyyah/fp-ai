/* ================================================================
   TextInputPanel.jsx — Panel Input Teks Berita
   Props:
   - onAnalyze : (text: string, tab: string) => void
   - onReset   : () => void
   - isLoading : boolean
   ================================================================ */

import React, { useState } from 'react';
import Button from '../ui/Button';

const PLACEHOLDER = 'Masukkan atau tempelkan narasi berita di sini untuk diuji kebenarannya oleh IndoBERT...';

/**
 * @param {Object}   props
 * @param {Function} props.onAnalyze - Dipanggil dengan (text, 'text')
 * @param {Function} props.onReset   - Reset result panel
 * @param {boolean}  props.isLoading - Nonaktifkan tombol saat loading
 */
export default function TextInputPanel({ onAnalyze, onReset, isLoading }) {
  const [inputText, setInputText] = useState('');

  const handleAnalyze = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      alert('Masukkan teks berita terlebih dahulu!');
      return;
    }
    onAnalyze(trimmed, 'text');
  };

  const handleClear = () => {
    setInputText('');
    onReset();
  };

  return (
    <div
      id="content-text"
      role="tabpanel"
      aria-labelledby="tab-text"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-4"
    >
      {/* ── Panel Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-urbanist text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brandMint rounded-full" aria-hidden="true" />
          Klasifikasi Teks Berita
        </h2>
        <span className="text-xs text-gray-400">Masukkan paragraf berita untuk dianalisis</span>
      </div>

      {/* ── Textarea Input ────────────────────────────────────────── */}
      <textarea
        id="input-text-area"
        rows={11}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={PLACEHOLDER}
        className="w-full rounded-xl bg-darkBg/60 border border-darkBorder p-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brandMint focus:ring-1 focus:ring-brandMint transition glow-mint text-sm resize-none"
        aria-label="Input teks berita untuk dianalisis"
      />

      {/* ── Action Buttons ────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-darkBorder/40 pt-4">
        <Button
          id="btn-clear-text"
          variant="ghost"
          onClick={handleClear}
          disabled={isLoading}
          className="text-xs"
        >
          <i className="fa-solid fa-trash-can" aria-hidden="true" />
          Bersihkan
        </Button>

        <Button
          id="btn-analyze-text"
          variant="primary"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-6 py-3 text-sm tracking-wide"
        >
          <i className="fa-solid fa-brain" aria-hidden="true" />
          Jalankan Deteksi AI
        </Button>
      </div>
    </div>
  );
}

/* ================================================================
   useHoaxAnalysis.js — Custom Hook
   Mengelola state pipeline analisis dan integrasi ke API backend.

   State:
   ─ activeTab      : 'text' | 'link' | 'image'
   ─ analysisStatus : 'idle' | 'loading' | 'result' | 'error'
   ─ loadingStep    : { title, detail }
   ─ result         : { isHoax, score, label, ocrText } | null
   ─ errorMsg       : string | null

   Fungsi:
   ─ setActiveTab(tab)
   ─ analyze(inputData, tabType, extraData?)
   ─ reset()
   ================================================================ */

import { useState, useCallback } from 'react';
import { predictText, predictUrl, predictImage } from '../services/api';

// ── Loading pipeline steps per tipe input ────────────────────────────────────
const PIPELINE_STEPS = {
  text: [
    { title: 'Tokenisasi Teks...', detail: 'Memotong kalimat masukan menjadi sub-word token...' },
    { title: 'NLP Preprocessing...', detail: 'Membersihkan imbuhan, slang, dan menyamakan format dataset...' },
    { title: 'Klasifikasi Model IndoBERT...', detail: 'Mengukur semantik kalimat pada arsitektur deep learning...' },
  ],
  link: [
    { title: 'Crawling Konten Berita...', detail: 'Mengambil paragraf utama dari URL yang diberikan...' },
    { title: 'NLP Preprocessing...', detail: 'Membersihkan imbuhan, slang, dan menyamakan format dataset...' },
    { title: 'Klasifikasi Model IndoBERT...', detail: 'Mengukur semantik kalimat pada arsitektur deep learning...' },
  ],
  image: [
    { title: 'Ekstraksi EasyOCR...', detail: 'Memindai koordinat piksel gambar dan menyalin karakter tulisan...' },
    { title: 'NLP Preprocessing...', detail: 'Membersihkan imbuhan, slang, dan menyamakan format dataset...' },
    { title: 'Klasifikasi Model IndoBERT...', detail: 'Mengukur semantik kalimat pada arsitektur deep learning...' },
  ],
};

// ── Normalisasi response dari API backend ─────────────────────────────────────
// Format response: {
//   "label": "hoax" | "valid",
//   "confidences": [{ "confidence": 0.9998, "label": "hoax" }, ...]
// }
const normalizeResponse = (raw) => {
  // Baca label utama (sudah string "hoax" atau "valid")
  const label = (raw?.label || '').toString().toLowerCase().trim();
  const isHoax = label === 'hoax';

  // Ambil confidence score dari array confidences
  // Cari confidence yang labelnya sama dengan label utama
  let scoreFloat = 0;
  if (Array.isArray(raw?.confidences) && raw.confidences.length > 0) {
    const matched = raw.confidences.find(
      (c) => c.label?.toLowerCase() === label
    );
    scoreFloat = matched?.confidence ?? raw.confidences[0]?.confidence ?? 0;
  } else {
    // Fallback jika tidak ada array confidences
    scoreFloat = raw?.score ?? raw?.confidence ?? 0;
  }

  // Konversi ke persentase bulat (0–100)
  const score = Math.round(scoreFloat * 100);

  return { isHoax, score };
};

// ── Delay helper ─────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// useHoaxAnalysis
// ============================================================================
export function useHoaxAnalysis() {
  const [activeTab,       setActiveTabState]   = useState('text');
  const [analysisStatus,  setAnalysisStatus]   = useState('idle');
  const [loadingStep,     setLoadingStep]      = useState({ title: '', detail: '' });
  const [result,          setResult]           = useState(null);
  const [errorMsg,        setErrorMsg]         = useState(null);

  // ── Ganti tab & reset ke idle ─────────────────────────────────────────────
  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    setAnalysisStatus('idle');
    setResult(null);
    setErrorMsg(null);
  }, []);

  // ── Reset ke idle ─────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setAnalysisStatus('idle');
    setResult(null);
    setErrorMsg(null);
  }, []);

  // ── Pipeline analisis utama ───────────────────────────────────────────────
  /**
   * @param {string}      inputData  - Teks / URL / teks OCR placeholder
   * @param {'text'|'link'|'image'} tabType
   * @param {File|null}   imageFile  - File object (hanya jika tabType === 'image')
   */
  const analyze = useCallback(async (inputData, tabType, imageFile = null) => {
    setAnalysisStatus('loading');
    setResult(null);
    setErrorMsg(null);

    const steps = PIPELINE_STEPS[tabType] || PIPELINE_STEPS.text;

    // ── Animasi pipeline steps (paralel dengan API call yang sedang berjalan) ─
    setLoadingStep(steps[0]);
    await delay(600);
    setLoadingStep(steps[1]);
    await delay(700);
    setLoadingStep(steps[2]);

    try {
      // ── Pilih fungsi API sesuai tipe tab ────────────────────────────────
      let raw;

      if (tabType === 'text') {
        // POST /predict dengan body JSON { "text": "..." }
        raw = await predictText(inputData);

      } else if (tabType === 'link') {
        // POST /predict dengan body JSON { "url": "..." }
        raw = await predictUrl(inputData);

      } else if (tabType === 'image') {
        // POST /predict dengan FormData, key "image" = File object
        // Backend akan OCR dulu, baru predict
        if (!imageFile) throw new Error('File gambar tidak tersedia.');
        raw = await predictImage(imageFile);
      }

      // ── Normalisasi response → format seragam ────────────────────────────
      const { isHoax, score } = normalizeResponse(raw);

      setResult({
        isHoax,
        score,
        // Label langsung dari API: "hoax" atau "valid"
        rawLabel: raw?.label || '—',
        // Array confidences untuk semua label dari model
        confidences: raw?.confidences || [],
        // Untuk tab image: teks OCR dari backend jika ada
        ocrText: tabType === 'image'
          ? (raw?.ocr_text || raw?.extracted_text || raw?.text || null)
          : null,
      });
      setAnalysisStatus('result');

    } catch (err) {
      console.error('[useHoaxAnalysis] API error:', err.message);
      setErrorMsg(err.message || 'Gagal menghubungi server. Pastikan backend berjalan di localhost:5000.');
      setAnalysisStatus('error');
    }
  }, []);

  return {
    activeTab,
    analysisStatus,
    loadingStep,
    result,
    errorMsg,
    setActiveTab,
    analyze,
    reset,
  };
}

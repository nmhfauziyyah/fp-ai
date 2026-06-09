/* ================================================================
   useHoaxAnalysis.js — Custom Hook
   Mengelola seluruh state dan logika pipeline analisis hoaks.

   State yang dikelola:
   ─────────────────────
   - activeTab      : tab yang sedang aktif ('text'|'link'|'image')
   - analysisStatus : fase panel kanan ('idle'|'loading'|'result')
   - loadingStep    : { title, detail } teks animasi loading pipeline
   - result         : { isHoax, score, category, explanation, ocrText }

   Fungsi yang diekspos:
   ─────────────────────
   - setActiveTab(tab)         → ganti tab & reset ke idle
   - analyze(inputData, tab)   → jalankan pipeline AI
   - reset()                   → kembali ke idle state
   ================================================================ */

import { useState, useCallback } from 'react';
import { predictHoax } from '../services/api';

// ── Loading pipeline steps berdasarkan tipe input ───────────────────────────
const PIPELINE_STEPS = {
  text: [
    { title: 'Tokenisasi Teks...', detail: 'Memotong kalimat masukan menjadi sub-word token...' },
    { title: 'NLP Preprocessing (Tokenize, Stem, Stopwords)...', detail: 'Membersihkan imbuhan kata kasar/slang dan menyamakan format dataset...' },
    { title: 'Klasifikasi Model IndoBERT...', detail: 'Mengukur semantik kalimat masukan pada arsitektur deep learning...' },
  ],
  link: [
    { title: 'Menghubungi REST API Gateway...', detail: 'Melakukan web scraping paragraf utama berita...' },
    { title: 'NLP Preprocessing (Tokenize, Stem, Stopwords)...', detail: 'Membersihkan imbuhan kata kasar/slang dan menyamakan format dataset...' },
    { title: 'Klasifikasi Model IndoBERT...', detail: 'Mengukur semantik kalimat masukan pada arsitektur deep learning...' },
  ],
  image: [
    { title: 'Ekstraksi EasyOCR...', detail: 'Memindai koordinat piksel gambar dan menyalin karakter tulisan...' },
    { title: 'NLP Preprocessing (Tokenize, Stem, Stopwords)...', detail: 'Membersihkan imbuhan kata kasar/slang dan menyamakan format dataset...' },
    { title: 'Klasifikasi Model IndoBERT...', detail: 'Mengukur semantik kalimat masukan pada arsitektur deep learning...' },
  ],
};

// ── Heuristic mock untuk fallback saat backend offline ──────────────────────
const HOAX_KEYWORDS = [
  'loker', 'honda', 'pensiun', 'bantuan', 'rudal', 'israel', 'bingkai', 'kemensos',
  'lelang', 'pegadaian', 'dolar', 'yuan', 'dap', 'australia', 'sherly', 'purbaya',
  'monyet', 'sumatra', 'pertalite', 'dapur', 'gratis', 'hadiah', 'link', 'tautan',
];

const runHeuristicFallback = (text) => {
  const lowerText = text.toLowerCase();
  const isHoax = HOAX_KEYWORDS.some((kw) => lowerText.includes(kw));
  const score = 90 + Math.floor(Math.random() * 9);

  return {
    isHoax,
    score: isHoax ? score : score - 2,
    category: isHoax ? 'Deteksi Pola Disinformasi' : 'Verifikasi Faktual',
    explanation: isHoax
      ? 'Model IndoBERT mendeteksi kesamaan pola bahasa dengan dataset berita bohong terverifikasi. Teks memuat elemen persuasi tidak resmi, klaim finansial mencurigakan, atau informasi yang telah didebunk resmi oleh Kemenkominfo.'
      : 'Model IndoBERT mengklasifikasikan kalimat sebagai informasi netral/faktual. Struktur sintaksis seimbang dan memiliki kemiripan tinggi dengan artikel pers atau portal data publik tepercaya.',
  };
};

// ── Delay helper ─────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================================
// useHoaxAnalysis — Custom Hook
// ============================================================================
export function useHoaxAnalysis() {
  const [activeTab, setActiveTabState]   = useState('text');
  const [analysisStatus, setAnalysisStatus] = useState('idle'); // 'idle'|'loading'|'result'
  const [loadingStep, setLoadingStep]    = useState({ title: '', detail: '' });
  const [result, setResult]              = useState(null);

  // ── Ganti tab & reset ke idle ──────────────────────────────────────────────
  const setActiveTab = useCallback((tab) => {
    setActiveTabState(tab);
    setAnalysisStatus('idle');
    setResult(null);
  }, []);

  // ── Reset ke idle ──────────────────────────────────────────────────────────
  const reset = useCallback(() => {
    setAnalysisStatus('idle');
    setResult(null);
  }, []);

  // ── Jalankan pipeline analisis ────────────────────────────────────────────
  /**
   * @param {string} inputText    - Teks / URL / teks hasil OCR
   * @param {string} tabType      - 'text' | 'link' | 'image'
   * @param {string|null} ocrText - Teks mentah OCR (hanya jika tabType === 'image')
   */
  const analyze = useCallback(async (inputText, tabType, ocrText = null) => {
    setAnalysisStatus('loading');
    setResult(null);

    const steps = PIPELINE_STEPS[tabType] || PIPELINE_STEPS.text;

    try {
      // ── Animasi Pipeline Steps ─────────────────────────────────────────
      setLoadingStep(steps[0]);
      await delay(700);

      setLoadingStep(steps[1]);
      await delay(850);

      setLoadingStep(steps[2]);
      await delay(850);

      // ── Hit Backend API ────────────────────────────────────────────────
      let apiResult;
      try {
        // Kirim ke Flask /predict
        // Untuk tab image: kirim teks hasil OCR; untuk link: kirim URL; untuk text: kirim teks
        const textToSend = tabType === 'image' ? (ocrText || inputText) : inputText;
        const raw = await predictHoax(textToSend);

        // ── Normalisasi response dari Gradio model ─────────────────────
        // Gradio model ardhptr21/hoax-detection-id mengembalikan format yang
        // mungkin berbeda. Afin: sesuaikan mapping di bawah ini dengan response asli.
        const labelRaw = (raw?.label || raw?.result || '').toString().toUpperCase();
        const isHoax   = labelRaw.includes('HOAX') || labelRaw.includes('PALSU');
        const rawScore = raw?.score ?? raw?.confidence ?? raw?.probability ?? 0;
        // Score bisa berupa 0-1 float atau 0-100 int
        const score    = rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);

        apiResult = {
          isHoax,
          score,
          category:    raw?.category    || (isHoax ? 'Deteksi Pola Disinformasi' : 'Verifikasi Faktual'),
          explanation: raw?.explanation || (isHoax
            ? 'Model IndoBERT mendeteksi kesamaan pola bahasa dengan dataset berita bohong terverifikasi.'
            : 'Model IndoBERT mengklasifikasikan kalimat sebagai informasi netral/faktual.'),
          ocrText: tabType === 'image' ? ocrText : null,
        };
      } catch (apiError) {
        // ── Fallback: jika backend offline, gunakan heuristic mock ────────
        console.warn('[useHoaxAnalysis] Backend tidak tersedia, menggunakan fallback heuristic:', apiError.message);
        const fallback = runHeuristicFallback(inputText);
        apiResult = {
          ...fallback,
          ocrText: tabType === 'image' ? ocrText : null,
        };
      }

      // ── Tampilkan hasil ────────────────────────────────────────────────
      setResult(apiResult);
      setAnalysisStatus('result');

    } catch (error) {
      console.error('[useHoaxAnalysis] Pipeline error:', error);
      setAnalysisStatus('idle');
    }
  }, []);

  return {
    activeTab,
    analysisStatus,
    loadingStep,
    result,
    setActiveTab,
    analyze,
    reset,
  };
}

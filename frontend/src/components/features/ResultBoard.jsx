/* ================================================================
   ResultBoard.jsx — Panel Kanan: Hasil Analisis AI
   Menampilkan 3 kondisi state secara kondisional:
   1. 'idle'    → Placeholder "Siap Menganalisis"
   2. 'loading' → LoadingSpinner dengan step animasi pipeline
   3. 'result'  → GaugeMeter + badge + penjelasan + OCR output

   Props:
   - status      : 'idle' | 'loading' | 'result'
   - result      : { isHoax, score, category, explanation, ocrText } | null
   - loadingStep : { title, detail }
   - activeTab   : 'text' | 'link' | 'image'
   ================================================================ */

import React, { useEffect, useRef } from 'react';
import GaugeMeter from '../ui/GaugeMeter';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * @param {Object}      props
 * @param {'idle'|'loading'|'result'} props.status
 * @param {Object|null} props.result
 * @param {Object}      props.loadingStep
 * @param {string}      props.activeTab
 */
export default function ResultBoard({ status, result, loadingStep, activeTab }) {
  const resultBoxRef = useRef(null);

  // Auto-scroll ke hasil saat muncul di mobile
  useEffect(() => {
    if (status === 'result' && resultBoxRef.current) {
      resultBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [status]);

  // Tentukan warna border & glow berdasarkan hasil
  const isHoax = result?.isHoax ?? false;
  const borderColor = status === 'result'
    ? (isHoax ? 'border-brandRed/30' : 'border-brandGreen/30')
    : 'border-transparent';
  const glowColor = isHoax ? 'bg-brandRed' : 'bg-brandGreen';

  // Warna & teks badge hasil
  const badgeColorClass = isHoax ? 'text-brandRed' : 'text-brandGreen';
  const badgeText       = isHoax ? 'TERINDIKASI HOAKS' : 'TERVERIFIKASI VALID';

  // Warna teks kategori
  const categoryColor = isHoax ? 'text-brandRed' : 'text-brandGreen';

  // Simulasi latency display
  const latency = result ? (0.8 + Math.random() * 0.4).toFixed(2) : null;

  return (
    <section className="lg:col-span-5 flex flex-col gap-6" aria-label="Panel hasil analisis">

      {/* ══════════════════════════════════════════════════════════
          STATE 1: IDLE — Placeholder
          ══════════════════════════════════════════════════════════ */}
      {status === 'idle' && (
        <div
          id="placeholder-box"
          className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[460px] h-full border border-dashed border-darkBorder"
        >
          <div className="w-20 h-20 rounded-full bg-darkCard flex items-center justify-center text-gray-500 border border-darkBorder">
            <i className="fa-solid fa-microchip text-4xl animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white font-urbanist">Siap Menganalisis</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-[280px] mx-auto leading-relaxed">
              Silakan masukkan teks berita, URL, atau unggah gambar di panel kiri.
              Hasil klasifikasi model IndoBERT beserta skor keyakinan akan tampil di sini secara real-time.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STATE 2: LOADING — Spinner + Pipeline Steps
          ══════════════════════════════════════════════════════════ */}
      {status === 'loading' && (
        <div
          id="loading-box"
          className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-6 min-h-[460px] h-full"
          role="status"
          aria-live="polite"
          aria-label="Memproses analisis..."
        >
          <LoadingSpinner
            title={loadingStep?.title || 'Memproses...'}
            detail={loadingStep?.detail || ''}
          />
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STATE 3: RESULT — Analisis Lengkap
          ══════════════════════════════════════════════════════════ */}
      {status === 'result' && result && (
        <div
          ref={resultBoxRef}
          id="result-box"
          className={`glass-panel rounded-2xl p-6 border-2 ${borderColor} flex flex-col gap-6 relative overflow-hidden min-h-[460px] animate-fade-in`}
          role="region"
          aria-label="Hasil klasifikasi hoax detector"
          aria-live="assertive"
        >
          {/* Background glow orb */}
          <div
            id="result-bg-glow"
            className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-2xl opacity-10 pointer-events-none ${glowColor}`}
            aria-hidden="true"
          />

          {/* ── Result Header ──────────────────────────────────── */}
          <div className="flex items-center justify-between border-b border-darkBorder/40 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brandMint/10 flex items-center justify-center text-brandMint text-sm">
                <i className="fa-solid fa-square-poll-vertical" aria-hidden="true" />
              </div>
              <h3 className="font-bold text-white font-urbanist">Hasil Analisis Model AI</h3>
            </div>
            <span
              id="timestamp-text"
              className="text-[10px] text-gray-400 font-mono"
              aria-label={`Selesai dianalisis dalam ${latency} detik`}
            >
              Selesai dalam {latency}s
            </span>
          </div>

          {/* ── Gauge + Verdict ────────────────────────────────── */}
          <div className="flex flex-col items-center gap-6">
            {/* Radial Gauge Meter */}
            <GaugeMeter score={result.score} isHoax={result.isHoax} />

            {/* Status Classification */}
            <div className="text-center flex flex-col gap-1.5 w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Hasil Klasifikasi Akhir
              </span>

              <h2
                id="result-badge-text"
                className={`text-2xl font-black font-urbanist tracking-wide ${badgeColorClass}`}
              >
                {badgeText}
              </h2>

              {/* Explanation Card */}
              <div className="p-4 rounded-xl bg-darkBg/50 border border-darkBorder mt-2 text-left">
                <p
                  id="result-explanation"
                  className="text-xs text-gray-300 leading-relaxed"
                >
                  <strong className={`${categoryColor} font-semibold`}>
                    [KATEGORI: {result.category}]
                  </strong>
                  <br /><br />
                  {result.explanation}
                </p>
              </div>
            </div>
          </div>

          {/* ── OCR Raw Text Output (hanya tab Gambar) ─────────── */}
          {activeTab === 'image' && result.ocrText && (
            <div
              id="ocr-details"
              className="p-4 rounded-xl border border-darkBorder bg-darkBg/60 flex flex-col gap-1.5"
            >
              <span className="text-[10px] text-brandMint font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-eye" aria-hidden="true" />
                Teks Ekstraksi OCR:
              </span>
              <p
                id="ocr-raw-text"
                className="text-xs text-gray-300 font-mono italic leading-relaxed"
              >
                &ldquo;{result.ocrText}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

    </section>
  );
}

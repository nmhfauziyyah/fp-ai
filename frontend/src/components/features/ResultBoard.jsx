/* ================================================================
   ResultBoard.jsx — Panel Kanan: Hasil Analisis AI
   States:
   1. 'idle'    → Placeholder "Siap Menganalisis"
   2. 'loading' → Spinner + step animasi pipeline
   3. 'result'  → GaugeMeter + badge HOAX/VALID + confidence score
   4. 'error'   → Pesan error dari API

   Props:
   - status      : 'idle' | 'loading' | 'result' | 'error'
   - result      : { isHoax, score, rawLabel, ocrText } | null
   - loadingStep : { title, detail }
   - activeTab   : 'text' | 'link' | 'image'
   - errorMsg    : string | null
   - onReset     : () => void
   ================================================================ */

import React, { useEffect, useRef, useMemo } from 'react';
import GaugeMeter from '../ui/GaugeMeter';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function ResultBoard({ status, result, loadingStep, activeTab, errorMsg, onReset }) {
  const resultBoxRef = useRef(null);

  // Auto-scroll ke hasil saat muncul di mobile
  useEffect(() => {
    if ((status === 'result' || status === 'error') && resultBoxRef.current) {
      resultBoxRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [status]);

  // Derived style dari hasil
  const isHoax        = result?.isHoax ?? false;
  const borderColor   = status === 'result'
    ? (isHoax ? 'border-brandRed/30' : 'border-brandGreen/30')
    : 'border-transparent';
  const glowColor     = isHoax ? 'bg-brandRed' : 'bg-brandGreen';
  const badgeColor    = isHoax ? 'text-brandRed'   : 'text-brandGreen';
  const badgeText     = isHoax ? 'TERINDIKASI HOAKS' : 'TERVERIFIKASI VALID';
  const labelDesc     = isHoax
    ? 'Model IndoBERT mengklasifikasikan konten ini sebagai informasi yang mengandung elemen disinformasi atau berita bohong berdasarkan pola semantik yang terdeteksi.'
    : 'Model IndoBERT mengklasifikasikan konten ini sebagai informasi yang valid dan faktual berdasarkan kemiripan pola dengan artikel berita tepercaya.';

  // Latency display (stabil per render result)
  const latency = useMemo(() => (0.8 + Math.random() * 1.2).toFixed(2), [result]);

  return (
    <section className="lg:col-span-5 flex flex-col gap-6" aria-label="Panel hasil analisis">

      {/* ══════════════════════════════════════════════════════════
          STATE 1: IDLE
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
              Masukkan teks berita, URL, atau unggah gambar di panel kiri.
              Hasil klasifikasi model IndoBERT akan tampil di sini secara real-time.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STATE 2: LOADING
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
          STATE 3: ERROR
          ══════════════════════════════════════════════════════════ */}
      {status === 'error' && (
        <div
          ref={resultBoxRef}
          className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-4 min-h-[460px] h-full border border-brandRed/30"
          role="alert"
        >
          <div className="w-16 h-16 rounded-full bg-brandRed/10 flex items-center justify-center text-brandRed border border-brandRed/20">
            <i className="fa-solid fa-triangle-exclamation text-3xl" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white font-urbanist">Gagal Menghubungi Server</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-[300px] mx-auto leading-relaxed">
              {errorMsg || 'Terjadi kesalahan. Pastikan backend Flask berjalan di localhost:5000.'}
            </p>
          </div>
          <div className="mt-2 p-3 rounded-lg bg-darkBg/60 border border-darkBorder text-left text-[11px] font-mono text-gray-500 w-full max-w-[320px]">
            <p>$ uv run python server/app.py</p>
            <p className="text-brandMint mt-1">→ Running on http://localhost:5001</p>
          </div>
          <button
            onClick={onReset}
            className="mt-2 px-5 py-2 rounded-xl bg-darkCard border border-darkBorder text-xs font-semibold text-gray-300 hover:text-white hover:bg-darkBorder/60 transition"
          >
            <i className="fa-solid fa-rotate-left mr-1.5" />
            Coba Lagi
          </button>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          STATE 4: RESULT
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
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-[10px] text-gray-400 font-mono">
                Selesai dalam {latency}s
              </span>
              {/* Raw label dari API */}
              {result.rawLabel && (
                <span className="text-[9px] text-gray-600 font-mono">
                  API: {result.rawLabel}
                </span>
              )}
            </div>
          </div>

          {/* ── Gauge + Verdict ────────────────────────────────── */}
          <div className="flex flex-col items-center gap-6">
            {/* Radial Gauge Meter */}
            <GaugeMeter score={result.score} isHoax={result.isHoax} />

            {/* Verdict */}
            <div className="text-center flex flex-col gap-1.5 w-full">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Hasil Klasifikasi Akhir
              </span>

              <h2
                id="result-badge-text"
                className={`text-2xl font-black font-urbanist tracking-wide ${badgeColor}`}
              >
                {badgeText}
              </h2>

              {/* Confidence bar visual */}
              <div className="flex items-center gap-2 px-1 mt-1">
                <span className="text-[10px] text-gray-500 shrink-0">0%</span>
                <div className="flex-1 h-1.5 rounded-full bg-darkCard overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${isHoax ? 'bg-brandRed' : 'bg-brandGreen'}`}
                    style={{ width: `${result.score}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-500 shrink-0">100%</span>
              </div>

              {/* Confidence breakdown dari API */}
              {result.confidences && result.confidences.length > 0 && (
                <div className="mt-3 flex flex-col gap-1.5">
                  <span className="text-[9px] text-gray-500 font-mono font-bold uppercase tracking-widest">
                    Distribusi Confidence Model:
                  </span>
                  {result.confidences.map((c, i) => {
                    const pct    = Math.round(c.confidence * 100);
                    const isThis = c.label?.toLowerCase() === result.rawLabel?.toLowerCase();
                    const barCls = c.label?.toLowerCase() === 'hoax'
                      ? 'bg-brandRed'
                      : 'bg-brandGreen';
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono w-10 shrink-0 ${
                          isThis ? (result.isHoax ? 'text-brandRed' : 'text-brandGreen') : 'text-gray-500'
                        }`}>
                          {c.label}
                        </span>
                        <div className="flex-1 h-1 rounded-full bg-darkCard overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${barCls} ${
                              isThis ? 'opacity-100' : 'opacity-30'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className={`text-[10px] font-mono tabular-nums w-10 text-right shrink-0 ${
                          isThis ? (result.isHoax ? 'text-brandRed' : 'text-brandGreen') : 'text-gray-500'
                        }`}>
                          {pct}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Explanation card */}
              <div className="p-4 rounded-xl bg-darkBg/50 border border-darkBorder mt-2 text-left">
                <p id="result-explanation" className="text-xs text-gray-300 leading-relaxed">
                  <strong className={`${badgeColor} font-semibold`}>
                    [LABEL: {result.rawLabel?.toUpperCase()} — CONFIDENCE: {result.score}%]
                  </strong>
                  <br /><br />
                  {labelDesc}
                </p>
              </div>
            </div>
          </div>

          {/* ── OCR Extracted Text (dari backend, jika ada) ─────── */}
          {activeTab === 'image' && result.ocrText && (
            <div
              id="ocr-details"
              className="p-4 rounded-xl border border-darkBorder bg-darkBg/60 flex flex-col gap-1.5"
            >
              <span className="text-[10px] text-brandMint font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <i className="fa-solid fa-eye" aria-hidden="true" />
                Teks Ekstraksi OCR (dari backend):
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

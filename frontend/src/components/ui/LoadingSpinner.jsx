/* ================================================================
   LoadingSpinner.jsx — Animasi Loading Multi-Step Pipeline
   Menampilkan spinner berputar + teks step yang dapat dikustomisasi.
   ================================================================ */

import React from 'react';

/**
 * @param {Object} props
 * @param {string} props.title  - Judul step loading (uppercase)
 * @param {string} props.detail - Deskripsi detail step loading
 */
export default function LoadingSpinner({ title = 'Memproses...', detail = '' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      {/* ── Spinner Ring ─────────────────────────────────────────── */}
      <div className="relative w-16 h-16" role="status" aria-label="loading">
        {/* Background ring */}
        <div className="absolute inset-0 rounded-full border-4 border-darkBorder" />
        {/* Spinning mint ring */}
        <div className="absolute inset-0 rounded-full border-4 border-brandMint border-t-transparent animate-spin" />
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-brandMint opacity-60 animate-pulse" />
        </div>
      </div>

      {/* ── Step Text ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-2 max-w-[260px]">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider animate-pulse">
          {title}
        </h4>
        {detail && (
          <p className="text-xs text-gray-400 leading-relaxed">
            {detail}
          </p>
        )}
      </div>
    </div>
  );
}

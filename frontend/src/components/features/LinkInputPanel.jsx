/* ================================================================
   LinkInputPanel.jsx — Panel Input Tautan (URL)
   Props:
   - onAnalyze : (url: string, tab: string) => void
   - onReset   : () => void
   - isLoading : boolean
   ================================================================ */

import React, { useState } from 'react';
import Button from '../ui/Button';

/**
 * @param {Object}   props
 * @param {Function} props.onAnalyze - Dipanggil dengan (url, 'link')
 * @param {Function} props.onReset   - Reset result panel
 * @param {boolean}  props.isLoading - Nonaktifkan tombol saat loading
 */
export default function LinkInputPanel({ onAnalyze, onReset, isLoading }) {
  const [inputUrl, setInputUrl] = useState('');

  const handleAnalyze = () => {
    const trimmed = inputUrl.trim();
    if (!trimmed) {
      alert('Masukkan tautan URL terlebih dahulu!');
      return;
    }
    onAnalyze(trimmed, 'link');
  };

  const handleClear = () => {
    setInputUrl('');
    onReset();
  };

  return (
    <div
      id="content-link"
      role="tabpanel"
      aria-labelledby="tab-link"
      className="glass-panel rounded-2xl p-6 flex flex-col gap-4"
    >
      {/* ── Panel Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold font-urbanist text-white flex items-center gap-2">
          <span className="w-1.5 h-4 bg-brandMint rounded-full" aria-hidden="true" />
          Analisis Via Tautan Web
        </h2>
        <span className="text-xs text-gray-400">Pengecekan otomatis via scraping</span>
      </div>

      {/* ── URL Input with Icon Prefix ────────────────────────────── */}
      <div className="relative my-4">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
          <i className="fa-solid fa-link" aria-hidden="true" />
        </div>
        <input
          id="input-link-field"
          type="url"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Masukkan URL, contoh: https://news.detik.com/berita/informasi-terkini..."
          onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleAnalyze()}
          className="w-full rounded-xl bg-darkBg/60 border border-darkBorder py-4 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-brandMint focus:ring-1 focus:ring-brandMint transition glow-mint text-sm"
          aria-label="Input URL berita untuk dianalisis"
        />
      </div>

      {/* ── Action Buttons ────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-darkBorder/40 pt-4">
        <Button
          id="btn-clear-link"
          variant="ghost"
          onClick={handleClear}
          disabled={isLoading}
          className="text-xs"
        >
          <i className="fa-solid fa-trash-can" aria-hidden="true" />
          Bersihkan
        </Button>

        <Button
          id="btn-analyze-link"
          variant="primary"
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-6 py-3 text-sm tracking-wide"
        >
          <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
          Scrape &amp; Analisis
        </Button>
      </div>
    </div>
  );
}

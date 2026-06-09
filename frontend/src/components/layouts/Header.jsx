/* ================================================================
   Header.jsx — Top Navigation Header
   Menampilkan logo shield, nama aplikasi, badge versi,
   dan status chip "BERT Engine Active".
   ================================================================ */

import React from 'react';
import Badge from '../ui/Badge';

export default function Header() {
  return (
    <header className="border-b border-darkBorder/60 bg-darkBg/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* ── Logo & App Name ─────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          {/* Shield Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brandMint to-brandMintHover flex items-center justify-center text-darkBg shadow-lg shadow-brandMint/20 shrink-0">
            <i className="fa-solid fa-shield-halved text-xl" aria-hidden="true" />
          </div>

          {/* App Title */}
          <div>
            <h1 className="text-xl font-extrabold font-urbanist tracking-tight text-white flex items-center gap-2 flex-wrap">
              Hoax Detector
              <Badge variant="mint">v1.0-AI</Badge>
            </h1>
            <p className="text-xs text-gray-400">Detektor Hoaks Terintegrasi OCR</p>
          </div>
        </div>

        {/* ── Engine Status Chip ───────────────────────────────────── */}
        <div
          className="px-3 py-1.5 rounded-lg bg-darkCard border border-darkBorder flex items-center gap-2"
          title="IndoBERT NLP model sedang aktif"
        >
          <span className="w-2 h-2 rounded-full bg-brandGreen animate-pulse" aria-hidden="true" />
          <span className="text-xs text-gray-300 font-mono font-medium hidden sm:inline">
            BERT Engine Active
          </span>
        </div>

      </div>
    </header>
  );
}

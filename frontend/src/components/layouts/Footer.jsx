/* ================================================================
   Footer.jsx — Bottom Footer
   Kredit & metadata platform.
   ================================================================ */

import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-darkBorder/40 bg-darkBg py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-urbanist font-bold text-gray-400 tracking-wider text-sm">
          Hoax Detector IT ITS 2024
        </p>
        <p className="text-[10px] text-gray-500 font-mono">
          Core Platform • IndoBERT NLP
        </p>
      </div>
    </footer>
  );
}

/* ================================================================
   TabNavigation.jsx — Tab Switcher (Teks / Tautan / Gambar)
   Props:
   - activeTab    : 'text' | 'link' | 'image'
   - onTabChange  : (tab: string) => void
   ================================================================ */

import React from 'react';

const TABS = [
  {
    id: 'text',
    label: 'Input Teks',
    icon: 'fa-solid fa-align-left',
    ariaLabel: 'Tab input teks berita',
  },
  {
    id: 'link',
    label: 'Input Tautan (URL)',
    icon: 'fa-solid fa-link',
    ariaLabel: 'Tab input tautan URL',
  },
  {
    id: 'image',
    label: 'Gambar (OCR)',
    icon: 'fa-solid fa-image',
    ariaLabel: 'Tab unggah gambar OCR',
  },
];

/**
 * @param {Object}   props
 * @param {string}   props.activeTab   - ID tab yang aktif
 * @param {Function} props.onTabChange - Callback saat tab dipilih
 */
export default function TabNavigation({ activeTab, onTabChange }) {
  return (
    <nav
      className="p-1.5 rounded-xl bg-darkCard/80 border border-darkBorder/40 flex gap-1.5"
      aria-label="Input mode navigation"
      role="tablist"
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          id={`tab-${tab.id}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          aria-label={tab.ariaLabel}
          onClick={() => onTabChange(tab.id)}
          className={`tab-btn flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-400 hover:text-white flex items-center justify-center gap-2 ${
            activeTab === tab.id ? 'active' : ''
          }`}
        >
          <i className={tab.icon} aria-hidden="true" />
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
        </button>
      ))}
    </nav>
  );
}

/* ================================================================
   Dashboard.jsx — Halaman Utama Hoax Detector
   Menyatukan semua komponen dalam layout grid 12-kolom.

   Layout:
   ┌─────────────────────────────────────────────────────┐
   │ Header                                              │
   ├────────────────────────┬────────────────────────────┤
   │ Input Workspace        │ Result Board               │
   │ (lg:col-span-7)        │ (lg:col-span-5)            │
   │ ┌──────────────────┐   │                            │
   │ │  TabNavigation   │   │  [idle | loading | result] │
   │ ├──────────────────┤   │                            │
   │ │  Active Panel:   │   │                            │
   │ │  Text/Link/Image │   │                            │
   │ └──────────────────┘   │                            │
   ├────────────────────────┴────────────────────────────┤
   │ Footer                                              │
   └─────────────────────────────────────────────────────┘
   ================================================================ */

import React from 'react';
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import TabNavigation from '../components/features/TabNavigation';
import TextInputPanel from '../components/features/TextInputPanel';
import LinkInputPanel from '../components/features/LinkInputPanel';
import ImageOcrPanel from '../components/features/ImageOcrPanel';
import ResultBoard from '../components/features/ResultBoard';
import { useHoaxAnalysis } from '../hooks/useHoaxAnalysis';

export default function Dashboard() {
  const {
    activeTab,
    analysisStatus,
    loadingStep,
    result,
    setActiveTab,
    analyze,
    reset,
  } = useHoaxAnalysis();

  const isLoading = analysisStatus === 'loading';

  return (
    <div className="bg-darkBg text-gray-200 min-h-screen font-sans flex flex-col">

      {/* ── Top Header ────────────────────────────────────────────── */}
      <Header />

      {/* ── Main Content Grid ─────────────────────────────────────── */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── COLUMN 1: Input Workspace (7 cols) ───────────────── */}
        <section
          className="lg:col-span-7 flex flex-col gap-6"
          aria-label="Input workspace untuk analisis konten"
        >
          {/* Tab Switcher */}
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Active Input Panel — conditional render berdasarkan activeTab */}
          {activeTab === 'text' && (
            <TextInputPanel
              onAnalyze={analyze}
              onReset={reset}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'link' && (
            <LinkInputPanel
              onAnalyze={analyze}
              onReset={reset}
              isLoading={isLoading}
            />
          )}
          {activeTab === 'image' && (
            <ImageOcrPanel
              onAnalyze={analyze}
              onReset={reset}
              isLoading={isLoading}
            />
          )}
        </section>

        {/* ── COLUMN 2: Result Board (5 cols) ──────────────────── */}
        <ResultBoard
          status={analysisStatus}
          result={result}
          loadingStep={loadingStep}
          activeTab={activeTab}
        />

      </main>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}

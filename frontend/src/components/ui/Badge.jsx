/* ================================================================
   Badge.jsx — Atomic Badge / Chip Component
   Dipakai untuk label versi, status tag, dll.
   ================================================================ */

import React from 'react';

const VARIANTS = {
  mint:    'bg-brandMint/10 text-brandMint border-brandMint/20',
  green:   'bg-brandGreen/10 text-brandGreen border-brandGreen/20',
  red:     'bg-brandRed/10 text-brandRed border-brandRed/20',
  neutral: 'bg-darkCard text-gray-400 border-darkBorder',
};

/**
 * @param {Object} props
 * @param {'mint'|'green'|'red'|'neutral'} props.variant
 * @param {string} [props.className]
 * @param {React.ReactNode} props.children
 */
export default function Badge({ variant = 'mint', className = '', children }) {
  const base = 'inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-mono font-medium';
  return (
    <span className={`${base} ${VARIANTS[variant] || VARIANTS.mint} ${className}`}>
      {children}
    </span>
  );
}

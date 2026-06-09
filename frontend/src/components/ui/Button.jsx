/* ================================================================
   Button.jsx — Atomic Button Component
   Variants: 'primary' | 'ghost' | 'danger' | 'secondary'
   ================================================================ */

import React from 'react';

const VARIANTS = {
  primary: [
    'bg-brandMint text-darkBg hover:bg-brandMintHover',
    'shadow-lg shadow-brandMint/10',
    'font-bold',
  ].join(' '),

  ghost: [
    'text-gray-400 hover:text-white hover:bg-darkBorder/40',
  ].join(' '),

  danger: [
    'text-brandRed hover:text-red-300 hover:underline',
  ].join(' '),

  secondary: [
    'bg-darkCard text-gray-300 border border-darkBorder',
    'hover:bg-darkBorder/40',
    'font-semibold',
  ].join(' '),
};

/**
 * @param {Object}   props
 * @param {'primary'|'ghost'|'danger'|'secondary'} props.variant
 * @param {string}   [props.className]     - Additional classes
 * @param {boolean}  [props.disabled]
 * @param {Function} props.onClick
 * @param {string}   [props.id]
 * @param {React.ReactNode} props.children
 */
export default function Button({
  variant = 'primary',
  className = '',
  disabled = false,
  onClick,
  id,
  type = 'button',
  children,
}) {
  const base = 'px-4 py-2 rounded-xl text-sm transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = VARIANTS[variant] || VARIANTS.primary;

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variantClasses} ${className}`}
    >
      {children}
    </button>
  );
}

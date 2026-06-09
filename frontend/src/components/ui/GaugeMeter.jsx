/* ================================================================
   GaugeMeter.jsx — SVG Radial Progress Gauge
   Menampilkan lingkaran progress dengan confidence score.

   Props:
   - score   : number (0-100) — angka persentase keyakinan model
   - isHoax  : boolean — menentukan warna gauge (merah/hijau)
   - animate : boolean — aktifkan animasi saat pertama kali muncul
   ================================================================ */

import React, { useEffect, useRef } from 'react';

// Jari-jari SVG circle r=58, cx=cy=72
// Keliling = 2 * π * 58 ≈ 364.42
const RADIUS      = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS; // ≈ 364.42

/**
 * @param {Object}  props
 * @param {number}  props.score   - 0 hingga 100
 * @param {boolean} props.isHoax  - true → merah, false → hijau
 */
export default function GaugeMeter({ score = 85, isHoax = false }) {
  const circleRef = useRef(null);

  // Warna gauge berdasarkan hasil klasifikasi
  const strokeColor = isHoax ? '#EF4444' : '#10B981'; // brandRed | brandGreen
  const textColor   = isHoax ? 'text-brandRed'  : 'text-brandGreen';

  // Hitung stroke-dashoffset dari score
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE;

  useEffect(() => {
    // Animasi dari 0 → offset menggunakan CSS transition (via requestAnimationFrame)
    if (circleRef.current) {
      // Start dari fully empty (CIRCUMFERENCE), lalu animate ke target offset
      circleRef.current.style.strokeDashoffset = CIRCUMFERENCE;
      const timeout = setTimeout(() => {
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = offset;
        }
      }, 80); // small delay agar transition ter-trigger
      return () => clearTimeout(timeout);
    }
  }, [score, offset]);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center" aria-label={`Confidence score: ${score}%`}>
      <svg
        className="w-full h-full transform -rotate-90"
        viewBox="0 0 144 144"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ── Track ring (background) ──────────────────────── */}
        <circle
          cx="72" cy="72" r={RADIUS}
          stroke="#131C2E"
          strokeWidth="10"
          fill="transparent"
        />

        {/* ── Progress ring (animated) ─────────────────────── */}
        <circle
          ref={circleRef}
          cx="72" cy="72" r={RADIUS}
          stroke={strokeColor}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE} /* dimulai dari 0% */
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s ease-out, stroke 0.4s ease',
          }}
        />
      </svg>

      {/* ── Center Text ─────────────────────────────────────── */}
      <div className="absolute text-center">
        <span className={`text-3xl font-black font-mono ${textColor}`}>
          {score}%
        </span>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
          Confidence
        </p>
      </div>
    </div>
  );
}

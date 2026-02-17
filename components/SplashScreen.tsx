'use client'

import { useState, useEffect } from 'react'

const SPLASH_VERSES = [
  'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'رَبِّ زَدْنِي عِلْمًا',
]

const VERSE_DELAY_MS = 1000

// 8-pointed Islamic star SVG path (decorative)
const StarPattern = ({ opacity = 0.12 }: { opacity?: number }) => (
  <svg viewBox="0 0 200 200" className="absolute pointer-events-none" aria-hidden="true">
    <g fill="currentColor" opacity={opacity}>
      {/* Outer 8-point star */}
      <polygon points="100,10 115,50 155,35 130,70 165,90 125,100 155,130 115,120 120,160 100,135 80,160 85,120 45,130 75,100 35,90 70,70 45,35 85,50" />
      {/* Inner octagon */}
      <polygon points="100,45 118,65 140,60 140,82 155,100 140,118 140,140 118,135 100,155 82,135 60,140 60,118 45,100 60,82 60,60 82,65" opacity={0.4} />
    </g>
  </svg>
)

// Decorative divider
const ArabicDivider = () => (
  <svg viewBox="0 0 240 24" className="w-48 sm:w-64" aria-hidden="true">
    <line x1="0" y1="12" x2="90" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
    <polygon points="100,4 120,12 100,20 108,12" fill="currentColor" opacity="0.6" />
    <circle cx="120" cy="12" r="3" fill="currentColor" opacity="0.8" />
    <polygon points="140,4 120,12 140,20 132,12" fill="currentColor" opacity="0.6" />
    <line x1="150" y1="12" x2="240" y2="12" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
  </svg>
)

export default function SplashScreen() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showLoading, setShowLoading] = useState(true)
  const [patternVisible, setPatternVisible] = useState(false)

  useEffect(() => {
    const tp = setTimeout(() => setPatternVisible(true), 100)
    const t0 = setTimeout(() => setVisibleCount(1), 400)
    const t1 = setTimeout(() => setVisibleCount(2), 400 + VERSE_DELAY_MS)
    const t2 = setTimeout(() => setVisibleCount(3), 400 + VERSE_DELAY_MS * 2)
    const t3 = setTimeout(() => setShowLoading(false), 400 + VERSE_DELAY_MS * 2 + 200)
    return () => {
      clearTimeout(tp)
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center
                 bg-gradient-to-b from-[#ede5ff] via-[#e8dcff] to-[#f0e5f5]
                 overflow-hidden"
      aria-hidden="true"
      style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', serif" }}
    >
      {/* ── Corner star ornaments ── */}
      <div
        className={`absolute top-0 left-0 w-40 h-40 text-violet-400 -translate-x-8 -translate-y-8
          transition-opacity duration-1000 ${patternVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <StarPattern opacity={0.15} />
      </div>
      <div
        className={`absolute top-0 right-0 w-40 h-40 text-violet-400 translate-x-8 -translate-y-8
          transition-opacity duration-1000 delay-200 ${patternVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <StarPattern opacity={0.12} />
      </div>
      <div
        className={`absolute bottom-0 left-0 w-40 h-40 text-fuchsia-400 -translate-x-8 translate-y-8
          transition-opacity duration-1000 delay-400 ${patternVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <StarPattern opacity={0.10} />
      </div>
      <div
        className={`absolute bottom-0 right-0 w-40 h-40 text-fuchsia-400 translate-x-8 translate-y-8
          transition-opacity duration-1000 delay-300 ${patternVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <StarPattern opacity={0.10} />
      </div>

      {/* ── Soft radial glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 46%, rgba(167,139,250,0.22) 0%, transparent 70%)',
        }}
      />

      {/* ── Loading indicator (top) ── */}
      {showLoading && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-violet-300 border-t-violet-600 animate-spin"
            aria-hidden="true"
          />
          <span
            className="text-violet-600 text-xs sm:text-sm tracking-wide"
            style={{ fontFamily: 'inherit' }}
          >
            جاري التحميل…
          </span>
        </div>
      )}

      {/* ── Central card ── */}
      <div
        className={`relative flex flex-col items-center px-8 py-8 sm:px-12 sm:py-10
          transition-all duration-700 ease-out
          ${patternVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={{
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.55) 0%, rgba(237,229,255,0.35) 100%)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(167,139,250,0.30)',
          borderRadius: '1.5rem',
          boxShadow:
            '0 4px 32px rgba(139,92,246,0.10), 0 1px 0 rgba(255,255,255,0.6) inset',
          maxWidth: '26rem',
          width: '100%',
        }}
      >
        {/* Top border accent */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-3/4"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(167,139,250,0.7), rgba(216,180,254,0.9), rgba(167,139,250,0.7), transparent)',
          }}
        />

        {/* Logo emblem */}
        <div className="mb-3 relative">
          {/* Halo ring */}
          <div
            className="absolute inset-0 rounded-full -m-2"
            style={{
              background:
                'radial-gradient(circle, rgba(167,139,250,0.2) 0%, transparent 70%)',
              animation: 'pulse 3s ease-in-out infinite',
            }}
          />
          <svg
            viewBox="0 0 80 80"
            className="h-20 w-20 sm:h-24 sm:w-24 relative z-10"
            aria-hidden="true"
          >
            {/* Glow filter */}
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            {/* Dome */}
            <path
              d="M40 8 C20 8 12 28 12 40 Q12 52 40 56 Q68 52 68 40 C68 28 60 8 40 8 Z"
              fill="url(#logoGrad)"
              filter="url(#glow)"
              opacity={0.92}
            />
            {/* Minaret body */}
            <path
              d="M28 44 L52 44 L52 72 L28 72 Z"
              fill="url(#logoGrad)"
              opacity={0.95}
            />
            {/* Lines (pages / text) */}
            <path
              d="M33 49 L47 49 M33 55 L47 55 M33 61 L47 61 M33 67 L47 67"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
              opacity={0.85}
            />
            {/* Crescent atop dome */}
            <path
              d="M36 13 Q40 9 44 13 Q41 11 38 13 Z"
              fill="white"
              opacity={0.75}
            />
          </svg>
        </div>

        {/* Platform name */}
        <h1
          className="text-2xl sm:text-3xl font-bold text-violet-700 mb-1 tracking-wide"
          style={{ fontFamily: 'inherit', letterSpacing: '0.04em' }}
        >
          مَنصَّة فَتْحَة
        </h1>

        {/* Subtitle */}
        <p className="text-violet-500 text-xs sm:text-sm mb-4 tracking-widest opacity-80">
          ✦ تَعَلَّمْ ⋅ تَدَبَّرْ ⋅ اِرْتَقِ ✦
        </p>

        {/* Ornamental divider */}
        <div className="text-violet-400 mb-5">
          <ArabicDivider />
        </div>

        {/* Quranic verses */}
        <div
          dir="rtl"
          className="flex flex-col gap-3 sm:gap-4 text-center w-full"
          style={{ minHeight: '7rem' }}
        >
          {SPLASH_VERSES.map((verse, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ease-out
                ${i < visibleCount
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'}`}
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <p
                className="text-violet-800 text-lg sm:text-xl leading-loose"
                style={{
                  fontFamily: 'inherit',
                  textShadow: '0 1px 2px rgba(109,40,217,0.12)',
                }}
              >
                {verse}
              </p>
              {/* Subtle separator between verses */}
              {i < SPLASH_VERSES.length - 1 && i < visibleCount - 1 && (
                <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-violet-300 to-transparent opacity-50" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom border accent */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-3/4"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), rgba(216,180,254,0.7), rgba(167,139,250,0.5), transparent)',
          }}
        />
      </div>

      {/* ── Bottom tagline ── */}
      <p
        className={`absolute bottom-8 text-violet-400 text-xs tracking-widest
          transition-opacity duration-1000 delay-700
          ${patternVisible ? 'opacity-60' : 'opacity-0'}`}
        style={{ fontFamily: 'inherit', letterSpacing: '0.12em' }}
      >
        بِسْمِ اللَّهِ نَبْدَأُ
      </p>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
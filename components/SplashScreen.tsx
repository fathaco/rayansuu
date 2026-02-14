'use client'

import { useState, useEffect } from 'react'

const SPLASH_VERSES = [
  'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
  'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  'رَبِّ زَدْنِي عِلْمًا',
]

const VERSE_DELAY_MS = 1000 // 1 second between each aya

export default function SplashScreen() {
  const [visibleCount, setVisibleCount] = useState(0)
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Show first verse after a short delay, then one more verse every VERSE_DELAY_MS
    const t0 = setTimeout(() => setVisibleCount(1), 400)
    const t1 = setTimeout(() => setVisibleCount(2), 400 + VERSE_DELAY_MS)
    const t2 = setTimeout(() => setVisibleCount(3), 400 + VERSE_DELAY_MS * 2)
    const t3 = setTimeout(() => setShowLoading(false), 400 + VERSE_DELAY_MS * 2 + 200)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6
                 bg-gradient-to-b from-[#ede5ff] via-[#e8dcff] to-[#f0e5f5]
                 transition-opacity duration-700 ease-out"
      aria-hidden="true"
    >
      {/* Loading spinner - shown until all verses appeared */}
      {showLoading && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div
            className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"
            aria-hidden="true"
          />
          <span className="text-primary-600 text-xs sm:text-sm font-medium">جاري التحميل...</span>
        </div>
      )}

      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <svg
          viewBox="0 0 80 80"
          className="h-20 w-20 sm:h-24 sm:w-24 text-primary-500"
          aria-hidden="true"
        >
          <path
            d="M40 8 C20 8 12 28 12 40 Q12 52 40 56 Q68 52 68 40 C68 28 60 8 40 8 Z"
            fill="currentColor"
            opacity={0.9}
          />
          <path
            d="M28 44 L52 44 L52 72 L28 72 Z"
            fill="currentColor"
            opacity={0.95}
          />
          <path
            d="M34 48 L46 48 M34 54 L46 54 M34 60 L46 60"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-primary-600 mb-8 font-arabic">
        منصة فتحة
      </h1>

      {/* Verses: reveal one by one */}
      <div className="flex flex-col gap-4 sm:gap-5 text-center max-w-md min-h-[4.5rem] sm:min-h-[5rem]">
        {SPLASH_VERSES.map((verse, i) => (
          <p
            key={i}
            className={`text-primary-700 text-base sm:text-lg leading-relaxed font-arabic
              transition-all duration-500 ease-out
              ${i < visibleCount
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
          >
            {verse}
          </p>
        ))}
      </div>
    </div>
  )
}

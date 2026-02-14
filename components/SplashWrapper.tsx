'use client'

import { useState, useEffect } from 'react'
import SplashScreen from './SplashScreen'

const SPLASH_DURATION_MS = 5500 // loading + 3 verses (1s apart) + short pause

export default function SplashWrapper({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const hideAt = SPLASH_DURATION_MS
    const unmountAt = SPLASH_DURATION_MS + 700 // after fade-out

    const t1 = setTimeout(() => setVisible(false), hideAt)
    const t2 = setTimeout(() => setShowSplash(false), unmountAt)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  useEffect(() => {
    if (showSplash) {
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [showSplash])

  return (
    <>
      {children}
      {showSplash && (
        <div
          className={`fixed inset-0 z-[100] transition-opacity duration-700 ease-out ${
            visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <SplashScreen />
        </div>
      )}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.pageYOffset > 300)
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 
                   bg-gradient-primary text-white rounded-full shadow-xl hover:shadow-2xl 
                   hover:-translate-y-1 active:scale-95 transition-all duration-300 
                   flex items-center justify-center touch-manipulation"
          aria-label="العودة للأعلى"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      )}
    </>
  )
}

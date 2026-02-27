'use client'

import { useState, useEffect } from 'react'
import { X, Video, ExternalLink } from 'lucide-react'

const STORAGE_KEY = 'fatha_platform_video_notification_seen'
const INSTAGRAM_REEL_URL = 'https://www.instagram.com/reel/DVPIy5kDSER/?igsh=cm14bHlmczlibXdo'
// Show modal after splash is fully gone (~6.2s) + small delay
const SHOW_AFTER_MS = 6500

export default function VideoNotificationModal() {
  const [show, setShow] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const seen = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY)
    if (seen) return
    const t = setTimeout(() => setShow(true), SHOW_AFTER_MS)
    return () => clearTimeout(t)
  }, [mounted])

  const handleClose = () => {
    setShow(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, '1')
    }
  }

  const handleWatch = () => {
    if (typeof window !== 'undefined') {
      window.open(INSTAGRAM_REEL_URL, '_blank', 'noopener,noreferrer')
    }
    handleClose()
  }

  if (!show) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-notification-title"
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-primary-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Accent bar */}
        <div
          className="h-1 w-full"
          style={{
            background: 'linear-gradient(90deg, #8D37F2, #E93B7A)',
          }}
        />
        <div className="p-6 sm:p-8">
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 left-4 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>

          <div className="flex justify-center mb-4">
            <div
              className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-primary-500"
              aria-hidden
            >
              <Video size={28} />
            </div>
          </div>

          <h2
            id="video-notification-title"
            className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-2"
          >
            شاهد كيف تعمل المنصة
          </h2>
          <p className="text-center text-gray-600 mb-6 leading-relaxed">
            أعدّ فريقنا فيديو قصيراً على إنستغرام يشرح طريقة استخدام منصة فتحة
            والاستفادة من دوراتها. ننصحك بمشاهدته في أول زيارة.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={INSTAGRAM_REEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault()
                handleWatch()
              }}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#8D37F2] hover:bg-[#7a2ed9] text-white font-semibold py-3.5 px-5 rounded-full transition-colors"
            >
              <ExternalLink size={18} />
              <span>مشاهدة الفيديو على إنستغرام</span>
            </a>
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 inline-flex items-center justify-center text-primary-600 hover:text-primary-700 font-semibold py-3.5 px-5 rounded-full border-2 border-primary-200 hover:border-primary-300 transition-colors"
            >
              ربما لاحقاً
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Target, BookOpen, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import ReservationModal from '@/components/ReservationModal'
import type { EventRow } from '@/types/database'

export default function EventDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [event, setEvent] = useState<EventRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [registerEvent, setRegisterEvent] = useState<EventRow | null>(null)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    fetch(`/api/events/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) setEvent(data)
      })
      .catch(() => setEvent(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 flex justify-center">
          <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <p className="text-gray-500 text-lg mb-4">الفعالية غير موجودة</p>
          <Link href="/events" className="text-primary-500 font-semibold hover:underline inline-flex items-center gap-2">
            العودة للفعاليات <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    )
  }

  const showBadge = event.badge || (event.is_new ? 'جديد' : '')
  const badgeColor = event.badge_color || 'bg-emerald-500'

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <section className="py-8 sm:py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8 max-w-3xl">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-6 sm:mb-8"
          >
            <ArrowRight className="w-5 h-5" />
            العودة للفعاليات
          </Link>

          <article className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg flex flex-col">
            <div className="relative z-0 bg-gradient-card border-b-4 border-gray-100 h-56 sm:h-72 overflow-hidden shrink-0">
              {event.image_url ? (
                <img
                  src={event.image_url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-20 h-20 sm:w-24 sm:h-24 text-primary-400 opacity-80" strokeWidth={1.5} />
                </div>
              )}
              {showBadge && (
                <div
                  className={`absolute top-3 right-3 sm:top-4 sm:right-4 z-10 ${badgeColor} text-white
                             px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg max-w-[45%] truncate`}
                  title={showBadge}
                >
                  {showBadge}
                </div>
              )}
            </div>

            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col flex-1 bg-white">
              <p className="text-primary-500 font-semibold text-sm mb-2 sm:mb-3">
                {event.category}
              </p>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
                {event.title}
              </h1>
              <p className="text-gray-600 leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg whitespace-pre-wrap">
                {event.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 py-5 sm:py-6 border-t border-gray-100 mb-6 sm:mb-8 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span><span className="text-primary-600 font-medium">{event.hours ?? '—'}</span> ساعات</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span><span className="text-primary-600 font-medium">{event.lessons ?? '—'}</span> دروس</span>
                </div>
                {event.price && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                    <span className="text-primary-600 font-semibold">{/^\d+$/.test(String(event.price).trim()) ? `${event.price} DZD` : event.price}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 sm:gap-4 mt-auto">
                <button
                  type="button"
                  onClick={() => setRegisterEvent(event)}
                  className="flex-1 bg-gradient-primary text-white py-4 px-6 rounded-full
                             font-semibold text-base hover:shadow-xl hover:-translate-y-1
                             transition-all duration-300 min-h-[52px] flex items-center justify-center gap-2"
                >
                  سجّل الآن
                  <Target size={20} />
                </button>
              </div>

              <div className="text-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-100">
                <span className="text-primary-500 font-semibold text-sm">منصة فتحة</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      {registerEvent && (
        <ReservationModal
          event={registerEvent}
          onClose={() => setRegisterEvent(null)}
          onSuccess={() => setRegisterEvent(null)}
        />
      )}
    </main>
  )
}

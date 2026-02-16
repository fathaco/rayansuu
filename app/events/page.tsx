'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import EventCard from '@/components/EventCard'
import type { EventRow } from '@/types/database'

export default function EventsPage() {
  const [events, setEvents] = useState<EventRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : [])
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-5 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <div className="section-badge mb-3 sm:mb-4 px-4 py-2 inline-block">
              <span>الفعاليات والدورات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              الفعاليات <span className="gradient-text">والدورات</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              سجّل في الفعالية التي تناسبك. كل فعالية لها حجوزاتها الخاصة.
            </p>
          </div>

          {loading ? (
            <p className="text-center text-gray-500 py-12">جاري تحميل الفعاليات...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-gray-500 py-12">لا توجد فعاليات حالياً.</p>
          ) : (
            <div className="cards-grid-3">
              {events.map((event) => (
                <div key={event.id} className="min-w-0 h-full">
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </main>
  )
}

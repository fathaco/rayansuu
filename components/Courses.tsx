'use client'

import { useState, useEffect } from 'react'
import { BookOpen } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import EventCard from './EventCard'
import type { EventRow } from '@/types/database'

export default function Courses() {
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
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>الدورات الشرعية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            أحدث <span className="gradient-text">الدورات</span> التعليمية
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            دورات شاملة في مختلف العلوم الشرعية من القرآن والحديث إلى الفقه والعقيدة
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <ScrollReveal animation="fadeUp" className="text-center py-12 sm:py-16">
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 mb-4" strokeWidth={1} />
            <p className="text-gray-500 text-lg">لا توجد فعاليات حالياً.</p>
            <p className="text-gray-400 text-sm mt-2">ستظهر هنا عند إضافة المدير للفعاليات.</p>
          </ScrollReveal>
        ) : (
          <div className="cards-grid-3">
            {events.map((event, index) => (
              <ScrollReveal
                key={event.id}
                animation="scale"
                delay={index * 70}
                className="h-full min-w-0"
              >
                <EventCard event={event} />
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>

    </section>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { MessageCircle } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import type { ReviewRow } from '@/types/database'

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  if (reviews.length === 0 && !loading) return null

  return (
    <section id="reviews" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>آراء الطلاب</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            ما يقوله <span className="gradient-text">طلابنا</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            مراجعات وشفاعات من طلاب وطالبات المنصة
          </p>
        </ScrollReveal>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="cards-grid-3 max-w-6xl mx-auto">
            {reviews.map((review, index) => (
              <ScrollReveal key={review.id} animation="slideStart" delay={index * 80} className="min-w-0">
                <div className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col min-w-0">
                  {review.image_url ? (
                    <div className="relative h-44 sm:h-52 overflow-hidden bg-gray-100">
                      <img
                        src={review.image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-24 sm:h-28 flex items-center justify-center bg-primary-50">
                      <MessageCircle className="w-12 h-12 text-primary-400" strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {review.content ? (
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base flex-1 line-clamp-5">
                        {review.content}
                      </p>
                    ) : (
                      <p className="text-gray-400 text-sm flex-1">مراجعة مصورة</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <span className="text-primary-500 font-semibold text-xs sm:text-sm">منصة فتحة</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

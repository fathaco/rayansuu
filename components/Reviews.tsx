'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { MessageCircle, ChevronLeft, ChevronRight, X, Expand } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import type { ReviewRow } from '@/types/database'

const PER_PAGE = 3
const COLLAPSE_CHARS = 120 // show "show more" after this length

export default function Reviews() {
  const [reviews, setReviews] = useState<ReviewRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/reviews')
      .then((r) => r.json())
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE))
  const paginatedReviews = useMemo(
    () => reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [reviews, page]
  )

  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(totalPages)
  }, [page, totalPages])

  const closeLightbox = useCallback(() => setLightboxImage(null), [])

  useEffect(() => {
    if (!lightboxImage) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
    }
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [lightboxImage, closeLightbox])

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Build page numbers to show (with ellipsis for large totals)
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = []
    if (page <= 3) {
      pages.push(1, 2, 3, 4, 'ellipsis', totalPages)
    } else if (page >= totalPages - 2) {
      pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages)
    }
    return pages
  }, [page, totalPages])

  const startItem = (page - 1) * PER_PAGE + 1
  const endItem = Math.min(page * PER_PAGE, reviews.length)

  if (reviews.length === 0 && !loading) return null

  return (
    <section id="reviews" data-section="ما يقوله طلابنا" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
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
          <>
            {/* Instagram-style cards - single column for post feel, max width like feed */}
            <div className="max-w-md mx-auto space-y-6">
              {paginatedReviews.map((review, index) => (
                <ScrollReveal key={review.id} animation="slideStart" delay={index * 80}>
                  <article className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    {/* Post header - Instagram style */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-5 h-5 text-primary-500" strokeWidth={1.5} />
                      </div>
                      <span className="text-primary-600 font-semibold text-sm">منصة فتحة</span>
                    </div>

                    {/* Image or placeholder - click to open full size */}
                    {review.image_url ? (
                      <button
                        type="button"
                        onClick={() => setLightboxImage(review.image_url!)}
                        className="relative aspect-square bg-gray-100 block w-full overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                        aria-label="عرض الصورة بحجم كامل"
                      >
                        <img
                          src={review.image_url}
                          alt={review.content ? (review.content.slice(0, 100) + (review.content.length > 100 ? '…' : '')) : 'مراجعة مصورة من طالب المنصة'}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/0 hover:bg-black/30 transition-colors duration-200 opacity-0 hover:opacity-100">
                          <Expand className="w-8 h-8 text-white drop-shadow-md" strokeWidth={2} aria-hidden />
                          <span className="text-white text-sm font-medium drop-shadow-md">عرض الصورة</span>
                        </span>
                      </button>
                    ) : (
                      <div className="aspect-square flex items-center justify-center bg-primary-50/50">
                        <MessageCircle className="w-16 h-16 text-primary-300" strokeWidth={1.5} />
                      </div>
                    )}

                    {/* Caption area - collapsible */}
                    <div className="px-4 py-3">
                      {review.content ? (
                        <div className="text-gray-700 text-sm leading-relaxed">
                          <p
                            className={
                              expandedIds.has(review.id)
                                ? 'whitespace-pre-wrap'
                                : 'line-clamp-3'
                            }
                          >
                            {review.content}
                          </p>
                          {review.content.length > COLLAPSE_CHARS && (
                            <button
                              type="button"
                              onClick={() => toggleExpanded(review.id)}
                              className="text-primary-500 font-medium text-sm mt-1 hover:underline focus:outline-none"
                            >
                              {expandedIds.has(review.id) ? 'عرض أقل' : 'عرض المزيد'}
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">مراجعة مصورة</p>
                      )}
                    </div>
                  </article>
                </ScrollReveal>
              ))}
            </div>

            {/* Pagination - professional & responsive */}
            {totalPages > 1 && (
              <ScrollReveal animation="fadeUp" className="mt-10 sm:mt-12">
                <nav
                  role="navigation"
                  aria-label="ترقيم صفحات المراجعات"
                  className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-2"
                >
                  {/* Prev (RTL: right side) */}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="order-2 sm:order-1 inline-flex items-center justify-center gap-1.5 min-w-[2.75rem] sm:min-w-[2.5rem] h-10 sm:h-9 px-3 sm:px-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                    aria-label="الصفحة السابقة"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline text-sm font-medium">السابق</span>
                  </button>

                  {/* Page numbers - hidden on tiny screens, visible sm+ */}
                  <div className="order-1 sm:order-2 flex items-center justify-center gap-1 sm:gap-0.5 flex-wrap">
                    {pageNumbers.map((p, i) =>
                      p === 'ellipsis' ? (
                        <span
                          key={`ellipsis-${i}`}
                          className="w-8 h-8 sm:w-7 sm:h-7 flex items-center justify-center text-gray-400 text-sm"
                          aria-hidden
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPage(p)}
                          aria-label={`الصفحة ${p}`}
                          aria-current={page === p ? 'page' : undefined}
                          className={`min-w-[2.25rem] sm:min-w-[2rem] h-9 sm:h-8 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:ring-offset-1 ${
                            page === p
                              ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                  </div>

                  {/* Next (RTL: left side) */}
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="order-3 inline-flex items-center justify-center gap-1.5 min-w-[2.75rem] sm:min-w-[2.5rem] h-10 sm:h-9 px-3 sm:px-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-40 disabled:pointer-events-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                    aria-label="الصفحة التالية"
                  >
                    <span className="hidden sm:inline text-sm font-medium">التالي</span>
                    <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
                  </button>
                </nav>

                {/* Results summary - responsive text */}
                <p className="text-center mt-3 text-xs sm:text-sm text-gray-500" dir="ltr">
                  <span className="tabular-nums">{startItem}</span>
                  –
                  <span className="tabular-nums">{endItem}</span>
                  {' '}
                  من
                  {' '}
                  <span className="tabular-nums">{reviews.length}</span>
                  {' '}
                  مراجعة
                </p>
              </ScrollReveal>
            )}
          </>
        )}
      </div>

      {/* Lightbox: display image full size when clicked */}
      {lightboxImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة بحجم كامل"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 sm:top-6 sm:left-6 sm:rtl:right-6 sm:rtl:left-auto z-10 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="إغلاق"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-[95vw] max-h-[95vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage}
              alt="مراجعة مصورة - عرض كامل"
              className="max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg shadow-2xl"
            />
          </div>
          <p className="absolute bottom-4 left-4 right-4 text-center text-white/80 text-sm">
            اضغط خارج الصورة أو اضغط ESC للإغلاق
          </p>
        </div>
      )}
    </section>
  )
}

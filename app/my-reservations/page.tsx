'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { CalendarCheck, Loader2, CheckCircle, Clock, XCircle, ExternalLink, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import type { ReservationRow } from '@/types/database'
import type { EventRow } from '@/types/database'

type ReservationWithEvent = ReservationRow & { event?: EventRow }

const STATUS_LABELS: Record<string, { label: string; className: string; Icon: typeof CheckCircle }> = {
  pending: { label: 'قيد الانتظار', className: 'bg-amber-100 text-amber-700', Icon: Clock },
  confirmed: { label: 'مؤكد', className: 'bg-emerald-100 text-emerald-700', Icon: CheckCircle },
  cancelled: { label: 'ملغى', className: 'bg-gray-100 text-gray-600', Icon: XCircle },
}

export default function MyReservationsPage() {
  const { user, session, loading: authLoading } = useAuth()
  const router = useRouter()
  const [reservations, setReservations] = useState<ReservationWithEvent[]>([])
  const [loading, setLoading] = useState(true)

  function fetchReservations() {
    if (!session?.access_token) return Promise.resolve()
    const fetchOpts = { cache: 'no-store' as RequestCache }
    return fetch('/api/my-reservations', {
      ...fetchOpts,
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ReservationRow[]) => {
        const list = Array.isArray(data) ? data : []
        return fetch('/api/events', fetchOpts)
          .then((re) => re.json())
          .then((evs: EventRow[]) => {
            const eventMap = new Map((Array.isArray(evs) ? evs : []).map((e) => [e.id, e]))
            setReservations(list.map((r) => ({ ...r, event: eventMap.get(r.event_id) })))
          })
      })
      .catch(() => setReservations([]))
  }

  useEffect(() => {
    if (authLoading) return
    if (!user || !session?.access_token) {
      router.replace('/events')
      return
    }
    fetchReservations().finally(() => setLoading(false))
  }, [user, session?.access_token, authLoading, router])

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center gap-3 mb-8">
            <CalendarCheck className="w-8 h-8 text-primary-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">حجوزاتي وإشعارات الحالة</h1>
              <p className="text-gray-500 text-sm">جميع حجوزاتك وحالة كل واحدة</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            </div>
          ) : reservations.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
              <p className="text-gray-500 mb-4">لا توجد حجوزات مرتبطة بحسابك.</p>
              <Link href="/events" className="text-primary-500 font-semibold hover:underline">
                تصفح الفعاليات والتسجيل
              </Link>
            </div>
          ) : (
            <>
              {/* Transfer & proof-of-payment UI omitted — admin approval only. */}
              <ul className="space-y-4">
              {reservations.map((r) => {
                const statusInfo = STATUS_LABELS[r.status] || STATUS_LABELS.pending
                const StatusIcon = statusInfo.Icon
                return (
                  <li key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    {/* Event summary */}
                    <div className="p-5 bg-gradient-to-l from-primary-50 to-white border-b border-gray-100">
                      <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide mb-1">الفعالية التي تحجز لها</p>
                      <h2 className="font-bold text-gray-800 text-lg">
                        {r.event?.title ?? 'فعالية'}
                      </h2>
                      {r.event?.category && (
                        <p className="text-sm text-primary-500 mt-0.5">{r.event.category}</p>
                      )}
                      {r.event?.hours && (
                        <p className="text-xs text-gray-500 mt-1">المدة: {r.event.hours} — الدروس: {r.event.lessons}</p>
                      )}
                    </div>
                    <div className="p-5 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.className}`}
                        >
                          <StatusIcon className="w-4 h-4" />
                          {statusInfo.label}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">
                        <span>التاريخ: {new Date(r.created_at).toLocaleDateString('ar-SA')}</span>
                      </div>
                    </div>
                    {r.status === 'pending' && (
                      <div className="px-5 pb-4">
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                          طلبك قيد المراجعة. ستُحدَّث الحالة هنا إلى <strong>مؤكد</strong> أو <strong>ملغى</strong> بعد قرار الإدارة فقط — لا إجراء مطلوب منك الآن.
                        </p>
                      </div>
                    )}
                    {/* Tutorial link: show only when confirmed */}
                    {r.status === 'confirmed' && r.event?.tutorial_link && (
                      <div className="px-5 pb-5">
                        <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/50 p-4">
                          <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-emerald-600" />
                            رابط الدورة/الدرس
                          </p>
                          <p className="text-sm text-gray-700 mb-3">تم تأكيد حجزك! يمكنك الآن الوصول إلى محتوى الدورة.</p>
                          <a
                            href={r.event.tutorial_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-colors shadow-md"
                          >
                            <ExternalLink className="w-5 h-5" />
                            فتح رابط الدورة
                          </a>
                        </div>
                      </div>
                    )}
                  </li>
                )
              })}
            </ul>
            </>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/events"
              className="text-primary-500 font-medium hover:underline"
            >
              العودة إلى الفعاليات
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

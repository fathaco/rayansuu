'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { CalendarCheck, Loader2, CheckCircle, Clock, XCircle } from 'lucide-react'
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

  useEffect(() => {
    if (authLoading) return
    if (!user || !session?.access_token) {
      router.replace('/events')
      return
    }
    fetch('/api/my-reservations', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: ReservationRow[]) => {
        const list = Array.isArray(data) ? data : []
        return fetch('/api/events')
          .then((re) => re.json())
          .then((evs: EventRow[]) => {
            const eventMap = new Map((Array.isArray(evs) ? evs : []).map((e) => [e.id, e]))
            setReservations(list.map((r) => ({ ...r, event: eventMap.get(r.event_id) })))
          })
      })
      .catch(() => setReservations([]))
      .finally(() => setLoading(false))
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
            <ul className="space-y-4">
              {reservations.map((r) => {
                const statusInfo = STATUS_LABELS[r.status] || STATUS_LABELS.pending
                const StatusIcon = statusInfo.Icon
                return (
                  <li key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h2 className="font-bold text-gray-800 text-lg">
                        {r.event?.title ?? 'فعالية'}
                      </h2>
                      {r.event?.category && (
                        <p className="text-sm text-primary-500 mt-0.5">{r.event.category}</p>
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
                  </li>
                )
              })}
            </ul>
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

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import { CalendarCheck, Loader2, CheckCircle, Clock, XCircle, FileUp, ExternalLink, Copy, CreditCard, BookOpen } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PAYMENT_INFO } from '@/lib/payment-info'
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
  const [uploadingId, setUploadingId] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  async function copyPaymentValue(key: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopiedField(key)
    setTimeout(() => setCopiedField(null), 2000)
  }

  function fetchReservations() {
    if (!session?.access_token) return Promise.resolve()
    return fetch('/api/my-reservations', {
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
  }

  useEffect(() => {
    if (authLoading) return
    if (!user || !session?.access_token) {
      router.replace('/events')
      return
    }
    fetchReservations().finally(() => setLoading(false))
  }, [user, session?.access_token, authLoading, router])

  async function handlePaymentProof(reservationId: string, file: File) {
    setUploadingId(reservationId)
    try {
      const fd = new FormData()
      fd.set('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok || !uploadData.url) {
        alert(uploadData.error || 'فشل رفع الملف')
        return
      }
      const patchRes = await fetch(`/api/my-reservations/${reservationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ payment_proof_url: uploadData.url }),
      })
      if (!patchRes.ok) {
        const err = await patchRes.json().catch(() => ({}))
        alert(err.error || 'فشل حفظ إثبات الدفع')
        return
      }
      fetchReservations()
    } finally {
      setUploadingId(null)
    }
  }

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
                const showPaymentTask = r.status !== 'cancelled'
                const hasProof = !!r.payment_proof_url
                const isConfirmed = !!r.payment_confirmed
                const isUploading = uploadingId === r.id
                return (
                  <li key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
                    {/* Event: what user is paying for */}
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
                    {/* Payment info: where to transfer */}
                    {showPaymentTask && (
                      <div className="px-5 pb-4">
                        <div className="rounded-xl border border-primary-200 bg-primary-50/50 p-4">
                          <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-primary-600" />
                            معلومات التحويل
                          </p>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center justify-between gap-2 flex-row-reverse">
                              <span className="text-gray-500 shrink-0">CCP</span>
                              <span className="font-mono font-semibold text-gray-800 break-all">{PAYMENT_INFO.ccp}</span>
                              <button type="button" onClick={() => copyPaymentValue('ccp', PAYMENT_INFO.ccp)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                                <Copy size={14} className={copiedField === 'ccp' ? 'text-emerald-600' : ''} />
                              </button>
                            </li>
                            <li className="flex items-center justify-between gap-2 flex-row-reverse">
                              <span className="text-gray-500 shrink-0">MLLE</span>
                              <span className="font-semibold text-gray-800">{PAYMENT_INFO.name}</span>
                              <button type="button" onClick={() => copyPaymentValue('name', PAYMENT_INFO.name)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                                <Copy size={14} className={copiedField === 'name' ? 'text-emerald-600' : ''} />
                              </button>
                            </li>
                            <li className="flex items-center justify-between gap-2 flex-row-reverse">
                              <span className="text-gray-500 shrink-0">Domaine</span>
                              <span className="font-semibold text-gray-800 text-balance">{PAYMENT_INFO.domaine}</span>
                              <button type="button" onClick={() => copyPaymentValue('domaine', PAYMENT_INFO.domaine)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                                <Copy size={14} className={copiedField === 'domaine' ? 'text-emerald-600' : ''} />
                              </button>
                            </li>
                            <li className="flex items-center justify-between gap-2 flex-row-reverse">
                              <span className="text-gray-500 shrink-0">Mob</span>
                              <span className="font-mono font-semibold text-gray-800">{PAYMENT_INFO.mob}</span>
                              <button type="button" onClick={() => copyPaymentValue('mob', PAYMENT_INFO.mob)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                                <Copy size={14} className={copiedField === 'mob' ? 'text-emerald-600' : ''} />
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}
                    {/* Payment proof: add image / view status */}
                    {showPaymentTask && (
                      <div className="px-5 pb-5">
                        <div className="rounded-xl border-2 border-dashed border-primary-200 bg-primary-50/30 p-4">
                          <p className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <FileUp className="w-4 h-4 text-primary-600" />
                            إثبات الدفع
                          </p>
                          {!hasProof && (
                            <div>
                              <p className="text-sm text-gray-700 mb-3">أرسل صورة إثبات الدفع (الحوالة أو الإيصال) لتأكيد حجزك.</p>
                              <label className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-500 text-white font-semibold cursor-pointer hover:bg-primary-600 transition-colors disabled:opacity-70 shadow-md">
                                <FileUp className="w-5 h-5" />
                                {isUploading ? 'جاري الرفع...' : 'إضافة صورة إثبات الدفع'}
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="sr-only"
                                  disabled={isUploading}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handlePaymentProof(r.id, file)
                                    e.target.value = ''
                                  }}
                                />
                              </label>
                              {isUploading && <Loader2 className="w-5 h-5 animate-spin inline-block mr-2 text-primary-600" />}
                            </div>
                          )}
                          {hasProof && !isConfirmed && (
                            <div className="space-y-2">
                              <span className="text-sm text-amber-700 font-medium block">تم رفع إثبات الدفع — بانتظار التأكيد من الإدارة</span>
                              {/\.(jpe?g|png|gif|webp)$/i.test(r.payment_proof_url!) ? (
                                <a href={r.payment_proof_url!} target="_blank" rel="noopener noreferrer" className="block">
                                  <img src={r.payment_proof_url!} alt="إثبات الدفع" className="max-h-40 rounded-lg border border-gray-200 object-contain bg-white" />
                                </a>
                              ) : null}
                              <a
                                href={r.payment_proof_url!}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-primary-600 text-sm font-medium hover:underline"
                              >
                                <ExternalLink className="w-4 h-4" />
                                عرض الملف
                              </a>
                            </div>
                          )}
                          {hasProof && isConfirmed && (
                            <div className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="text-sm font-medium text-emerald-700 block">تم تأكيد الدفع</span>
                                {/\.(jpe?g|png|gif|webp)$/i.test(r.payment_proof_url!) ? (
                                  <a href={r.payment_proof_url!} target="_blank" rel="noopener noreferrer" className="block mt-2">
                                    <img src={r.payment_proof_url!} alt="إثبات الدفع" className="max-h-32 rounded-lg border border-gray-200 object-contain bg-white" />
                                  </a>
                                ) : null}
                                <a
                                  href={r.payment_proof_url!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-primary-600 hover:underline mt-1 inline-block"
                                >
                                  عرض الملف
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
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

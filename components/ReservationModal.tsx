'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, Copy, CreditCard, User, MapPin } from 'lucide-react'
import type { EventRow } from '@/types/database'
import { PAYMENT_INFO } from '@/lib/payment-info'

interface ReservationModalProps {
  event: EventRow
  onClose: () => void
  onSuccess: () => void
}

export default function ReservationModal({ event, onClose, onSuccess }: ReservationModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  function handleSuccessClose() {
    onSuccess()
    onClose()
  }

  async function copyToClipboard(label: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopied(label)
    setTimeout(() => setCopied(null), 2000)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, name, email, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'فشل في التسجيل')
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {success ? (
          <div className="p-6 sm:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-4 animate-success-pop">
              <Check className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">تم التسجيل بنجاح</h3>
            <p className="text-gray-600 text-sm mb-5">لإكمال الحجز، قم بالتحويل ثم أرفق إثبات الدفع من <strong>حجوزاتي والحالة</strong> في حسابك.</p>

            <div className="w-full text-right rounded-2xl border-2 border-primary-100 bg-gradient-to-b from-primary-50/50 to-white p-4 sm:p-5 mb-5">
              <p className="text-primary-700 font-bold text-sm mb-3 flex items-center justify-end gap-2">
                <CreditCard size={18} /> معلومات التحويل
              </p>
              <ul className="space-y-2.5 text-sm">
                <li className="flex items-center justify-between gap-3 flex-row-reverse">
                  <span className="text-gray-500 shrink-0">CCP</span>
                  <span className="font-mono font-semibold text-gray-800 break-all">{PAYMENT_INFO.ccp}</span>
                  <button type="button" onClick={() => copyToClipboard('ccp', PAYMENT_INFO.ccp)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                    <Copy size={14} className={copied === 'ccp' ? 'text-emerald-600' : ''} />
                  </button>
                </li>
                <li className="flex items-center justify-between gap-3 flex-row-reverse">
                  <span className="text-gray-500 shrink-0">MLLE</span>
                  <span className="font-semibold text-gray-800">{PAYMENT_INFO.name}</span>
                  <button type="button" onClick={() => copyToClipboard('name', PAYMENT_INFO.name)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                    <Copy size={14} className={copied === 'name' ? 'text-emerald-600' : ''} />
                  </button>
                </li>
                <li className="flex items-center justify-between gap-3 flex-row-reverse">
                  <span className="text-gray-500 shrink-0">Domaine</span>
                  <span className="font-semibold text-gray-800 text-balance">{PAYMENT_INFO.domaine}</span>
                  <button type="button" onClick={() => copyToClipboard('domaine', PAYMENT_INFO.domaine)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                    <Copy size={14} className={copied === 'domaine' ? 'text-emerald-600' : ''} />
                  </button>
                </li>
                <li className="flex items-center justify-between gap-3 flex-row-reverse">
                  <span className="text-gray-500 shrink-0">Mob</span>
                  <span className="font-mono font-semibold text-gray-800">{PAYMENT_INFO.mob}</span>
                  <button type="button" onClick={() => copyToClipboard('mob', PAYMENT_INFO.mob)} className="shrink-0 p-1 rounded hover:bg-primary-100 text-primary-600" title="نسخ">
                    <Copy size={14} className={copied === 'mob' ? 'text-emerald-600' : ''} />
                  </button>
                </li>
              </ul>
            </div>

            <p className="text-amber-800 text-sm font-medium mb-4 flex items-center justify-center gap-1.5">
              <User size={16} /> بعد التحويل، ارفع صورة إثبات الدفع من صفحة <strong>حجوزاتي والحالة</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="/my-reservations"
                onClick={handleSuccessClose}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-primary text-white font-bold shadow-lg hover:shadow-xl transition-shadow"
              >
                <MapPin size={18} /> حجوزاتي والحالة
              </Link>
              <button
                type="button"
                onClick={handleSuccessClose}
                className="py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : (
          <>
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">التسجيل في: {event.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{event.category}</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="أدخل اسمك"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="example@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">رقم الجوال</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="05xxxxxxxx"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-lg disabled:opacity-70"
            >
              {loading ? 'جاري التسجيل...' : 'تأكيد التسجيل'}
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  )
}

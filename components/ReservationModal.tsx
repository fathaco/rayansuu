'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check } from 'lucide-react'
import type { EventRow } from '@/types/database'

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

  useEffect(() => {
    if (!success) return
    const t = setTimeout(() => {
      onSuccess()
      onClose()
    }, 1400)
    return () => clearTimeout(t)
  }, [success, onSuccess, onClose])

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
          <div className="p-10 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6 animate-success-pop">
              <Check className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">تم التسجيل بنجاح</h3>
            <p className="text-gray-600 mb-2">سنتواصل معك قريباً</p>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-right">
              <p className="text-amber-800 font-medium">يجب تأكيد الدفع</p>
              <p className="text-sm text-amber-700 mt-1">يرجى إرسال إثبات الدفع (صورة الحوالة أو الإيصال) من صفحة حجوزاتي لتأكيد حجزك.</p>
              <Link href="/my-reservations" className="inline-block mt-3 text-primary-600 font-semibold hover:underline">
                الذهاب إلى حجوزاتي ←
              </Link>
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

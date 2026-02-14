'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { BookOpen, Check, X, Loader2, Calendar, Users, Clock, BarChart3, Plus, Menu as MenuIcon, Home, LogOut, Settings, TrendingUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase/client'
import type { EventRow } from '@/types/database'
import type { ReservationRow } from '@/types/database'

type ReservationWithEvent = ReservationRow & { event?: EventRow }

const BADGE_OPTIONS = [
  { value: 'جديد', color: 'bg-emerald-500' },
  { value: 'الأكثر مبيعاً', color: 'bg-amber-500' },
  { value: 'مميز', color: 'bg-blue-500' },
  { value: 'حصري', color: 'bg-violet-500' },
  { value: '', color: '' },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user, session, loading: authLoading } = useAuth()
  const [adminChecked, setAdminChecked] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loginEmail, setLoginEmail] = useState('admin@gmail.com')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [events, setEvents] = useState<EventRow[]>([])
  const [reservations, setReservations] = useState<ReservationWithEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [resLoading, setResLoading] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'reservations' | 'create'>('overview')

  const setTab = (tab: typeof activeTab) => {
    setActiveTab(tab)
    setSidebarOpen(false) // close drawer on mobile when navigating
  }
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    hours: '',
    lessons: '',
    badge: '',
    badge_color: 'bg-emerald-500',
    image_url: '',
    is_new: true,
  })

  // Require login + admin (when logged in, check admin)
  useEffect(() => {
    if (authLoading) return
    if (!user || !session?.access_token) {
      setAdminChecked(true)
      setIsAdmin(false)
      return
    }
    // #region agent log
    const tokenLen = session.access_token?.length ?? 0
    fetch('http://127.0.0.1:7244/ingest/115e6265-d769-46f7-a0ac-a3b21fa1d1cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:admin-check-start',message:'Dashboard admin check starting',data:{userEmail:user?.email??'none',tokenLen,authLoading},timestamp:Date.now(),hypothesisId:'H4'})}).catch(()=>{});
    // #endregion
    // Re-checking admin (e.g. after email/password login): show loading until API returns so we don't redirect to /events too early
    setAdminChecked(false)
    fetch('/api/auth/admin', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then((data: { isAdmin?: boolean }) => {
        const ok = data.isAdmin === true
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/115e6265-d769-46f7-a0ac-a3b21fa1d1cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:admin-response',message:'Dashboard admin API response',data:{isAdmin:data.isAdmin,ok,willRedirect:!ok},timestamp:Date.now(),hypothesisId:'H1'})}).catch(()=>{});
        // #endregion
        setIsAdmin(ok)
        setAdminChecked(true)
        if (!ok) router.replace('/events')
      })
      .catch((err) => {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/115e6265-d769-46f7-a0ac-a3b21fa1d1cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'dashboard/page.tsx:admin-catch',message:'Dashboard admin fetch failed',data:{errMsg:err?.message??'unknown'},timestamp:Date.now(),hypothesisId:'H2'})}).catch(()=>{});
        // #endregion
        setAdminChecked(true)
        setIsAdmin(false)
        router.replace('/events')
      })
  }, [user, session?.access_token, authLoading, router])

  useEffect(() => {
    if (!isAdmin) return
    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => {
        setEvents(Array.isArray(data) ? data : [])
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false))
  }, [isAdmin])

  function fetchReservations() {
    fetch('/api/reservations/list')
      .then((r) => r.json())
      .then((data: ReservationRow[]) => {
        const list = Array.isArray(data) ? data : []
        fetch('/api/events')
          .then((re) => re.json())
          .then((evs: EventRow[]) => {
            const eventMap = new Map((Array.isArray(evs) ? evs : []).map((e) => [e.id, e]))
            setReservations(
              list.map((r) => ({ ...r, event: eventMap.get(r.event_id) }))
            )
          })
      })
      .catch(() => setReservations([]))
      .finally(() => setResLoading(false))
  }

  useEffect(() => {
    if (!isAdmin) return
    fetchReservations()
  }, [isAdmin])

  // Realtime: when a reservation is updated (accept/decline) or inserted, refresh the list
  useEffect(() => {
    if (!isAdmin) return
    const channel = supabase
      .channel('reservations-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        () => fetchReservations()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAdmin])

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault()
    setFormLoading(true)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          badge: form.badge || null,
          badge_color: form.badge_color || null,
          image_url: form.image_url || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'فشل في الإنشاء')
      setEvents((prev) => [data, ...prev])
      setForm({
        title: '',
        description: '',
        category: '',
        hours: '',
        lessons: '',
        badge: '',
        badge_color: 'bg-emerald-500',
        image_url: '',
        is_new: true,
      })
      setTab('events')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setFormLoading(false)
    }
  }

  async function updateReservationStatus(id: string, status: 'confirmed' | 'cancelled') {
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!res.ok) return
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.replace('/')
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    })
    setLoginLoading(false)
    if (error) {
      if (error.message.includes('Invalid login')) {
        setLoginError('البريد أو كلمة المرور غير صحيحة')
      } else {
        setLoginError(error.message)
      }
      return
    }
    // Redirect so the page re-mounts with the new session and admin check runs; user then sees dashboard
    router.replace('/dashboard')
  }

  // Calculate stats
  const pendingCount = reservations.filter(r => r.status === 'pending').length
  const confirmedCount = reservations.filter(r => r.status === 'confirmed').length
  const totalReservations = reservations.length

  // Loading: wait for auth + admin check
  if (!adminChecked) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">جاري التحميل...</p>
        </div>
      </main>
    )
  }

  // Not logged in: show admin login form (email + password)
  if (!user || !session) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">لوحة الإدارة</h1>
              <p className="text-gray-500 text-sm">سجّل الدخول للوصول إلى لوحة التحكم</p>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-5">
              {loginError && (
                <div className="text-sm text-red-600 bg-red-50 p-4 rounded-xl text-center border border-red-100">
                  {loginError}
                </div>
              )}
              <div>
                <label htmlFor="admin-email" className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3.5 min-h-[48px] rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-base"
                  placeholder="admin@gmail.com"
                  dir="ltr"
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="block text-sm font-semibold text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3.5 min-h-[48px] rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-base"
                  placeholder="••••••••"
                  dir="ltr"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full min-h-[48px] py-3.5 px-4 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-2 transition-all"
              >
                {loginLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                تسجيل الدخول
              </button>
            </form>
            <Link href="/" className="block mt-6 text-center text-sm text-gray-500 hover:text-primary-500 transition-colors font-medium">
              ← العودة للرئيسية
            </Link>
          </div>
        </div>
      </main>
    )
  }

  // Logged in but not admin
  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">جاري التحقق من الصلاحيات...</p>
        </div>
      </main>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">لوحة التحكم</h2>
                <p className="text-xs text-gray-500">إدارة المنصة</p>
              </div>
            </div>
          </div>

          {/* Menu - touch-friendly min height */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
            <button
              type="button"
              onClick={() => setTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span>نظرة عامة</span>
            </button>

            <button
              type="button"
              onClick={() => setTab('events')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-medium transition-all ${
                activeTab === 'events'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>الفعاليات</span>
              {events.length > 0 && (
                <span className={`mr-auto text-xs px-2 py-1 rounded-full ${
                  activeTab === 'events' ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {events.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setTab('reservations')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-medium transition-all ${
                activeTab === 'reservations'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>الحجوزات</span>
              {pendingCount > 0 && (
                <span className="mr-auto text-xs px-2 py-1 rounded-full bg-amber-500 text-white">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setTab('create')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-gradient-primary text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>إضافة فعالية</span>
            </button>
          </nav>

          {/* Bottom Actions - touch-friendly */}
          <div className="p-3 sm:p-4 border-t border-gray-100 space-y-1 sm:space-y-2">
            <Link
              href="/"
              className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all"
            >
              <Home className="w-5 h-5" />
              <span>الرئيسية</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3.5 min-h-[48px] rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:mr-64">
        {/* Header - mobile first: touch-friendly height and padding */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between min-h-[52px] sm:min-h-[56px]">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2.5 -m-2.5 hover:bg-gray-100 rounded-xl min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="فتح القائمة"
              >
                <MenuIcon className="w-6 h-6 text-gray-700" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate">
                  {activeTab === 'overview' && 'نظرة عامة'}
                  {activeTab === 'events' && 'إدارة الفعاليات'}
                  {activeTab === 'reservations' && 'إدارة الحجوزات'}
                  {activeTab === 'create' && 'إضافة فعالية جديدة'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">مرحباً بك في لوحة التحكم</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content - mobile first padding */}
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards - mobile first: 2 cols on phone, then 4 on lg */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    </div>
                    <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">إجمالي الفعاليات</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{events.length}</p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">إجمالي الحجوزات</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalReservations}</p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">قيد الانتظار</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{pendingCount}</p>
                </div>

                <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-2 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">مؤكدة</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">{confirmedCount}</p>
                </div>
              </div>

              {/* Quick Actions - mobile first */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">إجراءات سريعة</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setTab('create')}
                    className="min-h-[56px] sm:min-h-[64px] p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-primary-500 hover:bg-primary-50 transition-all text-right group"
                  >
                    <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary-500 mb-2" />
                    <p className="font-semibold text-gray-700 group-hover:text-primary-600">إضافة فعالية</p>
                    <p className="text-sm text-gray-500">أنشئ فعالية جديدة</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('reservations')}
                    className="min-h-[56px] sm:min-h-[64px] p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-amber-500 hover:bg-amber-50 transition-all text-right group"
                  >
                    <Clock className="w-8 h-8 text-gray-400 group-hover:text-amber-500 mb-2" />
                    <p className="font-semibold text-gray-700 group-hover:text-amber-600">مراجعة الحجوزات</p>
                    <p className="text-sm text-gray-500">{pendingCount} في الانتظار</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('events')}
                    className="min-h-[56px] sm:min-h-[64px] p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all text-right group"
                  >
                    <Calendar className="w-8 h-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                    <p className="font-semibold text-gray-700 group-hover:text-blue-600">عرض الفعاليات</p>
                    <p className="text-sm text-gray-500">{events.length} فعالية</p>
                  </button>
                </div>
              </div>

              {/* Recent Reservations */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">أحدث الحجوزات</h3>
                  <button
                    onClick={() => setTab('reservations')}
                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                  >
                    عرض الكل ←
                  </button>
                </div>
                {resLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                  </div>
                ) : reservations.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">لا توجد حجوزات</p>
                ) : (
                  <div className="space-y-3">
                    {reservations.slice(0, 5).map((r) => (
                      <div key={r.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{r.name}</p>
                          <p className="text-sm text-gray-500">{r.event?.title ?? r.event_id}</p>
                        </div>
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                            r.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : r.status === 'cancelled'
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {r.status === 'pending' && 'قيد الانتظار'}
                          {r.status === 'confirmed' && 'مؤكد'}
                          {r.status === 'cancelled' && 'ملغى'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'events' && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800">جميع الفعاليات</h2>
                <button
                  type="button"
                  onClick={() => setTab('create')}
                  className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white font-medium hover:shadow-lg transition-all w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  إضافة فعالية
                </button>
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">لا توجد فعاليات حالياً</p>
                  <button
                    onClick={() => setTab('create')}
                    className="text-primary-500 font-medium hover:underline"
                  >
                    أنشئ أول فعالية
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="p-5 rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 mb-1">{ev.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{ev.category}</p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {ev.hours}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {ev.lessons}
                            </span>
                          </div>
                        </div>
                        {ev.badge && (
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-full text-white ${ev.badge_color}`}>
                            {ev.badge}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/events?highlight=${ev.id}`}
                        className="text-primary-500 text-sm font-medium hover:underline flex items-center gap-1"
                      >
                        عرض التفاصيل ←
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reservations Tab - mobile first: cards on small screens, table on md+ */}
          {activeTab === 'reservations' && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4 sm:mb-6">إدارة الحجوزات</h2>
              {resLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد حجوزات</p>
                </div>
              ) : (
                <>
                  {/* Mobile: card per reservation */}
                  <div className="space-y-4 md:hidden">
                    {reservations.map((r) => (
                      <div
                        key={r.id}
                        className="rounded-xl border border-gray-200 p-4 space-y-3 bg-gray-50/50"
                      >
                        <p className="font-semibold text-gray-800">{r.event?.title ?? r.event_id}</p>
                        {r.event?.category && (
                          <p className="text-xs text-gray-500">{r.event.category}</p>
                        )}
                        <div className="text-sm text-gray-600">
                          <p><span className="text-gray-500">المتقدم:</span> {r.name}</p>
                          <p className="truncate" dir="ltr" style={{ direction: 'ltr' }}><span className="text-gray-500">البريد:</span> {r.email}</p>
                          <p dir="ltr" style={{ direction: 'ltr' }}><span className="text-gray-500">الجوال:</span> {r.phone}</p>
                        </div>
                        <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-gray-200">
                          <span
                            className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                              r.status === 'confirmed'
                                ? 'bg-emerald-100 text-emerald-700'
                                : r.status === 'cancelled'
                                ? 'bg-gray-200 text-gray-600'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {r.status === 'pending' && 'قيد الانتظار'}
                            {r.status === 'confirmed' && 'مؤكد'}
                            {r.status === 'cancelled' && 'ملغى'}
                          </span>
                          {r.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => updateReservationStatus(r.id, 'confirmed')}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors text-sm font-medium"
                                title="قبول الطلب"
                              >
                                <Check className="w-4 h-4" />
                                قبول
                              </button>
                              <button
                                type="button"
                                onClick={() => updateReservationStatus(r.id, 'cancelled')}
                                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm font-medium"
                                title="رفض الطلب"
                              >
                                <X className="w-4 h-4" />
                                رفض
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop: table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 text-gray-600 text-sm">
                          <th className="py-4 px-4 text-right font-semibold">الفعالية</th>
                          <th className="py-4 px-4 text-right font-semibold">المتقدم</th>
                          <th className="py-4 px-4 text-right font-semibold">البريد</th>
                          <th className="py-4 px-4 text-right font-semibold">الجوال</th>
                          <th className="py-4 px-4 text-right font-semibold">الحالة</th>
                          <th className="py-4 px-4 text-right font-semibold">الإجراءات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reservations.map((r) => (
                          <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-4 px-4">
                              <p className="font-medium text-gray-800">{r.event?.title ?? r.event_id}</p>
                              {r.event?.category && (
                                <p className="text-xs text-gray-500">{r.event.category}</p>
                              )}
                            </td>
                            <td className="py-4 px-4">
                              <p className="font-medium text-gray-700">{r.name}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-600">{r.email}</p>
                            </td>
                            <td className="py-4 px-4">
                              <p className="text-sm text-gray-600">{r.phone}</p>
                            </td>
                            <td className="py-4 px-4">
                              <span
                                className={`text-xs font-medium px-3 py-1.5 rounded-full inline-block ${
                                  r.status === 'confirmed'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : r.status === 'cancelled'
                                    ? 'bg-gray-200 text-gray-600'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {r.status === 'pending' && 'قيد الانتظار'}
                                {r.status === 'confirmed' && 'مؤكد'}
                                {r.status === 'cancelled' && 'ملغى'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              {r.status === 'pending' && (
                                <div className="flex flex-wrap gap-2 items-center">
                                  <button
                                    type="button"
                                    onClick={() => updateReservationStatus(r.id, 'confirmed')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors text-sm font-medium min-h-[44px]"
                                    title="قبول الطلب"
                                  >
                                    <Check className="w-4 h-4" />
                                    قبول
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => updateReservationStatus(r.id, 'cancelled')}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm font-medium min-h-[44px]"
                                    title="رفض الطلب"
                                  >
                                    <X className="w-4 h-4" />
                                    رفض
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Create Event Tab */}
          {activeTab === 'create' && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <div className="mb-4 sm:mb-6">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">إنشاء فعالية جديدة</h2>
                <p className="text-sm text-gray-500">املأ النموذج لإضافة فعالية جديدة للمنصة</p>
              </div>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عنوان الفعالية <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="مثال: دورة التجويد الميسر"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الوصف <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="وصف مختصر عن الفعالية ومحتواها"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      التصنيف <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="مثال: علوم القرآن"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المدة <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.hours}
                      onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="مثال: 24 ساعة"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      عدد الدروس <span className="text-red-500">*</span>
                    </label>
                    <input
                      required
                      value={form.lessons}
                      onChange={(e) => setForm((f) => ({ ...f, lessons: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                      placeholder="مثال: 48 درساً"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">الشارة (اختياري)</label>
                    <select
                      value={form.badge}
                      onChange={(e) => {
                        const opt = BADGE_OPTIONS.find((o) => o.value === e.target.value)
                        setForm((f) => ({
                          ...f,
                          badge: e.target.value,
                          badge_color: opt?.color || '',
                        }))
                      }}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                    >
                      <option value="">بدون شارة</option>
                      {BADGE_OPTIONS.filter((o) => o.value !== '').map((o) => (
                        <option key={o.value} value={o.value}>{o.value}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">صورة الفعالية (من مجلد فتحة)</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-100 file:text-primary-700"
                      onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        setImageUploading(true)
                        try {
                          const fd = new FormData()
                          fd.set('file', file)
                          const res = await fetch('/api/upload', { method: 'POST', body: fd })
                          const data = await res.json()
                          if (res.ok && data.url) setForm((f) => ({ ...f, image_url: data.url }))
                          else alert(data.error || 'فشل الرفع')
                        } finally {
                          setImageUploading(false)
                          e.target.value = ''
                        }
                      }}
                      disabled={imageUploading}
                    />
                    {imageUploading && <p className="text-sm text-primary-600 mt-1">جاري الرفع...</p>}
                    {form.image_url && (
                      <p className="text-sm text-gray-500 mt-1 truncate" title={form.image_url}>تم: {form.image_url}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-primary-300 cursor-pointer transition-all">
                      <input
                        type="checkbox"
                        checked={form.is_new}
                        onChange={(e) => setForm((f) => ({ ...f, is_new: e.target.checked }))}
                        className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-700">عرض كفعالية جديدة</p>
                        <p className="text-sm text-gray-500">سيتم إضافة علامة "جديد" للفعالية</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full sm:flex-1 min-h-[48px] py-3.5 px-6 rounded-xl bg-gradient-primary text-white font-semibold disabled:opacity-70 flex items-center justify-center gap-2 hover:shadow-xl transition-all"
                  >
                    {formLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    إنشاء الفعالية
                  </button>
                  <button
                    type="button"
                    onClick={() => setTab('events')}
                    className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
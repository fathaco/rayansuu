'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X, LogOut, CalendarCheck, LayoutDashboard } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { user, session, loading, signInWithGoogle, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setAvatarError(false)
  }, [user?.id])

  // Admin check when we have a session (after auth is ready)
  const checkAdmin = useCallback(() => {
    if (!user || !session?.access_token) {
      setIsAdmin(false)
      return
    }
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/115e6265-d769-46f7-a0ac-a3b21fa1d1cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:checkAdmin',message:'Header admin check called',data:{userEmail:user?.email??'none',menuOpen:isMobileMenuOpen},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
    // #endregion
    fetch('/api/auth/admin', {
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
      .then((r) => r.json())
      .then((data: { isAdmin?: boolean }) => {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/115e6265-d769-46f7-a0ac-a3b21fa1d1cf',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Header.tsx:admin-result',message:'Header admin result',data:{isAdmin:data.isAdmin},timestamp:Date.now(),hypothesisId:'H3'})}).catch(()=>{});
        // #endregion
        setIsAdmin(data.isAdmin === true)
      })
      .catch(() => setIsAdmin(false))
  }, [user, session?.access_token])

  // Run admin check only after auth has finished loading (session may restore after redirect)
  useEffect(() => {
    if (loading || !user || !session?.access_token) {
      if (!loading && !user) setIsAdmin(false)
      return
    }
    checkAdmin()
  }, [loading, user, session?.access_token, checkAdmin])

  // Re-check admin when opening mobile menu (in case first check ran before session was ready, e.g. after deploy)
  useEffect(() => {
    if (isMobileMenuOpen && user && session?.access_token) {
      checkAdmin()
    }
  }, [isMobileMenuOpen, user, session?.access_token, checkAdmin])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20 min-h-[64px]">
          {/* CTA / User - touch friendly on mobile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!loading && (
              <>
                {user ? (
                  <div className="relative hidden sm:block">
                    <button
                      type="button"
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 min-h-[44px] px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50"
                      aria-expanded={userMenuOpen}
                    >
                      {(user.user_metadata?.avatar_url && !avatarError) ? (
                        <img
                          src={user.user_metadata.avatar_url}
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                          onError={() => setAvatarError(true)}
                        />
                      ) : (
                        <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-bold">
                          {(user.user_metadata?.full_name || user.email || '؟').charAt(0)}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                    </button>
                    {userMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-10" aria-hidden onClick={() => setUserMenuOpen(false)} />
                        <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                          {isAdmin && (
                            <Link
                              href="/dashboard"
                              className="flex items-center gap-2 px-4 py-2.5 text-primary-600 hover:bg-primary-50 font-medium"
                              onClick={() => setUserMenuOpen(false)}
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              لوحة الإدارة (Access dashboard)
                            </Link>
                          )}
                          <Link
                            href="/my-reservations"
                            className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-primary-50 hover:text-primary-600"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <CalendarCheck className="w-4 h-4" />
                            حجوزاتي والحالة
                          </Link>
                          <button
                            type="button"
                            onClick={() => { signOut(); setUserMenuOpen(false); }}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-gray-700 hover:bg-red-50 hover:text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            تسجيل الخروج
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => signInWithGoogle()}
                    className="btn-secondary text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 hidden sm:inline-flex min-h-[44px] items-center justify-center gap-2"
                  >
                    <GoogleIcon />
                    تسجيل الدخول بغوغل
                  </button>
                )}
                {!user && (
                  <Link
                    href="/events"
                    className="btn-primary text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 min-h-[44px] inline-flex items-center justify-center touch-manipulation"
                  >
                    ابدأ الآن
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            <li>
              <Link href="/" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2 block">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </Link>
            </li>
            <li>
              <a href="#courses" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2">
                الدورات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            </li>
            <li>
              <a href="/events" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2">
                الفعاليات
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            </li>
            <li>
              <a href="#about" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2">
                عن المنصة
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            </li>
            <li>
              <a href="#contact" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2">
                تواصل معنا
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            </li>
          </ul>

          {/* Logo - links to home */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
            <span className="text-base sm:text-xl lg:text-2xl font-bold text-primary-500">
              منصة فتحة
            </span>
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 relative flex-shrink-0">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <circle cx="50" cy="50" r="45" stroke="url(#gradient)" strokeWidth="3" fill="none" />
                <path
                  d="M50 10 L50 50 M30 30 L70 30 M50 50 L50 90 M30 70 L70 70"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b3eb5" />
                    <stop offset="100%" stopColor="#d946a6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Link>

          {/* Mobile Menu Button - 44px touch target */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-700 hover:text-primary-500 touch-manipulation"
            aria-expanded={isMobileMenuOpen}
            aria-label="فتح القائمة"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* Mobile Menu - full width, easy tap targets */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-fade-in">
            {user && (
              <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-gray-100">
                {(user.user_metadata?.avatar_url && !avatarError) ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-lg font-bold flex-shrink-0">
                    {(user.user_metadata?.full_name || user.email || '؟').charAt(0)}
                  </span>
                )}
                <span className="text-sm font-medium text-gray-700 truncate">{user.user_metadata?.full_name || user.email}</span>
              </div>
            )}
            <ul className="space-y-1">
              {[
                { href: '/', label: 'الرئيسية' },
                { href: '/#courses', label: 'الدورات' },
                { href: '/events', label: 'الفعاليات' },
                { href: '/#about', label: 'عن المنصة' },
                { href: '/#contact', label: 'تواصل معنا' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-3.5 px-2 text-gray-700 hover:text-primary-500 hover:bg-primary-50 font-medium rounded-lg transition-colors min-h-[48px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <li>
                      <Link
                        href="/dashboard"
                        className="block py-3.5 px-2 text-primary-600 hover:bg-primary-50 font-medium rounded-lg min-h-[48px] flex items-center gap-2"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        لوحة الإدارة (Access dashboard)
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link
                      href="/my-reservations"
                      className="block py-3.5 px-2 text-gray-700 hover:bg-primary-50 font-medium rounded-lg min-h-[48px] flex items-center gap-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <CalendarCheck className="w-4 h-4" />
                      حجوزاتي والحالة
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                      className="block w-full text-right py-3.5 px-2 text-gray-700 hover:bg-red-50 hover:text-red-600 font-medium rounded-lg min-h-[48px] flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    type="button"
                    onClick={() => { signInWithGoogle(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 py-3.5 px-2 text-gray-700 hover:text-primary-500 hover:bg-primary-50 font-medium rounded-lg min-h-[48px] w-full"
                  >
                    <GoogleIcon />
                    تسجيل الدخول بغوغل
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

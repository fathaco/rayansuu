'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <nav className="flex items-center justify-between h-16 lg:h-20 min-h-[64px]">
          {/* CTA Buttons - touch friendly on mobile */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="btn-secondary text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 hidden sm:inline-flex min-h-[44px] items-center justify-center">
              تسجيل الدخول
            </button>
            <button className="btn-primary text-xs sm:text-sm lg:text-base px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 min-h-[44px] inline-flex items-center justify-center touch-manipulation">
              ابدأ الآن
            </button>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-6 xl:gap-8">
            <li>
              <a href="#home" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2">
                الرئيسية
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300" />
              </a>
            </li>
            <li>
              <a href="#courses" className="text-gray-700 hover:text-primary-500 font-medium transition-colors relative group py-2">
                الدورات
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

          {/* Logo - mobile first size */}
          <div className="flex items-center gap-2 sm:gap-3 absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
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
          </div>

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
            <ul className="space-y-1">
              {[
                { href: '#home', label: 'الرئيسية' },
                { href: '#courses', label: 'الدورات' },
                { href: '#about', label: 'عن المنصة' },
                { href: '#contact', label: 'تواصل معنا' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    className="block py-3.5 px-2 text-gray-700 hover:text-primary-500 hover:bg-primary-50 font-medium rounded-lg transition-colors min-h-[48px] flex items-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  )
}

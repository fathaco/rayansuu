'use client'

import { useState, useEffect } from 'react'
import { Facebook, Youtube, Instagram, Twitter } from 'lucide-react'
import ScrollReveal from './ScrollReveal'
import { DEFAULT_FOOTER } from '@/lib/footer-defaults'

type FooterData = {
  tagline: string | null
  social_facebook: string | null
  social_youtube: string | null
  social_instagram: string | null
  social_twitter: string | null
  quick_links: { label: string; href: string }[]
  sections: { label: string; href: string }[]
  contact: { label: string; href: string }[]
  copyright_text: string | null
  privacy_url: string | null
  terms_url: string | null
}

const SOCIAL_ICONS = [
  { Icon: Facebook, key: 'social_facebook' as const },
  { Icon: Youtube, key: 'social_youtube' as const },
  { Icon: Instagram, key: 'social_instagram' as const },
  { Icon: Twitter, key: 'social_twitter' as const },
]

export default function Footer() {
  const [data, setData] = useState<FooterData | null>(null)

  function fetchFooter() {
    // Force no cache - fetch fresh data every time
    fetch(`/api/footer?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to fetch footer')
        return r.json()
      })
      .then((res) => {
        if (res && (res.quick_links || res.tagline != null)) {
          setData({
            tagline: res.tagline ?? DEFAULT_FOOTER.tagline,
            social_facebook: res.social_facebook ?? DEFAULT_FOOTER.social_facebook,
            social_youtube: res.social_youtube ?? DEFAULT_FOOTER.social_youtube,
            social_instagram: res.social_instagram ?? DEFAULT_FOOTER.social_instagram,
            social_twitter: res.social_twitter ?? DEFAULT_FOOTER.social_twitter,
            quick_links: Array.isArray(res.quick_links) && res.quick_links.length > 0 ? res.quick_links : DEFAULT_FOOTER.quick_links,
            sections: Array.isArray(res.sections) && res.sections.length > 0 ? res.sections : DEFAULT_FOOTER.sections,
            contact: Array.isArray(res.contact) && res.contact.length > 0 ? res.contact : DEFAULT_FOOTER.contact,
            copyright_text: res.copyright_text ?? DEFAULT_FOOTER.copyright_text,
            privacy_url: res.privacy_url ?? DEFAULT_FOOTER.privacy_url,
            terms_url: res.terms_url ?? DEFAULT_FOOTER.terms_url,
          })
        } else {
          setData(DEFAULT_FOOTER)
        }
      })
      .catch(() => setData(DEFAULT_FOOTER))
  }

  useEffect(() => {
    fetchFooter()
    
    // Refetch every 10 seconds to catch changes
    const interval = setInterval(() => {
      fetchFooter()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Refetch when page becomes visible or window gains focus (e.g., admin saves changes and switches back to site)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchFooter()
      }
    }
    const handleFocus = () => {
      fetchFooter()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [])

  const footer = data ?? DEFAULT_FOOTER
  const socialLinks = SOCIAL_ICONS.map(({ Icon, key }) => ({ Icon, href: footer[key] || '#' }))

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
          <ScrollReveal animation="fadeUp">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <svg viewBox="0 0 100 100" fill="none" className="w-10 h-10 sm:w-12 sm:h-12">
                  <circle cx="50" cy="50" r="45" stroke="url(#footerGradient)" strokeWidth="3" fill="none" />
                  <path
                    d="M50 10 L50 50 M30 30 L70 30 M50 50 L50 90 M30 70 L70 70"
                    stroke="url(#footerGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="footerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b3eb5" />
                      <stop offset="100%" stopColor="#d946a6" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="text-lg sm:text-xl font-bold">منصة فتحة</span>
              </div>
              <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                {footer.tagline}
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                {socialLinks.map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center 
                             hover:bg-gradient-primary transition-all duration-300 hover:scale-110 touch-manipulation"
                    aria-label="Social link"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={50}>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">روابط سريعة</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footer.quick_links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-200 
                               inline-block hover:translate-x-1 text-sm sm:text-base py-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={100}>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">الأقسام العلمية</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footer.sections.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-200 
                               inline-block hover:translate-x-1 text-sm sm:text-base py-1"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fadeUp" delay={150}>
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-4 sm:mb-6">تواصل معنا</h3>
              <ul className="space-y-2 sm:space-y-3">
                {footer.contact.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 transition-colors duration-200 
                               inline-block hover:translate-x-1 text-sm sm:text-base py-1 break-all"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-start">
            <p className="text-gray-400 text-xs sm:text-sm">
              {footer.copyright_text}
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <a href={footer.privacy_url || '#'} className="hover:text-primary-400 transition-colors py-1">
                سياسة الخصوصية
              </a>
              <a href={footer.terms_url || '#'} className="hover:text-primary-400 transition-colors py-1">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { Facebook, Youtube, Instagram, Twitter } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const footerLinks = {
  quickLinks: [
    { label: 'عن المنصة', href: '#about' },
    { label: 'الدورات', href: '#courses' },
    { label: 'الأسئلة الشائعة', href: '#faq' },
    { label: 'تواصل معنا', href: '#contact' },
  ],
  sections: [
    { label: 'علوم القرآن', href: '#' },
    { label: 'الحديث الشريف', href: '#' },
    { label: 'الفقه وأصوله', href: '#' },
    { label: 'العقيدة', href: '#' },
  ],
  contact: [
    { label: 'info@fatha.com', href: 'mailto:info@fatha.com' },
    { label: '966500000000+', href: 'tel:+966500000000' },
    { label: 'الرياض، السعودية', href: '#' },
  ],
}

export default function Footer() {
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
                منصة فتحة الإلكترونية هي الوجهة الأولى لطالبي العلوم الشرعية في العالم العربي
              </p>
              <div className="flex items-center gap-2 sm:gap-3">
                {[
                  { Icon: Facebook, href: '#' },
                  { Icon: Youtube, href: '#' },
                  { Icon: Instagram, href: '#' },
                  { Icon: Twitter, href: '#' },
                ].map(({ Icon, href }, i) => (
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
                {footerLinks.quickLinks.map((link, index) => (
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
                {footerLinks.sections.map((link, index) => (
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
                {footerLinks.contact.map((link, index) => (
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
              © 2025 فتحة. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
              <a href="#" className="hover:text-primary-400 transition-colors py-1">
                سياسة الخصوصية
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors py-1">
                الشروط والأحكام
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

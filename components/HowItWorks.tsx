'use client'

import { Video, ExternalLink } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const INSTAGRAM_REEL_URL = 'https://www.instagram.com/reel/DVPIy5kDSER/?igsh=cm14bHlmczlibXdo'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>دليلك السريع</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            كيف <span className="gradient-text">تعمل المنصة</span>؟
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            شاهد الفيديو التوضيحي من فريق فتحة على إنستغرام لتفهمي خطوة بخطوة كيف
            تستفيدين من الدورات، المنهج، والمجتمع.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="scale" delay={100} className="max-w-2xl mx-auto">
          <a
            href={INSTAGRAM_REEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-1 hover:border-primary-200 transition-all duration-300"
          >
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-primary text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video size={32} className="sm:w-10 sm:h-10" />
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                فيديو: شرح منصة فتحة
              </h3>
              <p className="text-gray-600 text-sm sm:text-base mb-4">
                انستغرام — شاهد كيف تبدأين رحلتك وتستكشفين المحتوى والدورات
              </p>
              <span className="inline-flex items-center gap-2 text-primary-600 font-semibold">
                <ExternalLink size={18} />
                <span>مشاهدة على إنستغرام</span>
              </span>
            </div>
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}

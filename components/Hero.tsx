'use client'

import { Compass, GraduationCap, Sparkles } from 'lucide-react'

export default function Hero() {
  return (
    <section id="home" className="pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-16 lg:pb-20 bg-white overflow-hidden relative">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge - mobile first */}
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-500 px-4 py-2.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-semibold mb-6 sm:mb-8 animate-fade-in-up">
            <Sparkles size={14} className="animate-pulse sm:w-4 sm:h-4" />
            <span>منصة فتحة — لنهضة ووعي الأمة</span>
          </div>

          {/* Main Heading - colored like reference: نفتح أبواب (dark), نور (pink), الشريعة (purple), بروح رصينة (dark) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in-up animation-delay-200 text-gray-900">
            <span>نفتح أبواب </span>
            <span className="text-[#E93B7A]">نور</span>
            <br />
            <span className="text-[#8D37F2]">الشريعة</span>
            <span> بروح رصينة</span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400 px-0 sm:px-2">
            انضم إلى مسيرة تعلّم موثوقة تستند إلى القرآن والسنة بفهمٍ سليم ومساراتٍ
            مرحلية، مع شروحٍ واضحة ومجتمع يعينك على الثبات والنهوض — من الفرد إلى
            الأمة.
          </p>

          {/* CTA Buttons - pill style with shadow: purple = ابدأ رحلتك الآن, magenta = استكشف المنهج */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6 animate-fade-in-up animation-delay-600 max-w-sm sm:max-w-none mx-auto">
            <a
              href="#courses"
              className="hero-btn hero-btn-purple w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-white text-sm sm:text-base lg:text-lg font-bold py-3.5 sm:py-4 px-6 sm:px-8 min-h-[48px] rounded-full shadow-hero transition-all duration-300 hover:shadow-hero-hover hover:-translate-y-0.5"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <GraduationCap size={20} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span>ابدأ رحلتك الآن</span>
            </a>
            <button
              type="button"
              className="hero-btn hero-btn-magenta w-full sm:w-auto inline-flex items-center justify-center gap-2.5 text-white text-sm sm:text-base lg:text-lg font-bold py-3.5 sm:py-4 px-6 sm:px-8 min-h-[48px] rounded-full shadow-hero transition-all duration-300 hover:shadow-hero-hover hover:-translate-y-0.5"
            >
              <Compass size={20} className="sm:w-5 sm:h-5 flex-shrink-0" />
              <span>استكشف المنهج</span>
            </button>
          </div>

          {/* Decorative Elements - smaller on mobile */}
          <div className="absolute top-16 left-4 w-48 h-48 sm:w-72 sm:h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none" />
          <div className="absolute top-32 right-4 w-48 h-48 sm:w-72 sm:h-72 bg-secondary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-200 pointer-events-none" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </section>
  )
}

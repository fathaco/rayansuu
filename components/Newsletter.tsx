'use client'

import { useState } from 'react'
import { Mail, Send } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

export default function Newsletter() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Newsletter subscription:', email)
    setEmail('')
  }

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-20 bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-40 h-40 sm:w-64 sm:h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-5 lg:px-8 relative z-10">
        <ScrollReveal animation="scale" className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 
                        rounded-full mb-6 sm:mb-8 backdrop-blur-sm">
            <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6">
            اشترك في نشرتنا البريدية
          </h2>

          <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-10 leading-relaxed">
            احصل على آخر الأخبار والمقالات والعروض الحصرية مباشرة في بريدك
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-2xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              required
              className="flex-1 px-4 py-3.5 sm:px-6 sm:py-4 rounded-full text-gray-800 text-base
                       focus:outline-none focus:ring-4 focus:ring-white/30 min-h-[48px]
                       transition-all duration-300"
            />
            <button
              type="submit"
              className="bg-white text-primary-500 px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-semibold 
                       hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 
                       flex items-center justify-center gap-2 group min-h-[48px] touch-manipulation"
            >
              <span>🔔</span>
              <span>اشترك</span>
              <Send size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-white/70 text-xs sm:text-sm mt-4 sm:mt-6">
            نحترم خصوصيتك. لن نشارك بريدك الإلكتروني مع أي طرف ثالث.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}

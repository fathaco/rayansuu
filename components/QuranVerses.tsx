'use client'

import ScrollReveal from './ScrollReveal'

const verses = [
  {
    arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ',
    meaning: 'الغاية من خلق الإنسان هي عبادة الله تعالى وتحقيق التوحيد الخالص',
    reference: 'سورة الذاريات: 56',
  },
  {
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    meaning: 'بشارة ربانية بأن الفرج يأتي بعد الشدة وأن اليسر يصاحب العسر',
    reference: 'سورة الشرح: 6',
  },
]

export default function QuranVerses() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>من القرآن الكريم</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            آيات للتدبر <span className="gradient-text">والتأمل</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            آيات قرآنية مختارة لتدبر معانيها والعمل بها في حياتنا اليومية
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {verses.map((verse, index) => (
            <ScrollReveal key={index} animation="scale" delay={index * 120}>
              <div
                className="group bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 
                         transition-all duration-300 hover:border-primary-200 hover:shadow-lg 
                         hover:-translate-y-1 h-full"
              >
                <p className="text-xl sm:text-2xl text-gray-800 leading-relaxed mb-3 sm:mb-4 font-medium text-center">
                  ﴿ {verse.arabic} ﴾
                </p>
                <p className="text-gray-600 leading-relaxed mb-2 sm:mb-3 text-sm sm:text-base">{verse.meaning}</p>
                <p className="text-primary-500 font-semibold text-xs sm:text-sm">{verse.reference}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

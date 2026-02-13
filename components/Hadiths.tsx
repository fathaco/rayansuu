'use client'

import ScrollReveal from './ScrollReveal'

const hadiths = [
  {
    text: 'مَن سَلَكَ طَرِيقًا يَلْتَمِسُ فيه عِلْمًا، سَهَّلَ اللَّهُ له به طَرِيقًا إلى الجَنَّةِ',
    source: 'رواه مسلم',
  },
  {
    text: 'خَيْرُكُمْ مَن تَعَلَّمَ القُرْآنَ وعَلَّمَهُ',
    source: 'رواه البخاري',
  },
  {
    text: 'إنَّما الأعمالُ بالنِّيَّاتِ، وإنَّما لِكُلِّ امْرِئٍ ما نَوَى',
    source: 'متفق عليه',
  },
  {
    text: 'الدُّعَاءُ هو العِبَادَةُ',
    source: 'رواه الترمذي',
  },
]

export default function Hadiths() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>من السنة النبوية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            أحاديث <span className="gradient-text">نبوية</span> مختارة
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            مجموعة من الأحاديث الشريفة المختارة لتعزيز الإيمان وتنوير القلوب
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto">
          {hadiths.map((hadith, index) => (
            <ScrollReveal key={index} animation="fadeUp" delay={index * 100}>
              <div
                className="group bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 
                         transition-all duration-300 hover:border-primary-200 hover:shadow-lg 
                         hover:-translate-y-1 h-full"
              >
                <p className="text-lg sm:text-xl text-gray-800 leading-relaxed mb-3 sm:mb-4 font-medium">
                  &ldquo;{hadith.text}&rdquo;
                </p>
                <p className="text-primary-500 font-semibold text-sm sm:text-base">{hadith.source}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

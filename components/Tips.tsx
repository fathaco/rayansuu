'use client'

import ScrollReveal from './ScrollReveal'

const tips = [
  {
    number: 1,
    title: 'نيّة صادقة وخطة واضحة',
    description:
      'جدّدي النيّة، ثم ارسمي أسبوعكِ: مادة أساسية، مراجعة خفيفة، واختبار قصير. القليل المنتظم يغلب الكثير المتقطع.',
  },
  {
    number: 2,
    title: 'تدرّج ذكي يناسب وقتكِ',
    description:
      'ابدئي بالمتون المختصرة وشروحها الصوتية أثناء الأعمال المنزلية، ثم ارتقي للمطوّلات مع دفاتر تلخيص مركّزة.',
  },
  {
    number: 3,
    title: 'ثبات ومداومة',
    description:
      '20–30 دقيقة يومياً تكفي للإنجاز العميق. رتّبي إشعاراً ثابتاً وبيئة هادئة، وامنحي نفسكِ استراحة قصيرة كل ساعة.',
  },
  {
    number: 4,
    title: 'عمل بالعلم',
    description:
      'طبّقي كل درس في سلوك عملي: ذكرٌ، خُلُق، عبادة، ونفع للأسرة والمجتمع؛ بهذا يترسّخ العلم ويثمر.',
  },
  {
    number: 5,
    title: 'أدب وتواضع ومجتمع آمن',
    description:
      'شاركي في حلقات نسائية آمنة، اطرحي سؤالكِ بثقة، وتلقّي التصويب بسرور. الأدب مفتاح بركة التعلّم.',
  },
  {
    number: 6,
    title: 'مراجعة ذكية وتثبيت',
    description:
      'راجعي بمنهج 1–3–7 (بعد يوم، ثم 3 أيام، ثم أسبوع). استخدمي بطاقات مختصرة واختبارات قصيرة لقياس التقدّم.',
  },
]

export default function Tips() {
  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>نصائح وفوائد</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            نصائح لطالبة <span className="gradient-text">العلم</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            إرشادات عملية مختصرة تُعينكِ على الثبات والاتزان بين طلب العلم ومسؤولياتك
            اليومية، مع خصوصية واحترام لأولوياتك.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
          {tips.map((tip, index) => (
            <ScrollReveal key={tip.number} animation="slideStart" delay={index * 80}>
              <div
                className="group relative bg-gray-50 border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 
                         transition-all duration-300 hover:border-primary-200 hover:shadow-lg 
                         hover:-translate-y-1 h-full"
              >
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-primary 
                              text-white flex items-center justify-center text-lg sm:text-xl font-bold">
                  {tip.number}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 me-12 sm:me-14 group-hover:text-primary-500 transition-colors">
                  {tip.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{tip.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

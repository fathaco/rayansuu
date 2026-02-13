'use client'

import { Award, Users, BookOpen, Library, Video, Clock } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const features = [
  {
    icon: BookOpen,
    title: 'محتوى شرعي موثوق للنساء',
    description:
      'مراجعات علمية دقيقة بإشراف عالمات ومدرِّسات ثقات، مع انتقاء متون تناسب احتياج المرأة ومسائلها اليومية.',
  },
  {
    icon: Video,
    title: 'تعلّم حي وتفاعلي',
    description:
      'حصص مباشرة نسائية، أسئلة فورية، غرف نقاش ومجموعات مذاكرة؛ وكل ذلك بصياغة واضحة وتمارين عملية.',
  },
  {
    icon: Award,
    title: 'شهادات ومسارات معتمدة',
    description:
      'شهادات موثوقة ومسارات مُحكمة: حفظ وتجويد، فقه المرأة، الحديث واللغة—بمستويات تدرُّجية واضحة.',
  },
  {
    icon: Clock,
    title: 'مرونة تناسب نمط يومكِ',
    description:
      'جداول صباحية ومسائية، تسجيلات متاحة دائمًا، ووضعية استماع أثناء الأعمال—من الهاتف أو الحاسوب.',
  },
  {
    icon: Users,
    title: 'مجتمع أخوات داعم',
    description:
      'حلقات متابعة أسبوعية، رفيقات إنجاز، إشراف تربوي ونفسي خفيف؛ بيئة مشجِّعة تعينكِ على الثبات.',
  },
  {
    icon: Library,
    title: 'مكتبة نسائية شاملة',
    description:
      'آلاف المواد المنتقاة: كتب، ملخصات، بطاقات مراجعة، وأسئلة معيارية لقياس تقدُّمكِ خطوة بخطوة.',
  },
]

export default function Features() {
  return (
    <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        {/* Section Header */}
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>لماذا فتحة؟</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            مميزات <span className="gradient-text">منصتنا</span> للنساء
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            تجربة تعليمية رصينة ومواكِبة ببيئة نسائية آمنة وخصوصية عالية، تجمع بين
            أصالة العلم ومنهجية حديثة تناسب وقتكِ ودوركِ في البيت والعمل.
          </p>
        </ScrollReveal>

        {/* Features Grid - stagger children */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <ScrollReveal
                key={index}
                animation="scale"
                delay={index * 80}
                className="h-full"
              >
                <div
                  className="group relative bg-white border border-gray-100 rounded-xl sm:rounded-2xl p-5 sm:p-6 lg:p-8 
                           transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl 
                           hover:border-t-4 hover:border-t-primary-500 cursor-pointer h-full"
                >
                  <div className="mb-4 sm:mb-6 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 
                                rounded-xl sm:rounded-2xl bg-gradient-primary text-white 
                                group-hover:scale-110 transition-transform duration-300">
                    <Icon size={24} className="sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800 group-hover:text-primary-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                    {feature.description}
                  </p>
                  <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 
                                rounded-xl sm:rounded-2xl transition-opacity duration-300 pointer-events-none" />
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

'use client'

import { Target } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const courses = [
  {
    badge: 'جديد',
    badgeColor: 'bg-emerald-500',
    icon: '📖',
    category: 'علوم القرآن',
    title: 'دورة التجويد الميسر',
    description: 'تعلّم أحكام التجويد بطريقة مبسطة وعملية مع التطبيق على سور القرآن',
    hours: '24 ساعة',
    lessons: '48 درساً',
  },
  {
    badge: 'الأكثر مبيعاً',
    badgeColor: 'bg-amber-500',
    icon: '🕌',
    category: 'الفقه',
    title: 'فقه العبادات الشامل',
    description: 'دراسة مفصلة لأحكام الطهارة والصلاة والزكاة والصيام والحج',
    hours: '36 ساعة',
    lessons: '72 درساً',
  },
  {
    badge: 'مميز',
    badgeColor: 'bg-blue-500',
    icon: '📚',
    category: 'الحديث',
    title: 'علم الحديث ومصطلحه',
    description: 'دراسة شاملة لعلوم الحديث النبوي ومصطلحاته وشرح أهم المتون',
    hours: '40 ساعة',
    lessons: '80 درساً',
  },
  {
    badge: 'حصري',
    badgeColor: 'bg-violet-500',
    icon: '🕌',
    category: 'العقيدة',
    title: 'أصول الإيمان والعقيدة',
    description: 'شرح مفصل لأركان الإيمان والعقيدة الصحيحة مع الأدلة الشرعية',
    hours: '28 ساعة',
    lessons: '56 درساً',
  },
  {
    badge: 'متميز',
    badgeColor: 'bg-teal-500',
    icon: '📝',
    category: 'اللغة العربية',
    title: 'النحو والصرف التطبيقي',
    description: 'إتقان قواعد النحو والصرف بالتطبيق على نصوص قرآنية وحديثية',
    hours: '32 ساعة',
    lessons: '64 درساً',
  },
  {
    badge: 'متقدم',
    badgeColor: 'bg-rose-500',
    icon: '⚖️',
    category: 'أصول الفقه',
    title: 'أصول الفقه والقواعد الفقهية',
    description: 'دراسة معمقة لعلم أصول الفقه والقواعد الفقهية وتطبيقاتها العملية',
    hours: '45 ساعة',
    lessons: '90 درساً',
  },
]

export default function Courses() {
  return (
    <section id="courses" className="py-12 sm:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>الدورات الشرعية</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            أحدث <span className="gradient-text">الدورات</span> التعليمية
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            دورات شاملة في مختلف العلوم الشرعية من القرآن والحديث إلى الفقه والعقيدة
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {courses.map((course, index) => (
            <ScrollReveal
              key={index}
              animation="scale"
              delay={index * 70}
              className="h-full"
            >
              <div
                className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg 
                         hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 sm:hover:-translate-y-3 h-full flex flex-col"
              >
                <div className="relative bg-gradient-card p-10 sm:p-12 lg:p-16 text-center border-b-4 border-gray-100">
                  <div
                    className={`absolute top-3 right-3 sm:top-5 sm:right-5 ${course.badgeColor} text-white 
                              px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg`}
                  >
                    {course.badge}
                  </div>
                  <div className="text-6xl sm:text-7xl lg:text-8xl opacity-80 group-hover:scale-110 transition-transform duration-500">
                    {course.icon}
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-8 flex flex-col flex-1">
                  <p className="text-primary-500 font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
                    {course.category}
                  </p>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-primary-500 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 sm:gap-6 py-4 sm:py-5 border-t border-gray-100 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500" />
                      <span>{course.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500" />
                      <span>{course.lessons}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3">
                    <button className="flex-1 bg-gradient-primary text-white py-3 px-4 sm:px-6 rounded-full 
                                     font-semibold text-sm sm:text-base hover:shadow-xl hover:-translate-y-1 
                                     transition-all duration-300 min-h-[48px]">
                      سجّل الآن
                    </button>
                    <button className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full 
                                     bg-primary-500 text-white hover:bg-primary-600 
                                     hover:scale-110 transition-all duration-300 flex-shrink-0">
                      <Target size={18} className="sm:w-5 sm:h-5" />
                    </button>
                  </div>

                  <div className="text-center mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
                    <span className="text-primary-500 font-semibold text-xs sm:text-sm">منصة فتحة</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

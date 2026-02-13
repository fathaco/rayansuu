'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import ScrollReveal from './ScrollReveal'

const faqs = [
  {
    question: 'كيف يمكنني التسجيل في المنصة؟',
    answer:
      'التسجيل بسيط وسريع. اضغطي على "ابدئي الآن"، ثم املئي بياناتك الأساسية واختاري المجال الذي يناسبك. بعد ذلك ستصلك رسالة تأكيد عبر البريد الإلكتروني لتفعيل حسابك.',
  },
  {
    question: 'هل الشهادات معتمدة رسميًا؟',
    answer:
      'نعم، الشهادات صادرة من جهات علمية معتمدة وشريكة للمنصة، وتحمل رقم تحقق إلكتروني يمكن طباعته أو مشاركته في سيرتك الذاتية.',
  },
  {
    question: 'هل المنصة مخصصة للنساء فقط؟',
    answer:
      'نعم، المنصة بيئة نسائية مغلقة وآمنة، كل الدروس والجلسات والمناقشات تُقدَّم بإشراف معلمات مختصات في العلوم الشرعية.',
  },
  {
    question: 'هل يمكنني التواصل مع المدرّسات مباشرة؟',
    answer:
      'نعم، عبر اللقاءات الأسبوعية المباشرة وغرف النقاش الخاصة داخل المنصة. كما يمكنك إرسال الأسئلة الكتابية ليتم الرد عليها من المشرفة العلمية.',
  },
  {
    question: 'كم تستمر مدة الوصول إلى الدورات؟',
    answer:
      'الوصول مفتوح لمدة سنة كاملة من تاريخ التسجيل، مع إمكانية التمديد التلقائي في حال الاشتراك في خطة عضوية.',
  },
  {
    question: 'هل يمكنني الدراسة من الهاتف فقط؟',
    answer:
      'بالتأكيد! المنصة متجاوبة بالكامل، ويمكنك متابعة الدروس من الهاتف أو الجهاز اللوحي بسهولة، كما يتوفر تطبيق خاص للمنصة قريبًا.',
  },
  {
    question: 'هل يمكنني حضور الدروس في وقت لاحق؟',
    answer:
      'نعم، جميع المحاضرات تُسجَّل تلقائيًا، ويمكنك مشاهدتها لاحقًا في أي وقت يناسبك، دون الحاجة لحضور البث المباشر.',
  },
  {
    question: 'هل يوجد دعم فني في حال واجهت مشكلة؟',
    answer:
      'نعم، فريق الدعم متاح على مدار الساعة عبر المحادثة الفورية والبريد الإلكتروني، لمساعدتك في أي مشكلة تقنية أو استفسار تعليمي.',
  },
  {
    question: 'هل يمكنني التسجيل في أكثر من دورة؟',
    answer:
      'نعم، يمكنك الالتحاق بعدة دورات في وقت واحد، مع نظام متابعة ذكي يُظهر لكِ نسبة التقدم في كل مادة.',
  },
  {
    question: 'هل المنصة مجانية بالكامل؟',
    answer:
      'التسجيل مجاني في الأساسيات والدورات التمهيدية، بينما الدورات المتخصصة متاحة بأسعار رمزية لدعم استمرار المنصة وتطويرها.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section id="faq" className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-5 lg:px-8">
        <ScrollReveal animation="fadeUp" className="text-center mb-10 sm:mb-12 lg:mb-16">
          <div className="section-badge mb-3 sm:mb-4 px-4 py-2 sm:px-5 sm:py-2 text-xs sm:text-sm">
            <span>الأسئلة الشائعة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6">
            أسئلة <span className="gradient-text">متكررة</span> لطالباتنا
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            هنا تجدين أجوبة عن أكثر ما يدور في ذهنك حول التسجيل، الدراسة، الخصوصية،
            والشهادات في منصة فتحة.
          </p>
        </ScrollReveal>

        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <ScrollReveal key={index} animation="fadeUp" delay={index * 40}>
              <div
                className="bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden 
                         transition-all duration-300 hover:border-primary-300 hover:shadow-lg"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-5 lg:p-6 text-right 
                           hover:bg-gray-50 transition-colors duration-200 min-h-[56px] sm:min-h-[64px] touch-manipulation"
                >
                  <span className="text-base sm:text-lg font-semibold text-gray-800 flex-1">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 sm:w-6 sm:h-6 text-primary-500 transition-transform duration-300 flex-shrink-0 mr-3 sm:mr-4 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 sm:px-5 lg:px-6 pb-4 sm:pb-5 lg:pb-6">
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
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

'use client'

import { useEffect, useRef, useState } from 'react'
import ScrollReveal from './ScrollReveal'

const stats = [
  { value: 500, label: 'دورة ومحاضرة', suffix: '+' },
  { value: 50000, label: 'طالب علم', suffix: '+' },
  { value: 150, label: 'شيخ ومدرس', suffix: '+' },
  { value: 4.9, label: 'تقييم المنصة', suffix: '/5', isDecimal: true },
]

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => { if (sectionRef.current) observer.unobserve(sectionRef.current) }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 bg-gradient-primary relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-5 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <ScrollReveal
              key={index}
              animation="fadeUp"
              delay={index * 100}
              threshold={0.15}
            >
              <div className="text-center">
                <StatCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isDecimal={stat.isDecimal}
                  isVisible={isVisible}
                />
                <p className="text-white/90 text-sm sm:text-base lg:text-lg font-medium mt-2 sm:mt-3">
                  {stat.label}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCounter({
  value,
  suffix,
  isDecimal,
  isVisible,
}: {
  value: number
  suffix: string
  isDecimal?: boolean
  isVisible: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return
    const duration = 2000
    const steps = 60
    const increment = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else setCount(current)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value, isVisible])

  const displayValue = isDecimal
    ? count.toFixed(1)
    : Math.floor(count).toLocaleString('ar-SA')

  return (
    <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
      {displayValue}
      {suffix}
    </h3>
  )
}

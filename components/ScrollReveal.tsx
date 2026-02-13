'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type AnimationType = 'fadeUp' | 'fadeIn' | 'scale' | 'slideStart'

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Animation style */
  animation?: AnimationType
  /** Delay in ms (e.g. for stagger) */
  delay?: number
  /** Trigger when this much of element is visible (0-1) */
  threshold?: number
  /** Root margin - e.g. "-50px" to trigger a bit earlier */
  rootMargin?: string
}

const animationClasses: Record<AnimationType, { from: string; to: string }> = {
  fadeUp: {
    from: 'opacity-0 translate-y-8 sm:translate-y-10',
    to: 'opacity-100 translate-y-0',
  },
  fadeIn: {
    from: 'opacity-0',
    to: 'opacity-100',
  },
  scale: {
    from: 'opacity-0 scale-[0.96]',
    to: 'opacity-100 scale-100',
  },
  slideStart: {
    from: 'opacity-0 translate-x-8 sm:translate-x-10',
    to: 'opacity-100 translate-x-0',
  },
}

export default function ScrollReveal({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold, rootMargin }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  const { from, to } = animationClasses[animation]
  const transitionDelay = delay ? `${delay}ms` : undefined

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? to : from} ${className}`}
      style={{
        transitionDelay,
        transitionProperty: 'opacity, transform',
      }}
    >
      {children}
    </div>
  )
}

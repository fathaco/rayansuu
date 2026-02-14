'use client'

import { Target, BookOpen } from 'lucide-react'
import type { EventRow } from '@/types/database'

interface EventCardProps {
  event: EventRow
  onRegister?: (event: EventRow) => void
}

export default function EventCard({ event, onRegister }: EventCardProps) {
  const showBadge = event.badge || (event.is_new ? 'جديد' : '')
  const badgeColor = event.badge_color || 'bg-emerald-500'

  return (
    <div
      className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg
                 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col"
    >
      <div className="relative bg-gradient-card border-b-4 border-gray-100 h-48 sm:h-56 md:h-64 overflow-hidden">
        {event.image_url ? (
          <img
            src={event.image_url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <BookOpen className="w-16 h-16 sm:w-20 sm:h-20 text-primary-400 opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
          </div>
        )}
        {showBadge && (
          <div
            className={`absolute top-3 right-3 sm:top-5 sm:right-5 z-10 ${badgeColor} text-white
                       px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg`}
          >
            {showBadge}
          </div>
        )}
      </div>

      <div className="p-5 sm:p-6 lg:p-8 flex flex-col flex-1">
        <p className="text-primary-500 font-semibold text-xs sm:text-sm mb-2 sm:mb-3">
          {event.category}
        </p>
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-primary-500 transition-colors">
          {event.title}
        </h3>
        <p className="text-gray-600 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base flex-1 line-clamp-3">
          {event.description}
        </p>

        <div className="flex items-center gap-4 sm:gap-6 py-4 sm:py-5 border-t border-gray-100 mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500 flex-shrink-0" />
            <span><span className="text-primary-600 font-medium">{event.hours ?? '—'}</span> ساعات</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary-500 flex-shrink-0" />
            <span><span className="text-primary-600 font-medium">{event.lessons ?? '—'}</span> دروس</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onRegister?.(event)}
            className="flex-1 bg-gradient-primary text-white py-3 px-4 sm:px-6 rounded-full
                       font-semibold text-sm sm:text-base hover:shadow-xl hover:-translate-y-1
                       transition-all duration-300 min-h-[48px]"
          >
            سجّل الآن
          </button>
          <span className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-full
                           bg-primary-100 text-primary-500 flex-shrink-0">
            <Target size={18} className="sm:w-5 sm:h-5" />
          </span>
        </div>

        <div className="text-center mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-gray-100">
          <span className="text-primary-500 font-semibold text-xs sm:text-sm">منصة فتحة</span>
        </div>
      </div>
    </div>
  )
}

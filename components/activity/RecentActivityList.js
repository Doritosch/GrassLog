'use client'

import { deleteActivity } from '@/app/(main)/dashboard/actions'
import { getCategoryColor } from '@/lib/category-colors'

export default function RecentActivityList({ activities, selectedDate }) {
  const today = new Date().toISOString().split('T')[0]
  const activeDate = selectedDate || today

  const filtered = activities.filter((a) => a.activity_date === activeDate)

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="grid grid-cols-7 gap-1 mb-4 opacity-20">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="w-3 h-3 rounded-sm bg-[#39d353]" />
          ))}
        </div>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">이 날 기록된 활동이 없어요.</p>
        {activeDate === today && (
          <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-1">아래 입력창에서 오늘의 첫 활동을 기록해보세요!</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="space-y-0.5">
        {filtered.map((activity) => {
          const categories = activity.category_name
            ? activity.category_name.split(', ').filter(Boolean)
            : []

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 px-3 py-2 rounded-md group transition-colors"
              style={{ '--hover-bg': 'var(--bg-surface)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <div className="flex gap-1 shrink-0 md:min-w-[60px]">
                  {categories.length > 0 ? categories.map((cat) => {
                    const color = getCategoryColor(cat)
                    return (
                      <span
                        key={cat}
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
                      >
                        {cat}
                      </span>
                    )
                  }) : <span className="inline-block" />}
                </div>
                <p style={{ color: 'var(--text-body)' }} className="text-sm whitespace-pre-wrap break-words min-w-0">{activity.title}</p>
                {activity.image_url && (
                  <img
                    src={activity.image_url}
                    alt="첨부 이미지"
                    className="max-w-xs max-h-64 w-auto h-auto rounded-lg object-contain border cursor-pointer"
                    style={{ borderColor: 'var(--border)' }}
                    onClick={() => window.open(activity.image_url, '_blank')}
                  />
                )}
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span style={{ color: 'var(--text-muted)' }} className="text-[10px]">
                  {new Date(activity.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
                <button
                  onClick={() => deleteActivity(activity.id)}
                  style={{ color: 'var(--text-muted)' }}
                  className="hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                >
                  삭제
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

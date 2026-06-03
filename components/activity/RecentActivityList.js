'use client'

import { useEffect, useRef, useState } from 'react'
import { deleteActivity } from '@/app/(main)/dashboard/actions'
import { getCategoryColor } from '@/lib/category-colors'
import { useMain } from '@/components/providers/MainProvider'
import { toKSTDateStr } from '@/lib/date/kst'
import { parseImageUrls } from '@/lib/image-urls'
import ImageLightbox from '@/components/ui/ImageLightbox'

export default function RecentActivityList({ activities, selectedDate }) {
  const { highlightId, editedIds, setEditingActivity } = useMain()
  const highlightRef = useRef(null)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const today = toKSTDateStr()
  const activeDate = selectedDate || today

  const filtered = activities.filter((a) => a.activity_date === activeDate)

  useEffect(() => {
    if (highlightId && highlightRef.current) {
      highlightRef.current.scrollIntoView({ behavior: 'instant', block: 'center' })
    }
  }, [highlightId])

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
      {lightboxSrc && <ImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
      <div className="space-y-0.5">
        {filtered.map((activity) => {
          const cats = activity.category_name
            ? activity.category_name.split(', ').filter(Boolean)
            : []
          const isHighlighted = activity.id === highlightId
          const isEdited = editedIds.has(activity.id)

          return (
            <div
              key={activity.id}
              ref={isHighlighted ? highlightRef : null}
              className="flex items-start gap-3 px-3 py-2 rounded-md group transition-all duration-300"
              style={{ background: isHighlighted ? 'var(--bg-elevated)' : 'transparent' }}
              onMouseEnter={e => { if (!isHighlighted) e.currentTarget.style.background = 'var(--bg-surface)' }}
              onMouseLeave={e => { if (!isHighlighted) e.currentTarget.style.background = 'transparent' }}
            >
              <div className="flex items-start gap-2 min-w-0 flex-1">
                <div className="flex gap-1 shrink-0 md:min-w-[60px]">
                  {cats.length > 0 ? cats.map((cat) => {
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
                <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                  {parseImageUrls(activity.image_url).length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {parseImageUrls(activity.image_url).map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt="첨부 이미지"
                          className="max-w-[200px] md:max-w-xs max-h-48 md:max-h-64 w-auto h-auto rounded-lg object-contain border cursor-pointer"
                          style={{ borderColor: 'var(--border)' }}
                          onClick={() => setLightboxSrc(url)}
                        />
                      ))}
                    </div>
                  )}
                  {activity.title && (
                    <p style={{ color: 'var(--text-body)' }} className="text-sm whitespace-pre-wrap break-words min-w-0">{activity.title}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <span style={{ color: 'var(--text-muted)' }} className="text-[10px]">
                  {new Date(activity.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
                {isEdited && (
                  <span style={{ color: 'var(--text-muted)' }} className="text-[10px]">수정함</span>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => setEditingActivity(activity)}
                    style={{ color: 'var(--text-muted)' }}
                    className="hover:opacity-80 text-xs cursor-pointer"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => deleteActivity(activity.id)}
                    style={{ color: 'var(--text-muted)' }}
                    className="hover:text-red-400 text-xs cursor-pointer"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

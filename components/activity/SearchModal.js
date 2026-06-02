'use client'

import { useState, useEffect, useRef } from 'react'
import { useMain } from '@/components/providers/MainProvider'
import { getCategoryColor } from '@/lib/category-colors'
import { toKSTDateStr } from '@/lib/date/kst'
import { parseImageUrls } from '@/lib/image-urls'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayStr = toKSTDateStr()
  const diff = Math.floor((new Date(todayStr) - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

export default function SearchModal({ onClose, onSelectActivity }) {
  const { activities } = useMain()
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  const results = query.trim()
    ? activities.filter((a) => {
        const q = query.toLowerCase()
        return (
          a.title?.toLowerCase().includes(q) ||
          a.category_name?.toLowerCase().includes(q)
        )
      })
    : []

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl border shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 검색창 */}
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="활동 검색..."
            className="flex-1 bg-transparent focus:outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80 text-xs cursor-pointer">
              ×
            </button>
          )}
        </div>

        {/* 결과 */}
        <div className="max-h-80 overflow-y-auto scrollbar-dark">
          {query.trim() === '' ? (
            <p className="px-4 py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>검색어를 입력하세요</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-sm text-center" style={{ color: 'var(--text-muted)' }}>검색 결과가 없어요</p>
          ) : (
            results.map((activity) => {
              const categories = activity.category_name
                ? activity.category_name.split(', ').filter(Boolean)
                : []
              return (
                <button
                  key={activity.id}
                  onClick={() => onSelectActivity(activity)}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b text-left transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {categories.map((cat) => {
                        const color = getCategoryColor(cat)
                        return (
                          <span key={cat} className="text-xs px-2 py-0.5 rounded-full border shrink-0"
                            style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}>
                            {cat}
                          </span>
                        )
                      })}
                      <span className="text-sm truncate" style={{ color: 'var(--text-body)' }}>
                        {activity.title || (parseImageUrls(activity.image_url).length > 0 ? '이미지' : '')}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
                    {formatDate(activity.activity_date)}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

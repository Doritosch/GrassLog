'use client'

import { useEffect, useRef, useState } from 'react'
import { deleteActivity, updateActivity } from '@/app/(main)/dashboard/actions'
import { getCategoryColor } from '@/lib/category-colors'
import { useMain } from '@/components/providers/MainProvider'
import { toKSTDateStr } from '@/lib/date/kst'

function InlineEditor({ activity, categories, onClose }) {
  const [title, setTitle] = useState(activity.title || '')
  const [selectedCategory, setSelectedCategory] = useState(
    activity.category_name ? activity.category_name.split(', ').filter(Boolean) : []
  )
  const [loading, setLoading] = useState(false)
  const textareaRef = useRef(null)

  useEffect(() => {
    textareaRef.current?.focus()
    const el = textareaRef.current
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px' }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    await updateActivity(activity.id, {
      title: title || null,
      category_name: selectedCategory.join(', ') || null,
    })
    setLoading(false)
    onClose()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSave() }
    if (e.key === 'Escape') onClose()
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 카테고리 태그 선택 */}
      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => {
          const color = getCategoryColor(cat.name)
          const selected = selectedCategory.includes(cat.name)
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(prev =>
                selected ? prev.filter(c => c !== cat.name) : [...prev, cat.name]
              )}
              className="text-xs px-2 py-0.5 rounded-full border transition-opacity"
              style={{
                backgroundColor: selected ? color.bg : 'transparent',
                color: selected ? color.text : 'var(--text-muted)',
                borderColor: selected ? color.border : 'var(--border)',
                opacity: selected ? 1 : 0.6,
              }}
            >
              {cat.name}
            </button>
          )
        })}
      </div>

      {/* 텍스트 편집 */}
      <textarea
        ref={textareaRef}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value)
          e.target.style.height = 'auto'
          e.target.style.height = e.target.scrollHeight + 'px'
        }}
        onKeyDown={handleKeyDown}
        rows={1}
        className="w-full bg-transparent focus:outline-none text-sm resize-none leading-tight overflow-hidden border-b pb-1"
        style={{ color: 'var(--text-primary)', borderColor: 'var(--border)' }}
      />

      {/* 버튼 */}
      <div className="flex gap-2 justify-end">
        <button
          onClick={onClose}
          className="text-xs px-2 py-1 rounded-md transition-opacity hover:opacity-80"
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', border: '1px solid' }}
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={loading}
          className="text-xs px-2 py-1 rounded-md text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          {loading ? '...' : '저장'}
        </button>
      </div>
    </div>
  )
}

export default function RecentActivityList({ activities, selectedDate }) {
  const { highlightId, categories } = useMain()
  const [editingId, setEditingId] = useState(null)
  const highlightRef = useRef(null)
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
      <div className="space-y-0.5">
        {filtered.map((activity) => {
          const cats = activity.category_name
            ? activity.category_name.split(', ').filter(Boolean)
            : []
          const isHighlighted = activity.id === highlightId
          const isEditing = activity.id === editingId

          return (
            <div
              key={activity.id}
              ref={isHighlighted ? highlightRef : null}
              className="flex items-start gap-3 px-3 py-2 rounded-md group transition-all duration-300"
              style={{ background: isHighlighted ? 'var(--bg-elevated)' : 'transparent' }}
              onMouseEnter={e => { if (!isHighlighted) e.currentTarget.style.background = 'var(--bg-surface)' }}
              onMouseLeave={e => { if (!isHighlighted) e.currentTarget.style.background = 'transparent' }}
            >
              {isEditing ? (
                <InlineEditor
                  activity={activity}
                  categories={categories}
                  onClose={() => setEditingId(null)}
                />
              ) : (
                <>
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
                      {new Date(activity.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => setEditingId(activity.id)}
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
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

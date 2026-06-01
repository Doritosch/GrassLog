'use client'

import { useState } from 'react'
import { createActivity } from '@/app/dashboard/actions'
import CategoryInput from './CategoryInput'
import { getCategoryColor } from '@/lib/category-colors'

export default function ActivityForm({ categories }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    formData.set('category_name', selectedCategory.join(', '))
    // 날짜는 오늘로 고정
    const today = new Date().toISOString().split('T')[0]
    formData.set('activity_date', today)

    const result = await createActivity(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      e.target.reset()
      setSelectedCategory([])
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}

      {/* 한 줄 통합 입력창 */}
      <div className="flex items-center gap-2 bg-[#161B22] border border-[#30363D] rounded-xl px-4 py-2.5 focus-within:border-[#388BFD] transition-colors">
        {/* 카테고리 태그들 */}
        {selectedCategory.map((name) => {
          const color = getCategoryColor(name)
          return (
            <span
              key={name}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full shrink-0 border"
              style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
            >
              {name}
              <button
                type="button"
                onClick={() => setSelectedCategory((prev) => prev.filter((c) => c !== name))}
                className="hover:opacity-70 leading-none"
              >×</button>
            </span>
          )
        })}

        {/* 텍스트 입력 */}
        <textarea
          name="title"
          rows={1}
          placeholder="오늘 무엇을 했나요?"
          required
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!loading) e.target.form.requestSubmit()
            }
          }}
          onChange={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
          className="flex-1 bg-transparent text-white placeholder-[#8B949E] focus:outline-none text-sm min-w-0 resize-none leading-tight overflow-hidden"
        />

        {/* 카테고리 선택 */}
        <div className="shrink-0">
          <CategoryInput
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
            compact
          />
        </div>

        {/* 기록 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors shrink-0"
        >
          {loading ? '...' : '기록'}
        </button>
      </div>
    </form>
  )
}

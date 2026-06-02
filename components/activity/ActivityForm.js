'use client'

import { useState, useRef } from 'react'
import { createActivity } from '@/app/(main)/dashboard/actions'
import CategoryInput from './CategoryInput'
import { getCategoryColor } from '@/lib/category-colors'

export default function ActivityForm({ categories }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const applyImage = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleImageChange = (e) => {
    applyImage(e.target.files?.[0])
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    applyImage(e.dataTransfer.files?.[0])
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    formData.set('category_name', selectedCategory.join(', '))
    const today = new Date().toISOString().split('T')[0]
    formData.set('activity_date', today)
    if (imageFile) formData.set('image', imageFile)

    const result = await createActivity(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      e.target.reset()
      setSelectedCategory([])
      setImageFile(null)
      setImagePreview(null)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}

      {/* 이미지 미리보기 */}
      {imagePreview && (
        <div className="relative inline-block">
          <img src={imagePreview} alt="미리보기" className="h-20 rounded-lg object-cover border" style={{ borderColor: 'var(--border)' }} />
          <button
            type="button"
            onClick={removeImage}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center transition-colors"
            style={{ background: 'var(--bg-elevated)' }}
          >×</button>
        </div>
      )}

      {/* 한 줄 통합 입력창 */}
      <div
        style={{
          background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          borderColor: isDragging ? 'var(--link)' : 'var(--border)',
        }}
        className="flex items-center gap-2 border rounded-xl px-4 py-2.5 focus-within:border-[var(--link)] transition-colors"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
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
          required={!imageFile}
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
          style={{ color: 'var(--text-primary)' }}
          className="flex-1 bg-transparent placeholder-[color:var(--text-muted)] focus:outline-none text-sm min-w-0 resize-none leading-tight overflow-hidden"
        />

        {/* 이미지 업로드 버튼 */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{ color: 'var(--text-muted)' }}
          className="hover:opacity-80 transition-opacity shrink-0"
          title="이미지 첨부"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4.002 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
            <path d="M10.648 7.646a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1-.707.707L11 8.707l-2.646 2.647a.5.5 0 0 1-.707 0L6.5 10.207l-2.146 2.147a.5.5 0 0 1-.708-.708l2.5-2.5a.5.5 0 0 1 .708 0L8.5 10.293l2.148-2.647z"/>
            <path d="M5.5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
          </svg>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
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
          style={{ background: 'var(--accent)' }}
          className="px-3 py-1.5 hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-opacity shrink-0"
        >
          {loading ? '...' : '기록'}
        </button>
      </div>
    </form>
  )
}

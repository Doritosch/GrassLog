'use client'

import { useState, useRef, useEffect } from 'react'
import { createActivity, updateActivity } from '@/app/(main)/dashboard/actions'
import CategoryInput from './CategoryInput'
import { getCategoryColor } from '@/lib/category-colors'
import { toKSTDateStr } from '@/lib/date/kst'
import { parseImageUrls } from '@/lib/image-urls'
import { useMain } from '@/components/providers/MainProvider'

export default function ActivityForm({ categories }) {
  const { editingActivity, setEditingActivity, markEdited } = useMain()
  const isEditing = !!editingActivity

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState([])
  // 기존 이미지 URL 목록 (수정 모드에서 유지할 것들)
  const [existingUrls, setExistingUrls] = useState([])
  // 새로 추가할 파일 목록
  const [newFiles, setNewFiles] = useState([])
  const [newPreviews, setNewPreviews] = useState([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const textareaRef = useRef(null)

  const totalImageCount = existingUrls.length + newFiles.length

  useEffect(() => {
    if (editingActivity) {
      setSelectedCategory(
        editingActivity.category_name
          ? editingActivity.category_name.split(', ').filter(Boolean)
          : []
      )
      setExistingUrls(parseImageUrls(editingActivity.image_url))
      setNewFiles([])
      setNewPreviews([])
      setError('')
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.value = editingActivity.title || ''
          textareaRef.current.style.height = 'auto'
          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
          textareaRef.current.focus()
        }
      }, 0)
    } else {
      setSelectedCategory([])
      setExistingUrls([])
      setNewFiles([])
      setNewPreviews([])
      setError('')
      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.style.height = 'auto'
      }
    }
  }, [editingActivity])

  const applyFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'))
    if (validFiles.length === 0) return
    const available = 5 - totalImageCount
    const toAdd = validFiles.slice(0, available)
    setNewFiles(prev => [...prev, ...toAdd])
    toAdd.forEach(file => {
      const url = URL.createObjectURL(file)
      setNewPreviews(prev => [...prev, url])
    })
  }

  const handleImageChange = (e) => { applyFiles(e.target.files); e.target.value = '' }
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e) => { if (!e.currentTarget.contains(e.relatedTarget)) setIsDragging(false) }
  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); applyFiles(e.dataTransfer.files) }

  const removeExisting = (idx) => setExistingUrls(prev => prev.filter((_, i) => i !== idx))
  const removeNew = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx))
    setNewPreviews(prev => prev.filter((_, i) => i !== idx))
  }

  const handleCancel = () => setEditingActivity(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    formData.set('category_name', selectedCategory.join(', '))
    newFiles.forEach(f => formData.append('images', f))

    let result
    if (isEditing) {
      formData.set('existing_images', JSON.stringify(existingUrls))
      result = await updateActivity(editingActivity.id, formData)
    } else {
      formData.set('activity_date', toKSTDateStr())
      result = await createActivity(formData)
    }

    if (result?.error) {
      setError(result.error)
    } else {
      if (isEditing) markEdited(editingActivity.id)
      setEditingActivity(null)
      if (!isEditing) {
        e.target.reset()
        setSelectedCategory([])
        setExistingUrls([])
        setNewFiles([])
        setNewPreviews([])
      }
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {isEditing && (
        <div className="flex items-center gap-2 px-1">
          <span style={{ color: 'var(--accent)' }} className="text-xs font-medium">수정 중</span>
          <button type="button" onClick={handleCancel} style={{ color: 'var(--text-muted)' }} className="text-xs hover:opacity-80 cursor-pointer">취소</button>
        </div>
      )}
      {error && <p className="text-red-400 text-xs px-1">{error}</p>}

      {/* 이미지 미리보기 */}
      {(existingUrls.length > 0 || newPreviews.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {existingUrls.map((url, idx) => (
            <div key={url} className="relative inline-block">
              <img src={url} alt="기존 이미지" className="h-20 rounded-lg object-cover border" style={{ borderColor: 'var(--border)' }} />
              <button
                type="button"
                onClick={() => removeExisting(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg-elevated)' }}
              >×</button>
            </div>
          ))}
          {newPreviews.map((url, idx) => (
            <div key={idx} className="relative inline-block">
              <img src={url} alt="새 이미지" className="h-20 rounded-lg object-cover border" style={{ borderColor: 'var(--border)' }} />
              <button
                type="button"
                onClick={() => removeNew(idx)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 hover:bg-red-500 text-white rounded-full text-xs flex items-center justify-center transition-colors"
                style={{ background: 'var(--bg-elevated)' }}
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* 입력창 */}
      <div
        data-tour="tour-input"
        style={{
          background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          borderColor: isEditing ? 'var(--accent)' : isDragging ? 'var(--link)' : 'var(--border)',
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
                className="hover:opacity-70 leading-none cursor-pointer"
              >×</button>
            </span>
          )
        })}

        {/* 텍스트 입력 */}
        <textarea
          ref={textareaRef}
          name="title"
          rows={1}
          placeholder={isEditing ? '활동 내용을 수정하세요' : '오늘 무엇을 했나요?'}
          required={totalImageCount === 0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (!loading) e.target.form.requestSubmit()
            }
            if (e.key === 'Escape' && isEditing) handleCancel()
          }}
          onChange={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = e.target.scrollHeight + 'px'
          }}
          style={{ color: 'var(--text-primary)' }}
          className="flex-1 bg-transparent placeholder-[color:var(--text-muted)] focus:outline-none text-sm min-w-0 resize-none leading-tight overflow-hidden"
        />

        {/* 이미지 업로드 버튼 */}
        {totalImageCount < 5 && (
          <button
            type="button"
            data-tour="tour-image"
            onClick={() => fileInputRef.current?.click()}
            style={{ color: 'var(--text-muted)' }}
            className="hover:opacity-80 transition-opacity shrink-0 cursor-pointer"
            title={`이미지 첨부 (${totalImageCount}/5)`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4.002 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/>
              <path d="M10.648 7.646a.5.5 0 0 1 .707 0l2.5 2.5a.5.5 0 0 1-.707.707L11 8.707l-2.646 2.647a.5.5 0 0 1-.707 0L6.5 10.207l-2.146 2.147a.5.5 0 0 1-.708-.708l2.5-2.5a.5.5 0 0 1 .708 0L8.5 10.293l2.148-2.647z"/>
              <path d="M5.5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleImageChange}
        />

        {/* 카테고리 선택 */}
        <div className="shrink-0" data-tour="tour-category">
          <CategoryInput
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
            compact
          />
        </div>

        {/* 저장 버튼 */}
        <button
          type="submit"
          disabled={loading}
          style={{ background: 'var(--accent)' }}
          className="px-3 py-1.5 hover:opacity-90 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-opacity shrink-0 cursor-pointer"
        >
          {loading ? '...' : isEditing ? '저장' : '기록'}
        </button>
      </div>
    </form>
  )
}

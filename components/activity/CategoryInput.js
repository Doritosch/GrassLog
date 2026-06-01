'use client'

import { useState, useRef, useEffect } from 'react'
import { createCategory } from '@/app/dashboard/actions'
import { getCategoryColor } from '@/lib/category-colors'

export default function CategoryInput({ categories, selected, onChange, compact = false }) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const [localCategories, setLocalCategories] = useState(categories)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  const filtered = localCategories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(cat.name)
  )

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setInput('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (name) => {
    if (!selected.includes(name)) {
      onChange([...selected, name])
    }
    setInput('')
    setOpen(false)
  }

  const addNewCategory = async (name) => {
    const existing = localCategories.find((c) => c.name.toLowerCase() === name.toLowerCase())
    if (existing) {
      handleSelect(existing.name)
      return
    }
    const formData = new FormData()
    formData.set('name', name)
    const result = await createCategory(formData)
    if (result?.error && result.error !== '이미 존재하는 카테고리예요.') {
      alert(result.error)
      return
    }
    const newCat = { id: Date.now(), name }
    setLocalCategories((prev) => {
      const alreadyExists = prev.find((c) => c.name.toLowerCase() === name.toLowerCase())
      return alreadyExists ? prev : [...prev, newCat]
    })
    handleSelect(name)
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault()
      await addNewCategory(input.trim())
    }
    if (e.key === 'Backspace' && !input && selected.length > 0) {
      onChange(selected.slice(0, -1))
    }
    if (e.key === 'Escape') {
      setOpen(false)
      setInput('')
    }
  }

  if (compact) {
    // 컴팩트 모드: 태그 아이콘 버튼만 표시, 클릭 시 드롭다운
    return (
      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 0) }}
          className="p-1.5 text-[#8B949E] hover:text-white hover:bg-[#21262D] rounded-md transition-colors"
          title="카테고리 추가"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .064.025.125.07.17l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25ZM6 5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"/>
          </svg>
        </button>

        {open && (
          <div className="absolute bottom-full right-0 mb-1 w-52 bg-[#161B22] border border-[#30363D] rounded-md shadow-lg z-20">
            <div className="p-2 border-b border-[#30363D]">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="카테고리 검색 또는 생성"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded px-2 py-1 text-white text-xs placeholder-[#8B949E] focus:outline-none focus:border-[#388BFD]"
              />
            </div>
            <div className="max-h-40 overflow-y-auto">
              {filtered.map((cat) => {
                const color = getCategoryColor(cat.name)
                return (
                  <div key={cat.id} className="flex items-center group">
                    <button
                      type="button"
                      onClick={() => handleSelect(cat.name)}
                      className="flex-1 text-left px-3 py-1.5 text-xs hover:bg-[#21262D] transition-colors flex items-center gap-2"
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color.text }}
                      />
                      <span className="text-[#C9D1D9]">{cat.name}</span>
                    </button>
                    <button
                      type="button"
                      onMouseDown={async (e) => {
                        e.preventDefault()
                        const { deleteCategory } = await import('@/app/dashboard/actions')
                        await deleteCategory(cat.id)
                        setLocalCategories((prev) => prev.filter((c) => c.id !== cat.id))
                        onChange(selected.filter((s) => s !== cat.name))
                      }}
                      className="px-2 py-1.5 text-[#8B949E] hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all"
                    >
                      ×
                    </button>
                  </div>
                )
              })}
              {input.trim() && !localCategories.find((c) => c.name.toLowerCase() === input.trim().toLowerCase()) && (
                <button
                  type="button"
                  onMouseDown={async (e) => {
                    e.preventDefault()
                    await addNewCategory(input.trim())
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#8B949E] hover:bg-[#21262D] border-t border-[#30363D]"
                >
                  <span className="text-[#388BFD]">+ "{input.trim()}"</span> 새로 만들기
                </button>
              )}
              {filtered.length === 0 && !input.trim() && (
                <p className="px-3 py-2 text-xs text-[#8B949E]">카테고리를 입력하세요</p>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  // 기본 모드 (인라인)
  return (
    <div ref={containerRef} className="relative flex-1">
      <div
        className="flex items-center flex-wrap gap-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md focus-within:border-[#388BFD] cursor-text min-h-[38px]"
        onClick={() => { setOpen(true); inputRef.current?.focus() }}
      >
        {selected.map((name) => {
          const color = getCategoryColor(name)
          return (
            <span
              key={name}
              className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border whitespace-nowrap"
              style={{ backgroundColor: color.bg, color: color.text, borderColor: color.border }}
            >
              {name}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(selected.filter((s) => s !== name)) }}
                className="hover:opacity-70 leading-none"
              >×</button>
            </span>
          )
        })}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? '카테고리 검색 또는 생성' : ''}
          className="flex-1 bg-transparent text-white placeholder-[#8B949E] text-sm focus:outline-none min-w-[120px]"
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-[#161B22] border border-[#30363D] rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
          {filtered.map((cat) => {
            const color = getCategoryColor(cat.name)
            return (
              <div key={cat.id} className="flex items-center group">
                <button
                  type="button"
                  onClick={() => handleSelect(cat.name)}
                  className="flex-1 text-left px-3 py-2 text-sm hover:bg-[#21262D] transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color.text }} />
                  <span className="text-[#C9D1D9]">{cat.name}</span>
                </button>
                <button
                  type="button"
                  onMouseDown={async (e) => {
                    e.preventDefault()
                    const { deleteCategory } = await import('@/app/dashboard/actions')
                    await deleteCategory(cat.id)
                    setLocalCategories((prev) => prev.filter((c) => c.id !== cat.id))
                    onChange(selected.filter((s) => s !== cat.name))
                  }}
                  className="px-3 py-2 text-[#8B949E] hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all"
                >
                  삭제
                </button>
              </div>
            )
          })}
          {input.trim() && !localCategories.find((c) => c.name.toLowerCase() === input.trim().toLowerCase()) && (
            <button
              type="button"
              onMouseDown={async (e) => {
                e.preventDefault()
                await addNewCategory(input.trim())
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#8B949E] hover:bg-[#21262D] border-t border-[#30363D]"
            >
              <span className="text-[#388BFD]">+ "{input.trim()}"</span> 새로 만들기
            </button>
          )}
          {filtered.length === 0 && !input.trim() && (
            <p className="px-3 py-2 text-xs text-[#8B949E]">카테고리를 입력하고 엔터를 누르세요</p>
          )}
        </div>
      )}
    </div>
  )
}

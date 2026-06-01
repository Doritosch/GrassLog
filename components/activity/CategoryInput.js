'use client'

import { useState, useRef, useEffect } from 'react'
import { createCategory } from '@/app/dashboard/actions'

export default function CategoryInput({ categories, selected, onChange }) {
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
    inputRef.current?.focus()
  }

  const handleRemove = (name) => {
    onChange(selected.filter((s) => s !== name))
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

  return (
    <div ref={containerRef} className="relative flex-1">
      <div
        className="flex items-center flex-wrap gap-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md focus-within:border-[#388BFD] cursor-text min-h-[38px]"
        onClick={() => { setOpen(true); inputRef.current?.focus() }}
      >
        {selected.map((name) => (
          <span
            key={name}
            className="flex items-center gap-1 bg-[#388BFD22] text-[#388BFD] text-xs px-2 py-0.5 rounded-full whitespace-nowrap"
          >
            {name}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(name) }}
              className="hover:text-white leading-none"
            >×</button>
          </span>
        ))}
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
          {filtered.length > 0 && (
            <ul>
              {filtered.map((cat) => (
                <li key={cat.id} className="flex items-center group">
                  <button
                    type="button"
                    onClick={() => handleSelect(cat.name)}
                    className="flex-1 text-left px-3 py-2 text-sm text-[#C9D1D9] hover:bg-[#21262D] transition-colors"
                  >
                    {cat.name}
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
                    className="px-3 py-2 text-[#8B949E] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
          {input.trim() && !localCategories.find((c) => c.name.toLowerCase() === input.trim().toLowerCase()) && (
            <button
              type="button"
              onMouseDown={async (e) => {
                e.preventDefault()
                await addNewCategory(input.trim())
              }}
              className="w-full text-left px-3 py-2 text-sm text-[#8B949E] hover:bg-[#21262D] transition-colors border-t border-[#30363D]"
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

'use client'

import { useState } from 'react'
import { createCategory, deleteCategory } from '@/app/(main)/dashboard/actions'

export default function CategoryManager({ categories }) {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleAdd = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.target)
    const result = await createCategory(formData)
    if (result?.error) setError(result.error)
    else e.target.reset()
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await deleteCategory(id)
  }

  return (
    <div className="border rounded-lg overflow-hidden" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left transition-opacity hover:opacity-80"
      >
        <span style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">카테고리 관리</span>
        <span style={{ color: 'var(--text-muted)' }} className="text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <form onSubmit={handleAdd} className="flex gap-2 mt-3">
            <input
              name="name"
              type="text"
              placeholder="새 카테고리 이름"
              maxLength={40}
              required
              style={{ background: 'var(--bg-base)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              className="flex-1 px-3 py-1.5 border rounded-md placeholder-[color:var(--text-muted)] focus:outline-none focus:border-[var(--link)] text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              style={{ background: 'var(--accent)' }}
              className="px-3 py-1.5 hover:opacity-90 disabled:opacity-50 text-white rounded-md text-sm transition-opacity"
            >
              추가
            </button>
          </form>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          {categories.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }} className="text-xs">아직 카테고리가 없어요.</p>
          ) : (
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between group">
                  <span style={{ color: 'var(--text-body)' }} className="text-sm">{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    style={{ color: 'var(--text-muted)' }}
                    className="hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

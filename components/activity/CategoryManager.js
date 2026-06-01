'use client'

import { useState } from 'react'
import { createCategory, deleteCategory } from '@/app/dashboard/actions'

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
    if (result?.error) {
      setError(result.error)
    } else {
      e.target.reset()
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    await deleteCategory(id)
  }

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#21262D] transition-colors"
      >
        <span className="text-white text-sm font-semibold">카테고리 관리</span>
        <span className="text-[#8B949E] text-xs">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#30363D]">
          <form onSubmit={handleAdd} className="flex gap-2 mt-3">
            <input
              name="name"
              type="text"
              placeholder="새 카테고리 이름"
              maxLength={40}
              required
              className="flex-1 px-3 py-1.5 bg-[#0D1117] border border-[#30363D] rounded-md text-white placeholder-[#8B949E] focus:outline-none focus:border-[#388BFD] text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white rounded-md text-sm transition-colors"
            >
              추가
            </button>
          </form>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          {categories.length === 0 ? (
            <p className="text-[#8B949E] text-xs">아직 카테고리가 없어요.</p>
          ) : (
            <ul className="space-y-1">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center justify-between group">
                  <span className="text-[#C9D1D9] text-sm">{cat.name}</span>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="text-[#8B949E] hover:text-red-400 opacity-0 group-hover:opacity-100 text-xs transition-all"
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

'use client'

import { useState } from 'react'
import { createActivity } from '@/app/dashboard/actions'

export default function ActivityForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.target)
    const result = await createActivity(formData)

    if (result?.error) {
      setError(result.error)
    } else {
      e.target.reset()
      // 날짜를 오늘로 다시 설정
      e.target.activity_date.value = today
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 space-y-3">
      <h2 className="text-white font-semibold">오늘의 활동 기록</h2>

      <input
        name="title"
        type="text"
        placeholder="무엇을 했나요? (예: 운동 30분, 책 읽기)"
        required
        autoFocus
        className="w-full px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-white placeholder-[#8B949E] focus:outline-none focus:border-[#388BFD] text-sm"
      />

      <div className="flex gap-2">
        <input
          name="category_name"
          type="text"
          placeholder="카테고리 (선택)"
          className="flex-1 px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-white placeholder-[#8B949E] focus:outline-none focus:border-[#388BFD] text-sm"
        />
        <input
          name="activity_date"
          type="date"
          defaultValue={today}
          required
          className="px-3 py-2 bg-[#0D1117] border border-[#30363D] rounded-md text-white focus:outline-none focus:border-[#388BFD] text-sm"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-[#238636] hover:bg-[#2ea043] disabled:opacity-50 text-white rounded-md text-sm font-medium transition-colors"
      >
        {loading ? '저장 중...' : '기록하기'}
      </button>
    </form>
  )
}

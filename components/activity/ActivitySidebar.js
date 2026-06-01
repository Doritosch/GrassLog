'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const IconDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5z"/>
  </svg>
)

const IconGrass = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
    {/* 왼쪽 풀잎 */}
    <path d="M4 14 C4 14 2 10 3 6 C3.5 8 4.5 10 5 14 Z"/>
    {/* 가운데 풀잎 (가장 길게) */}
    <path d="M8 14 C8 14 6 8 8 2 C10 8 8 14 8 14 Z"/>
    {/* 오른쪽 풀잎 */}
    <path d="M12 14 C11.5 10 12.5 8 13 6 C14 10 12 14 12 14 Z"/>
    {/* 땅 라인 */}
    <line x1="1" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const IconChevron = ({ open }) => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"
    style={{ transform: open ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}>
    <path d="M9.78 12.78a.75.75 0 0 1-1.06 0L4.47 8.53a.75.75 0 0 1 0-1.06l4.25-4.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L6.06 8l3.72 3.72a.75.75 0 0 1 0 1.06z"/>
  </svg>
)

export default function ActivitySidebar({ activities, selectedDate, onSelectDate }) {
  const [open, setOpen] = useState(true)
  const pathname = usePathname()

  // 날짜별 활동 수 집계
  const dateCounts = activities.reduce((acc, activity) => {
    const date = activity.activity_date
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const sortedDates = Object.keys(dateCounts).sort((a, b) => b.localeCompare(a))

  const formatDate = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = Math.floor((today - date) / (1000 * 60 * 60 * 24))
    if (diff === 0) return '오늘'
    if (diff === 1) return '어제'
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  const navItems = [
    { href: '/dashboard', label: '활동', Icon: IconDashboard },
    { href: '/grass', label: '잔디', Icon: IconGrass },
  ]

  return (
    <aside
      className="h-screen bg-[#161B22] border-r border-[#30363D] flex flex-col shrink-0 transition-all duration-200"
      style={{ width: open ? '200px' : '52px' }}
    >
      {/* 헤더 + 토글 */}
      <div className="px-3 py-4 border-b border-[#30363D] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* 아이소메트릭 잔디 로고 */}
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
            {/* 아이소메트릭 그리드 — 3×3 셀 */}
            {/* 왼쪽 면 (어두운 초록) */}
            <polygon points="4,18 10,14 10,22 4,26" fill="#0e4429"/>
            <polygon points="10,18 16,14 16,22 10,26" fill="#0e4429"/>
            <polygon points="16,18 22,14 22,22 16,26" fill="#0e4429"/>
            {/* 오른쪽 면 (중간 초록) */}
            <polygon points="10,14 16,10 16,18 10,22" fill="#006d32"/>
            <polygon points="16,14 22,10 22,18 16,22" fill="#006d32"/>
            <polygon points="22,14 28,10 28,18 22,22" fill="#006d32"/>
            {/* 윗면 (밝은 초록) — 높이 다르게 */}
            <polygon points="4,18 10,14 16,18 10,22" fill="#26a641"/>
            <polygon points="10,14 16,10 22,14 16,18" fill="#39d353"/>
            <polygon points="16,10 22,6  28,10 22,14" fill="#39d353"/>
            <polygon points="10,22 16,18 22,22 16,26" fill="#26a641"/>
            <polygon points="16,18 22,14 28,18 22,22" fill="#26a641"/>
            <polygon points="4,26  10,22 16,26 10,30" fill="#006d32"/>
          </svg>
          {open && <h2 className="text-white font-bold text-base">GrassLog</h2>}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 text-[#8B949E] hover:text-white hover:bg-[#21262D] rounded-md transition-colors ml-auto"
        >
          <IconChevron open={open} />
        </button>
      </div>

      {/* 네비게이션 */}
      <div className="px-2 py-3 border-b border-[#30363D] space-y-1">
        {navItems.map(({ href, label, Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-2 py-2 rounded-md transition-colors ${
              pathname === href ? 'bg-[#21262D] text-white' : 'text-[#8B949E] hover:text-white hover:bg-[#21262D]'
            }`}
            title={!open ? label : undefined}
          >
            <Icon />
            {open && <span className="text-sm">{label}</span>}
          </Link>
        ))}
      </div>

      {/* 날짜 목록 */}
      {open && (
        <div className="flex-1 overflow-y-auto py-2 scrollbar-dark border-t border-[#30363D]">
          {sortedDates.length === 0 ? (
            <p className="text-[#8B949E] text-xs px-4 py-3">아직 기록이 없어요.</p>
          ) : (
            sortedDates.map((date) => (
              <button
                key={date}
                onClick={() => onSelectDate(selectedDate === date ? null : date)}
                className={`w-full flex items-center justify-between px-4 py-2 hover:bg-[#21262D] transition-colors ${
                  selectedDate === date ? 'bg-[#21262D]' : ''
                }`}
              >
                <span className={`text-xs font-semibold ${selectedDate === date ? 'text-white' : 'text-[#C9D1D9]'}`}>
                  {formatDate(date)}
                </span>
                <span className="text-[#8B949E] text-[10px] bg-[#0D1117] px-1.5 py-0.5 rounded-full">
                  {dateCounts[date]}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </aside>
  )
}

'use client'

import { useState } from 'react'
import ActivitySidebar from './ActivitySidebar'
import RecentActivityList from './RecentActivityList'
import ActivityForm from './ActivityForm'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const diff = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

function DateHeader({ selectedDate, activities }) {
  const count = activities.filter((a) => a.activity_date === selectedDate).length
  return (
    <div className="flex items-center gap-3 px-6 pt-5 pb-3 shrink-0">
      <span style={{ color: 'var(--text-primary)' }} className="text-base font-bold">{formatDate(selectedDate)}</span>
      {count > 0 && <span style={{ color: 'var(--text-muted)' }} className="text-xs">{count}개</span>}
      <div className="flex-1 h-px" style={{ background: 'var(--bg-elevated)' }} />
    </div>
  )
}

export default function DashboardClient({ activities, categories }) {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)

  return (
    <div className="flex h-screen" style={{ background: 'var(--bg-base)' }}>
      <ActivitySidebar
        activities={activities}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <DateHeader selectedDate={selectedDate} activities={activities} />

        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-dark">
          <RecentActivityList activities={activities} selectedDate={selectedDate} />
        </div>

        <div className="border-t px-6 py-4 shrink-0" style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }}>
          <div className="max-w-2xl mx-auto">
            <ActivityForm categories={categories} />
          </div>
        </div>
      </div>
    </div>
  )
}

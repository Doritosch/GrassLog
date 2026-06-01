'use client'

import { useMain } from '@/components/providers/MainProvider'
import RecentActivityList from './RecentActivityList'
import ActivityForm from './ActivityForm'
import TopBar from '@/components/layout/TopBar'
import MobileDateChips from './MobileDateChips'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const diff = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

export default function DashboardMain() {
  const { activities, categories, selectedDate, email } = useMain()

  return (
    <>
      <TopBar title={formatDate(selectedDate)} email={email} />
      <MobileDateChips />

      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-dark">
        <RecentActivityList activities={activities} selectedDate={selectedDate} />
      </div>

      <div className="border-t border-[#30363D] bg-[#0D1117] px-6 py-4 pb-[calc(1rem+56px)] md:pb-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <ActivityForm categories={categories} />
        </div>
      </div>
    </>
  )
}

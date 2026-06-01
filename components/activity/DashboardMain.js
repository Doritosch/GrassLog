'use client'

import { useMain } from '@/components/providers/MainProvider'
import RecentActivityList from './RecentActivityList'
import ActivityForm from './ActivityForm'
import DateHeader from './DateHeader'

export default function DashboardMain({ email }) {
  const { activities, categories, selectedDate } = useMain()

  return (
    <>
      <div className="px-6 py-4 border-b border-[#30363D] flex items-center justify-between shrink-0">
        <h1 className="text-white font-bold">GrassLog</h1>
        <span className="text-[#8B949E] text-sm">{email}</span>
      </div>

      <DateHeader selectedDate={selectedDate} activities={activities} />

      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-dark">
        <RecentActivityList activities={activities} selectedDate={selectedDate} />
      </div>

      <div className="border-t border-[#30363D] bg-[#0D1117] px-6 py-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <ActivityForm categories={categories} />
        </div>
      </div>
    </>
  )
}

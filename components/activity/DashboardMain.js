'use client'

import { useState } from 'react'
import { useMain } from '@/components/providers/MainProvider'
import { toKSTDateStr } from '@/lib/date/kst'
import RecentActivityList from './RecentActivityList'
import ActivityForm from './ActivityForm'
import TopBar from '@/components/layout/TopBar'
import MobileDateChips from './MobileDateChips'
import OnboardingModal from './OnboardingModal'
import SearchModal from './SearchModal'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayStr = toKSTDateStr()
  const diff = Math.floor((new Date(todayStr) - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return `${date.getMonth() + 1}월 ${date.getDate()}일`
}

export default function DashboardMain() {
  const { activities, categories, selectedDate, setSelectedDate, email, setHighlightId } = useMain()
  const [searchOpen, setSearchOpen] = useState(false)

  const handleSelectActivity = (activity) => {
    setSelectedDate(activity.activity_date)
    setHighlightId(activity.id)
    setSearchOpen(false)
    setTimeout(() => setHighlightId(null), 2000)
  }

  return (
    <>
      <OnboardingModal />
      {searchOpen && (
        <SearchModal
          onClose={() => setSearchOpen(false)}
          onSelectActivity={handleSelectActivity}
        />
      )}
      <TopBar title={formatDate(selectedDate)} email={email} onSearchOpen={() => setSearchOpen(true)} />
      <MobileDateChips />

      <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-dark">
        <RecentActivityList activities={activities} selectedDate={selectedDate} />
      </div>

      <div style={{ borderColor: 'var(--border)', background: 'var(--bg-base)' }} className="border-t px-6 py-4 pb-[calc(1rem+56px)] md:pb-4 shrink-0">
        <div className="max-w-2xl mx-auto">
          <ActivityForm categories={categories} />
        </div>
      </div>
    </>
  )
}

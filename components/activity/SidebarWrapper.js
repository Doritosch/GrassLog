'use client'

import { useMain } from '@/components/providers/MainProvider'
import ActivitySidebar from './ActivitySidebar'

export default function SidebarWrapper() {
  const { activities, selectedDate, setSelectedDate } = useMain()
  return (
    <ActivitySidebar
      activities={activities}
      selectedDate={selectedDate}
      onSelectDate={setSelectedDate}
    />
  )
}

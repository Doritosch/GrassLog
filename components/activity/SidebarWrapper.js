'use client'

import { useMain } from '@/components/providers/MainProvider'
import ActivitySidebar from './ActivitySidebar'
import { useRouter, usePathname } from 'next/navigation'

export default function SidebarWrapper() {
  const { activities, selectedDate, setSelectedDate } = useMain()
  const router = useRouter()
  const pathname = usePathname()

  const handleSelectDate = (date) => {
    setSelectedDate(date)
    if (pathname !== '/dashboard') router.push('/dashboard')
  }

  return (
    <ActivitySidebar
      activities={activities}
      selectedDate={selectedDate}
      onSelectDate={handleSelectDate}
    />
  )
}

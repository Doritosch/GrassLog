'use client'

import { useMain } from '@/components/providers/MainProvider'

function formatChipDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const diff = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export default function MobileDateChips() {
  const { activities, selectedDate, setSelectedDate } = useMain()

  const dateCounts = activities.reduce((acc, a) => {
    acc[a.activity_date] = (acc[a.activity_date] || 0) + 1
    return acc
  }, {})

  const sortedDates = Object.keys(dateCounts).sort((a, b) => b.localeCompare(a))

  if (sortedDates.length === 0) return null

  return (
    <div className="md:hidden flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none border-b border-[#30363D]">
      {sortedDates.map((date) => (
        <button
          key={date}
          onClick={() => setSelectedDate(selectedDate === date ? date : date)}
          className={`flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors ${
            selectedDate === date
              ? 'bg-[#238636] border-[#238636] text-white'
              : 'border-[#30363D] text-[#8B949E]'
          }`}
        >
          {formatChipDate(date)}
          <span className="ml-1 opacity-60">{dateCounts[date]}</span>
        </button>
      ))}
    </div>
  )
}

'use client'

import { useMain } from '@/components/providers/MainProvider'
import { toKSTDateStr } from '@/lib/date/kst'

function formatChipDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayStr = toKSTDateStr()
  const diff = Math.floor((new Date(todayStr) - date) / (1000 * 60 * 60 * 24))
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

  const todayStr = toKSTDateStr()
  if (!dateCounts[todayStr]) dateCounts[todayStr] = 0

  const sortedDates = Object.keys(dateCounts).sort((a, b) => b.localeCompare(a))

  return (
    <div
      className="md:hidden flex gap-2 px-4 py-2 overflow-x-auto scrollbar-none border-b"
      style={{ borderColor: 'var(--border)' }}
    >
      {sortedDates.map((date) => (
        <button
          key={date}
          onClick={() => setSelectedDate(date)}
          className="flex-shrink-0 text-xs px-3 py-1 rounded-full border transition-colors"
          style={
            selectedDate === date
              ? { background: 'var(--accent)', borderColor: 'var(--accent)', color: '#ffffff' }
              : { borderColor: 'var(--border)', color: 'var(--text-muted)' }
          }
        >
          {formatChipDate(date)}
          <span className="ml-1 opacity-60">{dateCounts[date]}</span>
        </button>
      ))}
    </div>
  )
}

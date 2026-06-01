'use client'

function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const diff = Math.floor((todayDate - date) / (1000 * 60 * 60 * 24))
  if (diff === 0) return '오늘'
  if (diff === 1) return '어제'
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}

export default function DateHeader({ selectedDate, activities }) {
  const count = activities.filter((a) => a.activity_date === selectedDate).length
  return (
    <div className="flex items-center gap-3 px-6 pt-5 pb-3 shrink-0">
      <span className="text-white text-base font-bold">{formatDate(selectedDate)}</span>
      {count > 0 && <span className="text-[#8B949E] text-xs">{count}개</span>}
      <div className="flex-1 h-px bg-[#21262D]" />
    </div>
  )
}

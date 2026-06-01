// 오늘 기준 N일의 그리드 생성 (기본 90일)
export function buildHeatmapGrid(endDate = new Date(), days = 90) {
  const end = new Date(endDate)
  end.setHours(0, 0, 0, 0)

  const start = new Date(end)
  start.setDate(start.getDate() - (days - 1))

  // 시작 주의 일요일로 맞춤
  const startSunday = new Date(start)
  startSunday.setDate(startSunday.getDate() - startSunday.getDay())

  const weeks = []
  const cursor = new Date(startSunday)

  while (cursor <= end) {
    const week = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(cursor)
      const dateStr = date.toISOString().split('T')[0]
      const isInRange = date >= start && date <= end
      week.push({ date: dateStr, inRange: isInRange })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push(week)
  }

  return weeks
}

// 활동 수 → 색상 버킷 (0~4)
export function countToBucket(count) {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count <= 3) return 2
  if (count <= 6) return 3
  return 4
}

// 날짜 배열 → { 'YYYY-MM-DD': count } 맵
export function buildCountMap(activities) {
  const map = {}
  for (const activity of activities) {
    const date = activity.activity_date
    map[date] = (map[date] || 0) + 1
  }
  return map
}

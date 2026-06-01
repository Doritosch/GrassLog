import { buildHeatmapGrid, countToBucket, buildCountMap } from '@/lib/date/heatmap-grid'

const BUCKET_COLORS = {
  green:  ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  blue:   ['#161B22', '#0d2b4e', '#0f5fa8', '#1a84d4', '#58c0fb'],
  purple: ['#161B22', '#2d1f5e', '#5a3ea0', '#7e57c2', '#b39ddb'],
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Heatmap({ activities = [], theme = 'green', days = 90 }) {
  const weeks = buildHeatmapGrid(new Date(), days)
  const countMap = buildCountMap(activities)
  const colors = BUCKET_COLORS[theme] || BUCKET_COLORS.green

  // 월 레이블 — 어느 주(row)에 표시할지
  const monthAtWeek = {}
  weeks.forEach((week, wi) => {
    const firstInRange = week.find((d) => d.inRange)
    if (firstInRange) {
      const date = new Date(firstInRange.date)
      if (date.getDate() <= 7) {
        monthAtWeek[wi] = MONTH_LABELS[date.getMonth()]
      }
    }
  })

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 overflow-y-auto h-full">
      <div className="inline-block">
        {/* 요일 헤더 (가로) */}
        <div className="flex mb-1 ml-8" style={{ gap: '2px' }}>
          {DAY_LABELS.map((day) => (
            <div
              key={day}
              className="text-[#8B949E] text-center"
              style={{ width: '12px', fontSize: '8px' }}
            >
              {day[0]}
            </div>
          ))}
        </div>

        {/* 주(row) 목록 — 세로로 쌓임 */}
        <div className="flex flex-col" style={{ gap: '2px' }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex items-center" style={{ gap: '2px' }}>
              {/* 월 레이블 */}
              <div
                className="text-[#8B949E] text-right pr-1 shrink-0"
                style={{ width: '28px', fontSize: '8px' }}
              >
                {monthAtWeek[wi] || ''}
              </div>

              {/* 요일 셀 (일~토 → Mon~Sun 순으로 재정렬) */}
              {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                const cell = week[dayIndex]
                if (!cell) return (
                  <div
                    key={dayIndex}
                    style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'transparent' }}
                  />
                )
                const count = countMap[cell.date] || 0
                const bucket = cell.inRange ? countToBucket(count) : 0
                const color = cell.inRange ? colors[bucket] : '#0D1117'
                return (
                  <div
                    key={dayIndex}
                    title={cell.inRange ? `${cell.date}: ${count}개` : ''}
                    style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: color,
                      borderRadius: '2px',
                      flexShrink: 0,
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="flex items-center gap-1 mt-3 ml-8">
          <span className="text-[#8B949E] text-xs">Less</span>
          {colors.map((color, i) => (
            <div
              key={i}
              style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px' }}
            />
          ))}
          <span className="text-[#8B949E] text-xs">More</span>
        </div>
      </div>
    </div>
  )
}

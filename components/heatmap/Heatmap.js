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
    <div className="border rounded-lg p-4 overflow-y-auto h-full" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
      <div className="inline-block">
        <div className="flex mb-1 ml-8" style={{ gap: '2px' }}>
          {DAY_LABELS.map((day) => (
            <div key={day} style={{ width: '12px', fontSize: '8px', color: 'var(--text-muted)', textAlign: 'center' }}>
              {day[0]}
            </div>
          ))}
        </div>

        <div className="flex flex-col" style={{ gap: '2px' }}>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex items-center" style={{ gap: '2px' }}>
              <div style={{ width: '28px', fontSize: '8px', color: 'var(--text-muted)', textAlign: 'right', paddingRight: '4px', flexShrink: 0 }}>
                {monthAtWeek[wi] || ''}
              </div>
              {[1, 2, 3, 4, 5, 6, 0].map((dayIndex) => {
                const cell = week[dayIndex]
                if (!cell) return <div key={dayIndex} style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: 'transparent' }} />
                const count = countMap[cell.date] || 0
                const bucket = cell.inRange ? countToBucket(count) : 0
                const color = cell.inRange ? colors[bucket] : 'var(--bg-base)'
                return (
                  <div
                    key={dayIndex}
                    title={cell.inRange ? `${cell.date}: ${count}개` : ''}
                    style={{ width: '12px', height: '12px', backgroundColor: color, borderRadius: '2px', flexShrink: 0 }}
                  />
                )
              })}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-1 mt-3 ml-8">
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Less</span>
          {colors.map((color, i) => (
            <div key={i} style={{ width: '10px', height: '10px', backgroundColor: color, borderRadius: '2px' }} />
          ))}
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>More</span>
        </div>
      </div>
    </div>
  )
}

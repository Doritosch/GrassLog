'use client'

import { useState, useRef, useEffect } from 'react'
import { buildHeatmapGrid, countToBucket, buildCountMap } from '@/lib/date/heatmap-grid'

const BUCKET_COLORS = {
  green:  ['#161B22', '#0e4429', '#006d32', '#26a641', '#39d353'],
  blue:   ['#161B22', '#0d2b4e', '#0f5fa8', '#1a84d4', '#58c0fb'],
  purple: ['#161B22', '#2d1f5e', '#5a3ea0', '#7e57c2', '#b39ddb'],
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const BUCKET_THRESHOLDS = ['0', '1', '2-3', '4-6', '7+']

const GAP = 3
const LABEL_COL = 18

export default function HeatmapInteractive({ activities = [], theme = 'green' }) {
  const [tooltip, setTooltip] = useState(null)
  const [selected, setSelected] = useState(null)
  const [cellSize, setCellSize] = useState(14)
  const containerRef = useRef(null)

  const weeks = buildHeatmapGrid(new Date())
  const countMap = buildCountMap(activities)
  const colors = BUCKET_COLORS[theme] || BUCKET_COLORS.green

  useEffect(() => {
    const calc = () => {
      if (!containerRef.current) return
      const available = containerRef.current.clientWidth - 48 - LABEL_COL - GAP
      const numWeeks = weeks.length
      const size = Math.floor((available - GAP * (numWeeks - 1)) / numWeeks)
      setCellSize(Math.max(10, Math.min(size, 24)))
    }
    calc()
    const ro = new ResizeObserver(calc)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [weeks.length])

  const activityMap = activities.reduce((acc, a) => {
    if (!acc[a.activity_date]) acc[a.activity_date] = []
    acc[a.activity_date].push(a)
    return acc
  }, {})

  const totalCount = activities.length

  const streak = (() => {
    let count = 0
    const cursor = new Date()
    while (true) {
      const dateStr = cursor.toISOString().split('T')[0]
      if (!countMap[dateStr]) break
      count++
      cursor.setDate(cursor.getDate() - 1)
    }
    return count
  })()

  const monthLabels = []
  let lastMonth = null
  weeks.forEach((week, wi) => {
    const first = week.find((d) => d.inRange)
    if (first) {
      const m = new Date(first.date).getMonth()
      if (m !== lastMonth) {
        monthLabels.push({ wi, label: MONTH_LABELS[m] })
        lastMonth = m
      }
    }
  })

  const selectedActivities = selected ? (activityMap[selected] || []) : []

  return (
    <div className="space-y-6">
      {/* 요약 지표 */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { value: totalCount, label: '총 활동 수' },
          { value: streak, label: '현재 스트릭 🔥' },
          { value: Object.keys(countMap).length, label: '활동한 날' },
        ].map(({ value, label }) => (
          <div key={label} className="border rounded-lg p-4 text-center" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
            <p style={{ color: 'var(--text-primary)' }} className="text-2xl font-bold">{value}</p>
            <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* 잔디 그래프 */}
      <div ref={containerRef} className="border rounded-lg p-6" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div>
          {/* 월 레이블 행 */}
          <div style={{ display: 'flex', marginLeft: LABEL_COL + GAP, marginBottom: 4 }}>
            {weeks.map((_, wi) => {
              const found = monthLabels.find((m) => m.wi === wi)
              return (
                <div key={wi} style={{ width: cellSize, marginRight: GAP, flexShrink: 0, fontSize: 9, color: 'var(--text-muted)' }}>
                  {found ? found.label : ''}
                </div>
              )
            })}
          </div>

          {/* 요일 행 × 주 열 */}
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div key={dayIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: GAP }}>
              <div style={{ width: LABEL_COL, marginRight: GAP, fontSize: 9, color: 'var(--text-muted)', textAlign: 'right', flexShrink: 0 }}>
                {dayIndex % 2 === 1 ? DAY_LABELS[dayIndex] : ''}
              </div>
              {weeks.map((week, wi) => {
                const cell = week[dayIndex]
                if (!cell) return <div key={wi} style={{ width: cellSize, height: cellSize, marginRight: GAP, flexShrink: 0 }} />
                const count = countMap[cell.date] || 0
                const bucket = cell.inRange ? countToBucket(count) : -1
                const bgColor = bucket >= 0 ? colors[bucket] : 'transparent'
                const isSelected = selected === cell.date
                const isToday = cell.date === new Date().toLocaleDateString('sv-SE')
                return (
                  <div
                    key={wi}
                    style={{
                      width: cellSize, height: cellSize, marginRight: GAP,
                      backgroundColor: bgColor,
                      borderRadius: Math.max(2, cellSize / 5),
                      flexShrink: 0,
                      cursor: cell.inRange ? 'pointer' : 'default',
                      outline: isSelected ? '2px solid #58a6ff' : isToday ? '2px solid #c9d1d9' : 'none',
                      outlineOffset: 1,
                      border: cell.inRange ? '1px solid rgba(255,255,255,0.06)' : 'none',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => {
                      if (!cell.inRange) return
                      setTooltip({ date: cell.date, count, x: e.clientX, y: e.clientY })
                    }}
                    onMouseMove={(e) => {
                      if (tooltip) setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => { if (!cell.inRange) return; setSelected(selected === cell.date ? null : cell.date) }}
                  />
                )
              })}
            </div>
          ))}

          {/* 범례 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, marginLeft: LABEL_COL + GAP }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Less</span>
            {colors.map((color, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 2 }} />
                <span style={{ fontSize: 9, color: 'var(--text-muted)' }}>{BUCKET_THRESHOLDS[i]}</span>
              </div>
            ))}
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>More</span>
          </div>
        </div>
      </div>

      {/* 툴팁 */}
      {tooltip && (
        <div
          className="fixed z-50 border rounded-md px-3 py-2 text-xs shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40, background: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
        >
          <p className="font-medium">{tooltip.date}</p>
          <p style={{ color: 'var(--text-muted)' }}>{tooltip.count > 0 ? `${tooltip.count}개 활동` : '활동 없음'}</p>
        </div>
      )}

      {/* 클릭 팝업 */}
      {selected && (
        <div className="border rounded-lg p-4" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 style={{ color: 'var(--text-primary)' }} className="font-semibold text-sm">{selected} 활동</h3>
            <button onClick={() => setSelected(null)} style={{ color: 'var(--text-muted)' }} className="hover:opacity-80 text-xs">닫기</button>
          </div>
          {selectedActivities.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">이 날 활동이 없어요.</p>
          ) : (
            <ul className="space-y-2">
              {selectedActivities.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39d353] shrink-0" />
                  <span style={{ color: 'var(--text-body)' }} className="text-sm">{a.title}</span>
                  {a.category_name && <span style={{ color: 'var(--text-muted)' }} className="text-xs">· {a.category_name}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

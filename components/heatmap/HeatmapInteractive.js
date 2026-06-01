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
      // 패딩 48px(p-6), 요일 레이블 열
      const available = containerRef.current.clientWidth - 48 - LABEL_COL - GAP
      const numWeeks = weeks.length
      // cell = (available - gaps) / numWeeks
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

  // 월 레이블: 각 주의 첫 번째 inRange 셀 기준, 월이 바뀌는 주 인덱스
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
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <p className="text-white text-2xl font-bold">{totalCount}</p>
          <p className="text-[#8B949E] text-xs mt-1">총 활동 수</p>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <p className="text-white text-2xl font-bold">{streak}</p>
          <p className="text-[#8B949E] text-xs mt-1">현재 스트릭 🔥</p>
        </div>
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4 text-center">
          <p className="text-white text-2xl font-bold">{Object.keys(countMap).length}</p>
          <p className="text-[#8B949E] text-xs mt-1">활동한 날</p>
        </div>
      </div>

      {/* 잔디 그래프 — 가로형 (요일=행, 주=열) */}
      <div ref={containerRef} className="bg-[#161B22] border border-[#30363D] rounded-lg p-6">
        <div>
          {/* 월 레이블 행 */}
          <div style={{ display: 'flex', marginLeft: LABEL_COL + GAP, marginBottom: 4 }}>
            {weeks.map((_, wi) => {
              const found = monthLabels.find((m) => m.wi === wi)
              return (
                <div
                  key={wi}
                  style={{ width: cellSize, marginRight: GAP, flexShrink: 0, fontSize: 9, color: '#8B949E' }}
                >
                  {found ? found.label : ''}
                </div>
              )
            })}
          </div>

          {/* 요일 행 × 주 열 */}
          {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
            <div key={dayIndex} style={{ display: 'flex', alignItems: 'center', marginBottom: GAP }}>
              {/* 요일 레이블 */}
              <div style={{ width: LABEL_COL, marginRight: GAP, fontSize: 9, color: '#8B949E', textAlign: 'right', flexShrink: 0 }}>
                {dayIndex % 2 === 1 ? DAY_LABELS[dayIndex] : ''}
              </div>

              {/* 각 주의 해당 요일 셀 */}
              {weeks.map((week, wi) => {
                const cell = week[dayIndex]
                if (!cell) return (
                  <div key={wi} style={{ width: cellSize, height: cellSize, marginRight: GAP, flexShrink: 0 }} />
                )
                const count = countMap[cell.date] || 0
                const bucket = cell.inRange ? countToBucket(count) : -1
                const bgColor = bucket >= 0 ? colors[bucket] : 'transparent'
                const isSelected = selected === cell.date

                return (
                  <div
                    key={wi}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      marginRight: GAP,
                      backgroundColor: bgColor,
                      borderRadius: Math.max(2, cellSize / 5),
                      flexShrink: 0,
                      cursor: cell.inRange ? 'pointer' : 'default',
                      outline: isSelected ? '2px solid #58a6ff' : 'none',
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
                    onClick={() => {
                      if (!cell.inRange) return
                      setSelected(selected === cell.date ? null : cell.date)
                    }}
                  />
                )
              })}
            </div>
          ))}

          {/* 범례 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, marginLeft: LABEL_COL + GAP }}>
            <span style={{ fontSize: 11, color: '#8B949E' }}>Less</span>
            {colors.map((color, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <div style={{ width: 12, height: 12, backgroundColor: color, borderRadius: 2 }} />
                <span style={{ fontSize: 9, color: '#8B949E' }}>{BUCKET_THRESHOLDS[i]}</span>
              </div>
            ))}
            <span style={{ fontSize: 11, color: '#8B949E' }}>More</span>
          </div>
        </div>
      </div>

      {/* 툴팁 */}
      {tooltip && (
        <div
          className="fixed z-50 bg-[#1C2128] border border-[#30363D] rounded-md px-3 py-2 text-xs text-white shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 40 }}
        >
          <p className="font-medium">{tooltip.date}</p>
          <p className="text-[#8B949E]">{tooltip.count > 0 ? `${tooltip.count}개 활동` : '활동 없음'}</p>
        </div>
      )}

      {/* 클릭 팝업 */}
      {selected && (
        <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">{selected} 활동</h3>
            <button onClick={() => setSelected(null)} className="text-[#8B949E] hover:text-white text-xs">
              닫기
            </button>
          </div>
          {selectedActivities.length === 0 ? (
            <p className="text-[#8B949E] text-sm">이 날 활동이 없어요.</p>
          ) : (
            <ul className="space-y-2">
              {selectedActivities.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#39d353] shrink-0" />
                  <span className="text-[#C9D1D9] text-sm">{a.title}</span>
                  {a.category_name && (
                    <span className="text-xs text-[#8B949E]">· {a.category_name}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

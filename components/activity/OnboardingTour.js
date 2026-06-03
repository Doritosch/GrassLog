'use client'

import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'grasslog_onboarding_v2'

const DESKTOP_STEPS = [
  { target: 'tour-input',         title: '활동 기록',   desc: '오늘 한 일을 여기에 입력하세요. Enter로 바로 저장돼요.', position: 'top' },
  { target: 'tour-image',         title: '이미지 첨부', desc: '이미지를 최대 5장까지 첨부할 수 있어요. 드래그 앤 드롭도 돼요.', position: 'top' },
  { target: 'tour-category',      title: '카테고리',    desc: '운동, 독서 등 나만의 카테고리로 활동을 분류해요.', position: 'top' },
  { target: 'tour-sidebar-dates', title: '날짜 목록',   desc: '날짜를 클릭하면 그날의 기록만 볼 수 있어요.', position: 'right' },
  { target: 'tour-nav-grass',     title: '잔디 탭',     desc: '연간 활동을 GitHub 잔디 스타일로 한눈에 확인해요.', position: 'right' },
]

const MOBILE_STEPS = [
  { target: 'tour-input',        title: '활동 기록',   desc: '오늘 한 일을 여기에 입력하세요. Enter로 바로 저장돼요.', position: 'top' },
  { target: 'tour-image',        title: '이미지 첨부', desc: '이미지를 최대 5장까지 첨부할 수 있어요.', position: 'top' },
  { target: 'tour-category',     title: '카테고리',    desc: '나만의 카테고리로 활동을 분류해요.', position: 'top' },
  { target: 'tour-date-chips',   title: '날짜 필터',   desc: '날짜 칩을 탭하면 그날의 기록을 볼 수 있어요.', position: 'bottom' },
  { target: 'tour-tab-grass',    title: '잔디 탭',     desc: '연간 활동을 GitHub 잔디 스타일로 한눈에 확인해요.', position: 'top' },
]

function isMobile() {
  return window.innerWidth < 768
}

function getTargetRect(id) {
  const el = document.querySelector(`[data-tour="${id}"]`)
  if (!el) return null
  return el.getBoundingClientRect()
}

export default function OnboardingTour() {
  const [step, setStep] = useState(-1)
  const [tooltipStyle, setTooltipStyle] = useState({})
  const [arrowStyle, setArrowStyle] = useState({})
  const [visible, setVisible] = useState(false)
  const [mobile, setMobile] = useState(false)
  const tooltipRef = useRef(null)

  useEffect(() => {
    setMobile(isMobile())
    if (localStorage.getItem(STORAGE_KEY) !== 'true') setVisible(true)
  }, [])

  const STEPS = mobile ? MOBILE_STEPS : DESKTOP_STEPS

  useEffect(() => {
    if (!visible || step < 0) return
    const current = STEPS[step]
    if (!current) return

    const updatePos = () => {
      const rect = getTargetRect(current.target)
      const tip = tooltipRef.current
      if (!tip) return

      const tipW = tip.offsetWidth || 280
      const tipH = tip.offsetHeight || 120
      const gap = 12
      const aw = 10

      let top, left, arrowTop, arrowLeft, arrowDir

      if (!rect) {
        // 타겟 못 찾으면 중앙에 표시
        top = window.innerHeight / 2 - tipH / 2
        left = window.innerWidth / 2 - tipW / 2
        arrowDir = null
      } else if (current.position === 'top') {
        top = rect.top - tipH - gap
        left = rect.left + rect.width / 2 - tipW / 2
        arrowTop = tipH
        arrowLeft = tipW / 2 - aw
        arrowDir = 'down'
        if (top < 8) {
          top = rect.bottom + gap
          arrowTop = -aw * 2
          arrowDir = 'up'
        }
      } else if (current.position === 'bottom') {
        top = rect.bottom + gap
        left = rect.left + rect.width / 2 - tipW / 2
        arrowTop = -aw * 2
        arrowLeft = tipW / 2 - aw
        arrowDir = 'up'
      } else {
        top = rect.top + rect.height / 2 - tipH / 2
        left = rect.right + gap
        arrowTop = tipH / 2 - aw
        arrowLeft = -aw * 2
        arrowDir = 'left'
        if (left + tipW > window.innerWidth - 8) {
          left = rect.left - tipW - gap
          arrowLeft = tipW
          arrowDir = 'right'
        }
      }

      left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8))
      top = Math.max(8, Math.min(top, window.innerHeight - tipH - 8))

      setTooltipStyle({ top: `${top}px`, left: `${left}px` })
      setArrowStyle({ top: arrowTop != null ? `${arrowTop}px` : undefined, left: arrowLeft != null ? `${arrowLeft}px` : undefined, dir: arrowDir })
    }

    updatePos()
    window.addEventListener('resize', updatePos)
    return () => window.removeEventListener('resize', updatePos)
  }, [step, visible, mobile])

  const finish = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else finish()
  }

  const prev = () => { if (step > 0) setStep(s => s - 1) }

  if (!visible) return null

  if (step === -1) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="border rounded-2xl w-full max-w-sm shadow-2xl p-6 space-y-5" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <polygon points="4,18 10,14 10,22 4,26" fill="#0e4429"/>
              <polygon points="10,18 16,14 16,22 10,26" fill="#0e4429"/>
              <polygon points="16,18 22,14 22,22 16,26" fill="#0e4429"/>
              <polygon points="10,14 16,10 16,18 10,22" fill="#006d32"/>
              <polygon points="16,14 22,10 22,18 16,22" fill="#006d32"/>
              <polygon points="22,14 28,10 28,18 22,22" fill="#006d32"/>
              <polygon points="4,18 10,14 16,18 10,22" fill="#26a641"/>
              <polygon points="10,14 16,10 22,14 16,18" fill="#39d353"/>
              <polygon points="16,10 22,6 28,10 22,14" fill="#39d353"/>
              <polygon points="10,22 16,18 22,22 16,26" fill="#26a641"/>
              <polygon points="16,18 22,14 28,18 22,22" fill="#26a641"/>
              <polygon points="4,26 10,22 16,26 10,30" fill="#006d32"/>
            </svg>
            <div>
              <h2 style={{ color: 'var(--text-primary)' }} className="font-bold text-lg leading-tight">GrassLog에 오신 것을 환영해요</h2>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">30초 투어로 주요 기능을 알아볼까요?</p>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={finish} style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }} className="px-3 py-1.5 text-sm border rounded-lg hover:opacity-80 cursor-pointer">건너뛰기</button>
            <button onClick={() => setStep(0)} style={{ background: 'var(--accent)' }} className="px-4 py-1.5 text-sm text-white rounded-lg hover:opacity-90 cursor-pointer">투어 시작</button>
          </div>
        </div>
      </div>
    )
  }

  const current = STEPS[step]
  const arrowDir = arrowStyle.dir

  const arrowBorder = {
    up:    'border-b-[10px] border-b-[var(--bg-elevated)] border-x-[10px] border-x-transparent',
    down:  'border-t-[10px] border-t-[var(--bg-elevated)] border-x-[10px] border-x-transparent',
    left:  'border-r-[10px] border-r-[var(--bg-elevated)] border-y-[10px] border-y-transparent',
    right: 'border-l-[10px] border-l-[var(--bg-elevated)] border-y-[10px] border-y-transparent',
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={finish} />
      <TargetHighlight targetId={current.target} />
      <div
        ref={tooltipRef}
        className="fixed z-50 w-72 rounded-xl shadow-2xl p-4 space-y-3"
        style={{ ...tooltipStyle, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      >
        {arrowDir && (
          <div
            className={`absolute w-0 h-0 ${arrowBorder[arrowDir]}`}
            style={{ top: arrowStyle.top, left: arrowStyle.left }}
          />
        )}
        <div>
          <p style={{ color: 'var(--text-primary)' }} className="text-sm font-semibold">{current.title}</p>
          <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-1 leading-relaxed">{current.desc}</p>
        </div>
        <div className="flex items-center justify-between">
          <span style={{ color: 'var(--text-muted)' }} className="text-xs">{step + 1} / {STEPS.length}</span>
          <div className="flex gap-2">
            {step > 0 && (
              <button onClick={prev} style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }} className="px-3 py-1 text-xs border rounded-lg hover:opacity-80 cursor-pointer">이전</button>
            )}
            <button onClick={next} style={{ background: 'var(--accent)' }} className="px-3 py-1 text-xs text-white rounded-lg hover:opacity-90 cursor-pointer">
              {step === STEPS.length - 1 ? '완료' : '다음'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function TargetHighlight({ targetId }) {
  const [rect, setRect] = useState(null)

  useEffect(() => {
    const update = () => {
      const el = document.querySelector(`[data-tour="${targetId}"]`)
      if (el) setRect(el.getBoundingClientRect())
      else setRect(null)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [targetId])

  if (!rect) return null

  const pad = 6
  return (
    <div
      className="fixed z-50 rounded-lg pointer-events-none"
      style={{
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5), 0 0 0 2px #39d353',
      }}
    />
  )
}

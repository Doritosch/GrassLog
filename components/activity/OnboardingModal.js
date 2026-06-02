'use client'

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'grasslog_onboarding_hidden'

export default function OnboardingModal() {
  const [visible, setVisible] = useState(false)
  const [dontShow, setDontShow] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== 'true') {
      setVisible(true)
    }
  }, [])

  const handleClose = () => {
    if (dontShow) localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="border rounded-2xl w-full max-w-md shadow-2xl" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        {/* 헤더 */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <polygon points="4,18 10,14 10,22 4,26" fill="#0e4429"/>
            <polygon points="10,18 16,14 16,22 10,26" fill="#0e4429"/>
            <polygon points="16,18 22,14 22,22 16,26" fill="#0e4429"/>
            <polygon points="10,14 16,10 16,18 10,22" fill="#006d32"/>
            <polygon points="16,14 22,10 22,18 16,22" fill="#006d32"/>
            <polygon points="22,14 28,10 28,18 22,22" fill="#006d32"/>
            <polygon points="4,18 10,14 16,18 10,22" fill="#26a641"/>
            <polygon points="10,14 16,10 22,14 16,18" fill="#39d353"/>
            <polygon points="16,10 22,6  28,10 22,14" fill="#39d353"/>
            <polygon points="10,22 16,18 22,22 16,26" fill="#26a641"/>
            <polygon points="16,18 22,14 28,18 22,22" fill="#26a641"/>
            <polygon points="4,26  10,22 16,26 10,30" fill="#006d32"/>
          </svg>
          <div>
            <h2 style={{ color: 'var(--text-primary)' }} className="font-bold text-lg leading-tight">GrassLog에 오신 것을 환영해요</h2>
            <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">일상을 잔디로 기록하세요</p>
          </div>
        </div>

        {/* 기능 설명 */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex gap-3">
            <span className="text-xl">📝</span>
            <div>
              <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">활동 기록</p>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">오늘 한 일을 텍스트, 카테고리, 이미지로 기록해요.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🌱</span>
            <div>
              <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">잔디 그래프</p>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">GitHub처럼 연간 활동을 한눈에 확인할 수 있어요.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-xl">🏷️</span>
            <div>
              <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium">카테고리</p>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">운동, 독서, 공부 등 나만의 카테고리를 만들어 분류해요.</p>
            </div>
          </div>
        </div>

        {/* 하단 */}
        <div className="px-6 pb-6 flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShow}
              onChange={(e) => setDontShow(e.target.checked)}
              className="w-3.5 h-3.5 accent-[#238636]"
            />
            <span style={{ color: 'var(--text-muted)' }} className="text-xs">다시 보지 않기</span>
          </label>
          <button
            onClick={handleClose}
            style={{ background: 'var(--accent)' }}
            className="px-4 py-1.5 hover:opacity-90 text-white rounded-lg text-sm font-medium transition-opacity"
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  )
}

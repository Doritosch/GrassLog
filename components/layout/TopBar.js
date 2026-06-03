'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/components/providers/ThemeProvider'

const IconSun = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
  </svg>
)

const IconMoon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278"/>
  </svg>
)

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
  </svg>
)

const IconLogout = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
  </svg>
)

export default function TopBar({ title, email, onSearchOpen }) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ borderColor: 'var(--border)' }} className="px-4 md:px-6 py-3 md:py-4 border-b flex items-center justify-between shrink-0">
      <h1 style={{ color: 'var(--text-primary)' }} className="font-bold">{title}</h1>
      <div className="flex items-center gap-2">
        <span style={{ color: 'var(--text-muted)' }} className="text-sm hidden md:block mr-1">{email}</span>

        {onSearchOpen && (
          <button
            onClick={onSearchOpen}
            style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
            className="hover:opacity-80 border px-2 py-1.5 rounded-md transition-opacity flex items-center gap-1 cursor-pointer"
            title="검색"
          >
            <IconSearch />
            <span className="hidden md:inline text-xs">검색</span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
          className="hover:opacity-80 border px-2 py-1.5 rounded-md transition-opacity flex items-center gap-1 cursor-pointer"
          title={theme === 'dark' ? '라이트 모드' : '다크 모드'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>

        <button
          onClick={handleLogout}
          style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
          className="hover:opacity-80 border px-2 py-1.5 rounded-md transition-opacity flex items-center gap-1 cursor-pointer"
          title="로그아웃"
        >
          <IconLogout />
          <span className="hidden md:inline text-xs">로그아웃</span>
        </button>
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const IconDashboard = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3A1.5 1.5 0 0 1 15 10.5v3A1.5 1.5 0 0 1 13.5 15h-3A1.5 1.5 0 0 1 9 13.5z"/>
  </svg>
)

const IconGrass = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path d="M4 14 C4 14 2 10 3 6 C3.5 8 4.5 10 5 14 Z"/>
    <path d="M8 14 C8 14 6 8 8 2 C10 8 8 14 8 14 Z"/>
    <path d="M12 14 C11.5 10 12.5 8 13 6 C14 10 12 14 12 14 Z"/>
    <line x1="1" y1="14" x2="15" y2="14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

const tabs = [
  { href: '/dashboard', label: '활동', Icon: IconDashboard },
  { href: '/grass', label: '잔디', Icon: IconGrass },
]

export default function MobileTabBar() {
  const pathname = usePathname()

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 border-t flex z-50"
      style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)' }}
    >
      {tabs.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-opacity"
          style={{ color: pathname === href ? 'var(--text-primary)' : 'var(--text-muted)' }}
        >
          <Icon />
          <span className="text-[10px]">{label}</span>
        </Link>
      ))}
    </div>
  )
}

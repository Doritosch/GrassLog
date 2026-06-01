'use client'

import { useMain } from '@/components/providers/MainProvider'
import HeatmapInteractive from './HeatmapInteractive'

export default function GrassMain({ email }) {
  const { activities } = useMain()

  return (
    <>
      <div className="px-6 py-4 border-b border-[#30363D] flex items-center justify-between shrink-0">
        <h1 className="text-white font-bold">잔디 그래프</h1>
        <span className="text-[#8B949E] text-sm">{email}</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-dark">
        <HeatmapInteractive activities={activities} theme="green" />
      </div>
    </>
  )
}

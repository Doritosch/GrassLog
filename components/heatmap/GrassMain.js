'use client'

import { useMain } from '@/components/providers/MainProvider'
import HeatmapInteractive from './HeatmapInteractive'
import TopBar from '@/components/layout/TopBar'

export default function GrassMain() {
  const { activities, email } = useMain()

  return (
    <>
      <TopBar title="잔디 그래프" email={email} />

      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-6 pb-[calc(1.5rem+56px)] md:pb-6 scrollbar-dark">
        <HeatmapInteractive activities={activities} theme="green" />
      </div>
    </>
  )
}

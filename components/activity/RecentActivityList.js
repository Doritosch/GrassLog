'use client'

import { deleteActivity } from '@/app/dashboard/actions'

export default function RecentActivityList({ activities }) {
  if (activities.length === 0) {
    return (
      <div className="bg-[#161B22] border border-[#30363D] rounded-lg p-6 text-center">
        <p className="text-[#8B949E] text-sm">아직 기록된 활동이 없어요.</p>
        <p className="text-[#8B949E] text-sm mt-1">첫 번째 활동을 기록해보세요!</p>
      </div>
    )
  }

  return (
    <div className="bg-[#161B22] border border-[#30363D] rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-[#30363D]">
        <h2 className="text-white font-semibold text-sm">최근 활동</h2>
      </div>
      <ul className="divide-y divide-[#30363D]">
        {activities.map((activity) => (
          <li key={activity.id} className="px-4 py-3 flex items-center justify-between group">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-2 h-2 rounded-sm bg-[#39d353] flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-white text-sm truncate">{activity.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  {activity.category_name && (
                    <span className="text-xs text-[#8B949E] bg-[#21262D] px-1.5 py-0.5 rounded">
                      {activity.category_name}
                    </span>
                  )}
                  <span className="text-xs text-[#8B949E]">{activity.activity_date}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => deleteActivity(activity.id)}
              className="text-[#8B949E] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all text-xs ml-2 flex-shrink-0"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

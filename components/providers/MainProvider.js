'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { toKSTDateStr } from '@/lib/date/kst'

const MainContext = createContext(null)

export function useMain() {
  return useContext(MainContext)
}

export default function MainProvider({ children, activities, categories, email }) {
  const [selectedDate, setSelectedDate] = useState(toKSTDateStr)
  const [highlightId, setHighlightId] = useState(null)
  const [editingActivity, setEditingActivity] = useState(null)
  const [editedIds, setEditedIds] = useState(new Set())

  const markEdited = (id) => setEditedIds(prev => new Set(prev).add(id))

  useEffect(() => {
    let lastDate = toKSTDateStr()
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const today = toKSTDateStr()
        if (today !== lastDate) {
          lastDate = today
          setSelectedDate(today)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  return (
    <MainContext.Provider value={{ activities, categories, selectedDate, setSelectedDate, email, highlightId, setHighlightId, editingActivity, setEditingActivity, editedIds, markEdited }}>
      {children}
    </MainContext.Provider>
  )
}

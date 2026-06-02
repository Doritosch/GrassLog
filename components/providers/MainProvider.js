'use client'

import { createContext, useContext, useState } from 'react'

const MainContext = createContext(null)

export function useMain() {
  return useContext(MainContext)
}

export default function MainProvider({ children, activities, categories, email }) {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)
  const [highlightId, setHighlightId] = useState(null)

  return (
    <MainContext.Provider value={{ activities, categories, selectedDate, setSelectedDate, email, highlightId, setHighlightId }}>
      {children}
    </MainContext.Provider>
  )
}

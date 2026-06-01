'use client'

import { createContext, useContext, useState } from 'react'

const MainContext = createContext(null)

export function useMain() {
  return useContext(MainContext)
}

export default function MainProvider({ children, activities, categories }) {
  const today = new Date().toISOString().split('T')[0]
  const [selectedDate, setSelectedDate] = useState(today)

  return (
    <MainContext.Provider value={{ activities, categories, selectedDate, setSelectedDate }}>
      {children}
    </MainContext.Provider>
  )
}

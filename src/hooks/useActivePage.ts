"use client"

import { useState } from "react"
import type { NavPage } from "@/lib/types"

export const useActivePage = (initial: NavPage = "about") => {
  const [activePage, setActivePageState] = useState<NavPage>(initial)

  const setActivePage = (page: NavPage) => {
    setActivePageState(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return { activePage, setActivePage }
}

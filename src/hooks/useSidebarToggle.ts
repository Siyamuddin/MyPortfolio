"use client"

import { useState } from "react"

export const useSidebarToggle = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => {
    setIsExpanded((prev) => !prev)
  }

  return {
    isExpanded,
    handleToggle,
    label: isExpanded ? "Hide Contacts" : "Show Contacts",
  }
}

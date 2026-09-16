"use client"

import { useEffect, useState } from "react"

export const useEnhancedVisuals = () => {
  const [enabled, setEnabled] = useState(false)
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)")
    const update = () => setEnabled(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])
  return enabled
}

"use client"

import { useEffect, useState } from "react"

/**
 * 2px gold reading progress. Uses CSS scroll-driven animation where supported,
 * and a scroll listener otherwise. Reduced motion keeps a static full-width bar
 * so the affordance remains without a moving indicator.
 */
export const ReadingProgress = () => {
  const [fallback, setFallback] = useState<number | null>(null)

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const supported =
      typeof CSS !== "undefined" &&
      CSS.supports("animation-timeline", "scroll()")
    if (reduce || supported) return

    const update = () => {
      const article = document.querySelector("[data-reading-root]")
      if (!article) return
      const rect = article.getBoundingClientRect()
      const total = article.scrollHeight - window.innerHeight
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1))
      setFallback(total <= 0 ? 1 : scrolled / total)
    }
    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [])

  return (
    <div
      className="reading-progress"
      style={fallback === null ? undefined : { transform: `scaleX(${fallback})` }}
      aria-hidden="true"
    />
  )
}

"use client"

import { useEffect, useRef, useState } from "react"

type CountUpProps = {
  value: number
  pad?: number
  duration?: number
}

/**
 * Counts from 0 to `value` once, using tabular-nums. Reduced-motion users
 * see the final value immediately.
 */
export const CountUp = ({ value, pad = 2, duration = 600 }: CountUpProps) => {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce || value <= 0) {
      setDisplay(value)
      return
    }

    const start = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [duration, value])

  return (
    <span className="tabular-nums">
      {String(display).padStart(pad, "0")}
    </span>
  )
}

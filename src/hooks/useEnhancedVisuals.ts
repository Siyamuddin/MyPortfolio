"use client"

import { useEffect, useState } from "react"

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: () => void,
    options?: { timeout: number }
  ) => number
  cancelIdleCallback?: (handle: number) => void
}

/**
 * Enables the Three.js enhanced visuals only on wider viewports without a
 * reduced-motion preference, and defers enabling until the browser is idle so
 * the heavy WebGL chunk never blocks hydration or first paint.
 */
export const useEnhancedVisuals = () => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)"
    )
    const idleWindow = window as IdleWindow
    let idleHandle: number | undefined
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined

    const clearScheduled = () => {
      if (idleHandle !== undefined && idleWindow.cancelIdleCallback) {
        idleWindow.cancelIdleCallback(idleHandle)
        idleHandle = undefined
      }
      if (timeoutHandle !== undefined) {
        clearTimeout(timeoutHandle)
        timeoutHandle = undefined
      }
    }

    const update = () => {
      clearScheduled()
      if (!media.matches) {
        setEnabled(false)
        return
      }
      if (idleWindow.requestIdleCallback) {
        idleHandle = idleWindow.requestIdleCallback(() => setEnabled(true), {
          timeout: 2000,
        })
        return
      }
      timeoutHandle = setTimeout(() => setEnabled(true), 200)
    }

    update()
    media.addEventListener("change", update)
    return () => {
      clearScheduled()
      media.removeEventListener("change", update)
    }
  }, [])

  return enabled
}

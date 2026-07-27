"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export const AnalyticsBeacon = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    const controller = new AbortController()

    const send = () => {
      void fetch("/api/analytics/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
        signal: controller.signal,
      }).catch(() => {
        // Soft-fail: analytics must never break the page
      })
    }

    send()

    return () => {
      controller.abort()
    }
  }, [pathname])

  return null
}

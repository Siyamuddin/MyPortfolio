"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export const AnalyticsBeacon = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (!pathname) return

    void fetch("/api/analytics/collect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Soft-fail: analytics must never break the page
    })
  }, [pathname])

  return null
}

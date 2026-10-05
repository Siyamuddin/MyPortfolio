"use client"

import { useCallback, useRef } from "react"

/**
 * Returns a stable callback ref that reveals an element once it scrolls into
 * view by toggling the `is-visible` class (styled in globals.css). The element
 * must carry the `data-reveal` attribute for the base hidden state to apply.
 *
 * Respects `prefers-reduced-motion` and browsers without IntersectionObserver by
 * revealing immediately, so content is never left hidden.
 */
export const useRevealOnScroll = () => {
  const observerRef = useRef<IntersectionObserver | null>(null)

  return useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
      observerRef.current = null
    }

    if (!node || typeof window === "undefined") return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      node.classList.add("is-visible")
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible")
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15, rootMargin: "0px 0px -4% 0px" }
    )

    observer.observe(node)
    observerRef.current = observer
  }, [])
}

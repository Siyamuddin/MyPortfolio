"use client"

import { createElement } from "react"
import type { CSSProperties, ElementType, ReactNode } from "react"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"

type RevealProps = {
  children: ReactNode
  /** Render as a different element (e.g. "li", "section"). Defaults to "div". */
  as?: ElementType
  /** Stagger delay in milliseconds. */
  delay?: number
  className?: string
}

/**
 * Wraps content so it fades + rises into view once, the first time it is
 * scrolled into the viewport. Reduced-motion and no-JS users see the final
 * state immediately (handled in globals.css).
 */
export const Reveal = ({
  children,
  as = "div",
  delay = 0,
  className,
}: RevealProps) => {
  const ref = useRevealOnScroll()
  const style = delay
    ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties)
    : undefined

  return createElement(
    as,
    { ref, "data-reveal": true, className, style },
    children
  )
}

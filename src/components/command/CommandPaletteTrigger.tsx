"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/cn"
import { useCommandPalette } from "@/components/command/CommandPalette"

/**
 * Opens the command palette. Renders either a labelled ⌘K chip (desktop nav) or
 * a compact icon button (mobile header).
 */
export const CommandPaletteTrigger = ({
  variant = "chip",
  className,
}: {
  variant?: "chip" | "icon"
  className?: string
}) => {
  const { open } = useCommandPalette()
  const [modifier, setModifier] = useState("Ctrl")

  useEffect(() => {
    const isApple = /Mac|iPhone|iPad|iPod/i.test(window.navigator.platform)
    setModifier(isApple ? "⌘" : "Ctrl")
  }, [])

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Open command palette"
        aria-keyshortcuts="Meta+K Control+K"
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-jet bg-onyx text-light-gray transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
          className
        )}
      >
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open command palette"
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg border border-jet bg-onyx/60 px-2.5 py-1.5 text-light-gray-70 transition-colors hover:border-gold/40 hover:text-light-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
        className
      )}
    >
      <Search className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="text-xs">Search</span>
      <kbd className="rounded border border-jet bg-eerie-black-1 px-1 py-0.5 font-mono text-[10px] text-light-gray-70 transition-colors group-hover:text-gold">
        {modifier} K
      </kbd>
    </button>
  )
}

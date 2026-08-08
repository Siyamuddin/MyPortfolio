"use client"

import type { KeyboardEvent } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/cn"

type ErrorStateProps = {
  message?: string
  onRetry: () => void
  className?: string
}

export const ErrorState = ({
  message = "Something went wrong while loading data.",
  onRetry,
  className,
}: ErrorStateProps) => {
  const handleRetry = () => {
    onRetry()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onRetry()
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-xl border border-red-400/30 bg-red-400/5 px-6 py-12 text-center",
        className
      )}
      role="alert"
    >
      <div
        className="flex size-11 items-center justify-center rounded-2xl bg-red-400/15 text-red-400"
        aria-hidden="true"
      >
        <AlertCircle className="size-5" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-white-2">Could not load</p>
        <p className="max-w-sm text-sm text-light-gray-70">{message}</p>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handleRetry}
        onKeyDown={handleKeyDown}
        aria-label="Retry loading data"
        tabIndex={0}
      >
        <RefreshCw className="size-4" aria-hidden="true" />
        Retry
      </Button>
    </div>
  )
}

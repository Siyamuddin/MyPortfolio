"use client"

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/Button"

type DialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactNode
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export const Dialog = ({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  className,
}: DialogProps) => {
  const titleId = useId()
  const descriptionId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onOpenChange])

  const handleBackdropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onOpenChange(false)
    }
  }

  return (
    <>
      {trigger}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
          <div
            className="absolute inset-0 bg-smoky-black/70 backdrop-blur-sm"
            role="button"
            tabIndex={0}
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
            onKeyDown={handleBackdropKeyDown}
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            className={cn(
              "relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-xl border border-jet bg-eerie-black-2 p-5 shadow-[var(--shadow-2)] sm:max-w-lg",
              className
            )}
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-1">
                <h2 id={titleId} className="text-lg font-medium text-white-2">
                  {title}
                </h2>
                {description ? (
                  <p id={descriptionId} className="text-sm text-light-gray-70">
                    {description}
                  </p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                aria-label="Close"
                tabIndex={0}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
            {children}
          </div>
        </div>
      ) : null}
    </>
  )
}

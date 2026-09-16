"use client"

import { useEffect, useId, useRef, type ReactNode } from "react"
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

export const Dialog = ({ open, onOpenChange, trigger, title, description, children, className }: DialogProps) => {
  const titleId = useId()
  const descriptionId = useId()
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!open) { dialog.close(); return }
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [open])

  return <>
    {trigger}
    <dialog ref={dialogRef} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => { event.preventDefault(); onOpenChange(false) }}
      onClick={(event) => { if (event.target === event.currentTarget) onOpenChange(false) }}
      className="fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none items-end justify-center border-0 bg-transparent p-4 text-white-2 open:flex backdrop:bg-smoky-black/70 backdrop:backdrop-blur-sm sm:items-center">
      <div className={cn("relative max-h-[90dvh] w-full overflow-y-auto rounded-xl border border-jet bg-eerie-black-2 p-5 shadow-[var(--shadow-2)] sm:max-w-lg", className)}>
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <h2 id={titleId} className="text-lg font-medium text-white-2">{title}</h2>
            {description ? <p id={descriptionId} className="text-sm text-light-gray-70">{description}</p> : null}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={() => onOpenChange(false)} aria-label="Close"><X className="size-4" aria-hidden="true" /></Button>
        </div>
        {open ? children : null}
      </div>
    </dialog>
  </>
}

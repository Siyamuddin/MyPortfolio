"use client"

import { useEffect, useRef } from "react"

export const useModalDialog = (restoreFocusId?: string) => {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = "hidden"
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      const focusTarget = previousFocus?.isConnected
        ? previousFocus
        : restoreFocusId
          ? document.getElementById(restoreFocusId)
          : null
      focusTarget?.focus({ preventScroll: true })
    }
  }, [restoreFocusId])

  return ref
}

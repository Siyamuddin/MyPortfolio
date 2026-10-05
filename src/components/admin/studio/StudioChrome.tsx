"use client"

import { useRef, useState, type ReactNode } from "react"
import { Check, Plus, Trash2 } from "lucide-react"
import { useModalDialog } from "@/components/admin/studio/useModalDialog"
import styles from "./AdminStudio.module.css"

export type StudioFilterOption<T extends string> = {
  value: T
  label: string
  count: number
}

export const StudioFilter = <T extends string>({
  label,
  value,
  onChange,
  options,
  summary,
}: {
  label: string
  value: T
  onChange: (value: T) => void
  options: StudioFilterOption<T>[]
  summary: string
}) => (
  <div className={styles.toolbar}>
    <div className={styles.segmentedControl} role="group" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
          <span>{option.count}</span>
        </button>
      ))}
    </div>
    <p className={styles.muted}>{summary}</p>
  </div>
)

export const StudioNotice = ({ children }: { children: ReactNode }) => (
  <p className={styles.notice} role="status">
    <Check size={17} aria-hidden="true" />
    {children}
  </p>
)

export const StudioEmpty = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: ReactNode
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <button type="button" className={styles.primaryButton} onClick={onAction}>
      <Plus size={17} aria-hidden="true" />
      {actionLabel}
    </button>
  </div>
)

export const DeleteConfirmDialog = ({
  titleId,
  descriptionId,
  title,
  description,
  cancelLabel,
  confirmLabel,
  pendingLabel = "Deleting…",
  restoreFocusId,
  fallbackError,
  networkError,
  onClose,
  onDeleted,
  onConfirm,
}: {
  titleId: string
  descriptionId: string
  title: string
  description: string
  cancelLabel: string
  confirmLabel: string
  pendingLabel?: string
  restoreFocusId?: string
  fallbackError: string
  networkError: string
  onClose: () => void
  onDeleted: () => void
  onConfirm: () => Promise<{ ok: boolean; error?: string }>
}) => {
  const ref = useModalDialog(restoreFocusId)
  const busyRef = useRef(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")

  const handleConfirm = async () => {
    if (busyRef.current) return
    busyRef.current = true
    setPending(true)
    setError("")
    try {
      const result = await onConfirm()
      if (result.ok) {
        onDeleted()
        return
      }
      setError(result.error || fallbackError)
    } catch {
      setError(networkError)
    } finally {
      busyRef.current = false
      setPending(false)
    }
  }

  return (
    <dialog
      ref={ref}
      className={`${styles.dialog} ${styles.deleteDialog}`}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault()
        if (!busyRef.current) onClose()
      }}
    >
      <div className={styles.deleteIcon}>
        <Trash2 size={24} aria-hidden="true" />
      </div>
      <h2 id={titleId}>{title}</h2>
      <p id={descriptionId}>{description}</p>
      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}
      <div className={styles.deleteActions}>
        <button type="button" autoFocus className={styles.secondaryButton} disabled={pending} onClick={onClose}>
          {cancelLabel}
        </button>
        <button
          type="button"
          className={styles.dangerButton}
          disabled={pending}
          onClick={() => {
            void handleConfirm()
          }}
        >
          {pending ? pendingLabel : confirmLabel}
        </button>
      </div>
    </dialog>
  )
}

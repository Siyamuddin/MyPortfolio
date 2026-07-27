"use client"

import { useState, useTransition } from "react"
import type { ActionResult } from "@/lib/portfolio/auth-actions"

type AdminFormProps = {
  title: string
  action: (formData: FormData) => Promise<ActionResult>
  children: React.ReactNode
  onSuccess?: () => void
  submitLabel?: string
}

export const AdminForm = ({
  title,
  action,
  children,
  onSuccess,
  submitLabel = "Save",
}: AdminFormProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await action(formData)
      if (result.ok) {
        setError(null)
        setMessage("Saved")
        onSuccess?.()
        return
      }
      setMessage(null)
      setError(result.error ?? "Save failed")
    })
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-2xl border border-jet bg-eerie-black-2 p-5"
      aria-label={title}
    >
      <h3 className="text-base text-white-2">{title}</h3>
      {children}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-eerie-black-1 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label={submitLabel}
        >
          {isPending ? "Saving…" : submitLabel}
        </button>
        {message ? (
          <span className="text-sm text-emerald-400" role="status">
            {message}
          </span>
        ) : null}
        {error ? (
          <span className="text-sm text-red-400" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  )
}

export const fieldClassName =
  "mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"

export const Field = ({
  label,
  name,
  defaultValue = "",
  type = "text",
  required = false,
}: {
  label: string
  name: string
  defaultValue?: string | number
  type?: string
  required?: boolean
}) => (
  <label className="block text-sm text-light-gray-70">
    {label}
    <input
      type={type}
      name={name}
      defaultValue={defaultValue}
      required={required}
      className={fieldClassName}
      aria-label={label}
      tabIndex={0}
    />
  </label>
)

export const TextArea = ({
  label,
  name,
  defaultValue = "",
  rows = 4,
}: {
  label: string
  name: string
  defaultValue?: string
  rows?: number
}) => (
  <label className="block text-sm text-light-gray-70">
    {label}
    <textarea
      name={name}
      defaultValue={defaultValue}
      rows={rows}
      className={fieldClassName}
      aria-label={label}
      tabIndex={0}
    />
  </label>
)

export const DeleteButton = ({
  onDelete,
  label = "Delete",
}: {
  onDelete: () => Promise<ActionResult>
  label?: string
}) => {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  return (
    <div>
      <button
        type="button"
        disabled={isPending}
        className="rounded-lg border border-red-500/50 px-3 py-1.5 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
        aria-label={label}
        tabIndex={0}
        onClick={() => {
          if (!window.confirm("Delete this item?")) return
          startTransition(async () => {
            const result = await onDelete()
            if (!result.ok) setError(result.error ?? "Delete failed")
          })
        }}
      >
        {isPending ? "Deleting…" : label}
      </button>
      {error ? (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

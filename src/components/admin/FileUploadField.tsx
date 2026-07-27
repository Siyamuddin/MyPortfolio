"use client"

import { useRef, useState, useTransition } from "react"
import { uploadFileAction } from "@/lib/portfolio/admin-actions"

type FileUploadFieldProps = {
  name: string
  label: string
  folder: string
  defaultValue?: string
  accept?: string
}

export const FileUploadField = ({
  name,
  label,
  folder,
  defaultValue = "",
  accept = "image/*,.pdf,.webp,.svg",
}: FileUploadFieldProps) => {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = (file: File | undefined) => {
    if (!file) return
    const body = new FormData()
    body.set("file", file)
    body.set("folder", folder)

    startTransition(async () => {
      const result = await uploadFileAction(body)
      if (!result.ok || !result.url) {
        setError(result.error ?? "Upload failed")
        return
      }
      setError(null)
      setValue(result.url)
    })
  }

  return (
    <label className="block text-sm text-light-gray-70">
      {label}
      <input type="hidden" name={name} value={value} />
      <input
        type="url"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"
        aria-label={`${label} URL`}
        tabIndex={0}
      />
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="text-sm text-light-gray"
          aria-label={`Upload ${label}`}
          tabIndex={0}
          onChange={(event) => handleUpload(event.target.files?.[0])}
        />
        {isPending ? (
          <span className="text-xs text-gold">Uploading…</span>
        ) : null}
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-400" role="alert">
          {error}
        </p>
      ) : null}
    </label>
  )
}

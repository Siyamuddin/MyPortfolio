"use client"

import Image from "next/image"
import { Camera } from "lucide-react"
import { useState } from "react"
import type { EventPhoto } from "@/lib/portfolio/events"
import styles from "./Events.module.css"

export function EventImage({ photo, title, sizes, priority = false }: {
  photo?: EventPhoto
  title: string
  sizes: string
  priority?: boolean
}) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  if (!photo || failedUrl === photo.url) {
    return <span className={styles.imagePlaceholder}><Camera size={32} strokeWidth={1.25} aria-hidden="true" /><span>{photo ? "Photo unavailable" : "A moment to remember"}</span></span>
  }
  const storageOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL
  const canOptimize = photo.url.startsWith("/images/") || (storageOrigin
    ? photo.url.startsWith(`${storageOrigin}/storage/v1/object/public/`)
    : /^https:\/\/[^/]+\.supabase\.co\/storage\/v1\/object\/public\//.test(photo.url))
  return <Image src={photo.url} alt={photo.alt || photo.caption || title} fill sizes={sizes} priority={priority} unoptimized={!canOptimize} className={styles.photo} onError={() => setFailedUrl(photo.url)} />
}

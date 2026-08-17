"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  deleteMessageAction,
  updateMessageStatusAction,
} from "@/lib/portfolio/admin-actions"
import type { ContactMessageRow, ContactMessageStatus } from "@/lib/portfolio/types"

type MessagesAdminProps = {
  items: ContactMessageRow[]
}

const statusStyles: Record<ContactMessageStatus, string> = {
  unread: "bg-amber-500/20 text-amber-300",
  read: "bg-emerald-500/20 text-emerald-300",
  archived: "bg-white/10 text-light-gray-70",
}

export const MessagesAdmin = ({ items }: MessagesAdminProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleStatus = (id: string, status: ContactMessageStatus) => {
    startTransition(async () => {
      await updateMessageStatusAction(id, status)
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this message?")) return
    startTransition(async () => {
      await deleteMessageAction(id)
      router.refresh()
    })
  }

  if (items.length === 0) {
    return <p className="text-sm text-light-gray-70">No messages yet.</p>
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-jet bg-eerie-black-2 p-5"
          aria-label={`Message from ${item.fullname}`}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`rounded-full px-2 py-0.5 text-xs uppercase tracking-wide ${statusStyles[item.status]}`}
            >
              {item.status}
            </span>
            <span className="text-white-2">{item.fullname}</span>
            <a
              href={`mailto:${item.email}`}
              className="text-light-gray-70 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label={`Reply to ${item.email}`}
            >
              {item.email}
            </a>
            <time dateTime={item.created_at} className="text-light-gray-70">
              {new Date(item.created_at).toLocaleString()}
            </time>
          </div>
          <p className="mb-4 whitespace-pre-wrap text-sm text-light-gray">
            {item.message}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending || item.status === "read"}
              className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-sm text-emerald-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Mark message as read"
              tabIndex={0}
              onClick={() => handleStatus(item.id, "read")}
            >
              Mark read
            </button>
            <button
              type="button"
              disabled={isPending || item.status === "unread"}
              className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-sm text-amber-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Mark message as unread"
              tabIndex={0}
              onClick={() => handleStatus(item.id, "unread")}
            >
              Mark unread
            </button>
            <button
              type="button"
              disabled={isPending || item.status === "archived"}
              className="rounded-lg border border-jet px-3 py-1.5 text-sm text-light-gray-70 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Archive message"
              tabIndex={0}
              onClick={() => handleStatus(item.id, "archived")}
            >
              Archive
            </button>
            <button
              type="button"
              disabled={isPending}
              className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              aria-label="Delete message"
              tabIndex={0}
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import {
  deleteCommentAction,
  updateCommentStatusAction,
} from "@/lib/portfolio/admin-actions"

export type AdminCommentRow = {
  id: string
  post_id: string
  author_name: string
  author_email: string
  body: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  blog_posts?: { title: string; slug: string } | null
}

type CommentsAdminProps = {
  items: AdminCommentRow[]
}

export const CommentsAdmin = ({ items }: CommentsAdminProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleStatus = (
    id: string,
    status: "pending" | "approved" | "rejected"
  ) => {
    startTransition(async () => {
      await updateCommentStatusAction(id, status)
      router.refresh()
    })
  }

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this comment?")) return
    startTransition(async () => {
      await deleteCommentAction(id)
      router.refresh()
    })
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-light-gray-70">No comments yet.</p>
    )
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-2xl border border-jet bg-eerie-black-2 p-5"
          aria-label={`Comment by ${item.author_name}`}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 text-sm">
            <span
              className={`rounded-full px-2 py-0.5 text-xs uppercase tracking-wide ${
                item.status === "pending"
                  ? "bg-amber-500/20 text-amber-300"
                  : item.status === "approved"
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
              }`}
            >
              {item.status}
            </span>
            <span className="text-white-2">{item.author_name}</span>
            <span className="text-light-gray-70">{item.author_email}</span>
            <time
              dateTime={item.created_at}
              className="text-light-gray-70"
            >
              {new Date(item.created_at).toLocaleString()}
            </time>
          </div>
          <p className="mb-2 text-sm text-light-gray-70">
            Post: {item.blog_posts?.title ?? item.post_id}
          </p>
          <p className="mb-4 whitespace-pre-wrap text-sm text-light-gray">
            {item.body}
          </p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending || item.status === "approved"}
              className="rounded-lg border border-emerald-500/40 px-3 py-1.5 text-sm text-emerald-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Approve comment"
              tabIndex={0}
              onClick={() => handleStatus(item.id, "approved")}
            >
              Approve
            </button>
            <button
              type="button"
              disabled={isPending || item.status === "rejected"}
              className="rounded-lg border border-amber-500/40 px-3 py-1.5 text-sm text-amber-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              aria-label="Reject comment"
              tabIndex={0}
              onClick={() => handleStatus(item.id, "rejected")}
            >
              Reject
            </button>
            <button
              type="button"
              disabled={isPending}
              className="rounded-lg border border-red-500/40 px-3 py-1.5 text-sm text-red-300 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              aria-label="Delete comment"
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

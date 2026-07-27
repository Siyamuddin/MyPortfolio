"use client"

import { useState, useTransition } from "react"
import type { BlogComment } from "@/lib/types"

type NativeCommentsProps = {
  postId: string
  comments: BlogComment[]
}

export const NativeComments = ({ postId, comments }: NativeCommentsProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      setMessage(null)
      setError(null)

      try {
        const response = await fetch("/api/blog/comments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            postId,
            authorName: formData.get("authorName"),
            authorEmail: formData.get("authorEmail"),
            body: formData.get("body"),
            website: formData.get("website") || undefined,
          }),
        })

        const data = (await response.json()) as { message?: string }
        if (!response.ok) {
          setError(data.message ?? "Failed to submit comment.")
          return
        }

        setMessage(data.message ?? "Comment submitted.")
        ;(document.getElementById("native-comment-form") as HTMLFormElement | null)?.reset()
      } catch {
        setError("Failed to submit comment.")
      }
    })
  }

  return (
    <section className="mt-10 border-t border-jet pt-8" aria-labelledby="comments-title">
      <h2 id="comments-title" className="mb-4 text-xl text-white-2">
        Comments
      </h2>

      {comments.length === 0 ? (
        <p className="mb-6 text-sm text-light-gray-70">
          No approved comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ul className="mb-8 space-y-4">
          {comments.map((comment) => (
            <li
              key={comment.id}
              className="rounded-xl border border-jet bg-eerie-black-1 p-4"
            >
              <div className="mb-2 flex flex-wrap items-baseline gap-2">
                <p className="font-medium text-white-2">{comment.authorName}</p>
                <time
                  dateTime={comment.createdAt}
                  className="text-xs text-light-gray-70"
                >
                  {new Date(comment.createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="text-sm font-light leading-relaxed text-light-gray whitespace-pre-wrap">
                {comment.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      <form
        id="native-comment-form"
        action={handleSubmit}
        className="space-y-3 rounded-xl border border-jet bg-eerie-black-1 p-4"
        aria-label="Leave a comment"
      >
        <p className="text-sm text-light-gray-70">
          Comments are moderated before they appear.
        </p>
        <label className="block text-sm text-light-gray-70">
          Name
          <input
            name="authorName"
            required
            minLength={2}
            maxLength={100}
            className="mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"
            aria-label="Your name"
            tabIndex={0}
          />
        </label>
        <label className="block text-sm text-light-gray-70">
          Email
          <input
            name="authorEmail"
            type="email"
            required
            maxLength={200}
            className="mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"
            aria-label="Your email"
            tabIndex={0}
          />
        </label>
        <label className="block text-sm text-light-gray-70">
          Comment
          <textarea
            name="body"
            required
            minLength={3}
            maxLength={2000}
            rows={4}
            className="mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"
            aria-label="Your comment"
            tabIndex={0}
          />
        </label>
        <label className="hidden" aria-hidden="true">
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-eerie-black-1 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Submit comment"
        >
          {isPending ? "Submitting…" : "Submit comment"}
        </button>
        {message ? (
          <p className="text-sm text-emerald-400" role="status">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </section>
  )
}

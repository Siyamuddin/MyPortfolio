import { CommentsAdmin } from "@/components/admin/CommentsAdmin"
import { getAdminComments } from "@/lib/portfolio/admin-data"

export default async function AdminCommentsPage() {
  const comments = await getAdminComments()
  const pendingCount = comments.filter((c) => c.status === "pending").length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl text-white-2">Comments</h2>
        {pendingCount > 0 ? (
          <span
            className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300"
            aria-label={`${pendingCount} pending comments`}
          >
            {pendingCount} pending
          </span>
        ) : null}
      </div>
      <p className="text-sm text-light-gray-70">
        Moderate native blog comments before they appear publicly.
      </p>
      <CommentsAdmin items={comments} />
    </div>
  )
}

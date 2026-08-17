import { MessagesAdmin } from "@/components/admin/MessagesAdmin"
import { getContactMessages } from "@/lib/portfolio/admin-data"

export default async function AdminMessagesPage() {
  const messages = await getContactMessages()
  const unreadCount = messages.filter((message) => message.status === "unread").length

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-xl text-white-2">Messages</h2>
        {unreadCount > 0 ? (
          <span
            className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs text-amber-300"
            aria-label={`${unreadCount} unread messages`}
          >
            {unreadCount} unread
          </span>
        ) : null}
      </div>
      <p className="text-sm text-light-gray-70">
        Messages submitted through the public contact form.
      </p>
      <MessagesAdmin items={messages} />
    </div>
  )
}

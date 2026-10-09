import { getMailConfig, sendEmail } from "@/lib/email"

type NotifyPendingCommentInput = {
  postTitle: string
  authorName: string
  authorEmail: string
  body: string
}

export const notifyPendingComment = async ({
  postTitle,
  authorName,
  authorEmail,
  body,
}: NotifyPendingCommentInput) => {
  if (!getMailConfig()) {
    console.info("[blog-comment] notification delivery is not configured")
    return
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://siyamuddin.com"
  const excerpt = body.length > 280 ? `${body.slice(0, 277)}…` : body

  await sendEmail({
    subject: `New blog comment pending: ${postTitle}`,
    text: [
      "A new comment is pending moderation.",
      "",
      `Post: ${postTitle}`,
      `Author: ${authorName}`,
      `Email: ${authorEmail}`,
      "",
      "Comment:",
      excerpt,
      "",
      `Moderate: ${siteUrl}/admin/comments`,
    ].join("\n"),
  })
}

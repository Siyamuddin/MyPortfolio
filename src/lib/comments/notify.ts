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
  const resendApiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL ?? "siyamuddin177@gmail.com"
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://siyamuddin.com"
  const excerpt = body.length > 280 ? `${body.slice(0, 277)}…` : body

  if (!resendApiKey) {
    console.info("[blog-comment] pending (email not configured)", {
      postTitle,
      authorName,
      authorEmail,
      excerpt,
    })
    return
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Blog <onboarding@resend.dev>",
        to: [toEmail],
        subject: `New blog comment pending: ${postTitle}`,
        text: [
          `A new comment is pending moderation.`,
          ``,
          `Post: ${postTitle}`,
          `Author: ${authorName}`,
          `Email: ${authorEmail}`,
          ``,
          `Comment:`,
          excerpt,
          ``,
          `Moderate: ${siteUrl}/admin/comments`,
        ].join("\n"),
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[blog-comment] Resend failed", response.status, errorText)
    }
  } catch (error) {
    console.error("[blog-comment] Resend error", error)
  }
}

type SendEmailInput = {
  subject: string
  text: string
  replyTo?: string
}

/** Recipient and verified from address are both required. No mailbox fallback. */
export const getMailConfig = () => {
  const resendApiKey = process.env.RESEND_API_KEY
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim()
  const fromEmail = process.env.CONTACT_FROM_EMAIL?.trim()

  if (!resendApiKey || !toEmail || !fromEmail) return null

  return { resendApiKey, toEmail, fromEmail }
}

/** Forward one message through Resend. Logs status only, never the key or body. */
export const sendEmail = async ({
  subject,
  text,
  replyTo,
}: SendEmailInput): Promise<boolean> => {
  const mail = getMailConfig()
  if (!mail) return false

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mail.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: mail.fromEmail,
        to: [mail.toEmail],
        reply_to: replyTo,
        subject,
        text,
      }),
    })

    if (!response.ok) {
      console.error("[email] rejected", response.status)
      return false
    }

    return true
  } catch {
    console.error("[email] unavailable")
    return false
  }
}

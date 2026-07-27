import { createHash } from "crypto"

export const hashVisitor = (ip: string, userAgent: string) => {
  const salt = process.env.ANALYTICS_SALT ?? "dev-analytics-salt"
  return createHash("sha256")
    .update(`${salt}|${ip}|${userAgent}`)
    .digest("hex")
}

export const isTrackablePath = (path: string) => {
  if (!path.startsWith("/") || path.length > 500) return false
  if (path.startsWith("/admin") || path.startsWith("/api")) return false
  if (path.includes("..")) return false
  return true
}

const botPattern =
  /bot|crawl|spider|slurp|facebookexternalhit|preview|wget|curl|python-requests|headless/i

export const isLikelyBot = (userAgent: string) => {
  if (!userAgent || userAgent.length < 10) return true
  return botPattern.test(userAgent)
}

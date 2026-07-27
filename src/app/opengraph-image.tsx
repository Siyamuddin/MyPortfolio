import { ImageResponse } from "next/og"
import { getPortfolio } from "@/lib/portfolio/repository"

export const alt = "Siyam Uddin Portfolio"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  const portfolio = await getPortfolio()
  const { profile } = portfolio

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "72px",
          background:
            "linear-gradient(145deg, #0a0a0b 0%, #1a1a1e 55%, #222226 100%)",
          color: "#e8e8ed",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#ffdb70",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            marginBottom: 20,
            maxWidth: 980,
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#d0d6e0",
            marginBottom: 28,
          }}
        >
          {profile.title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "rgba(208,214,224,0.75)",
          }}
        >
          {profile.location}
        </div>
      </div>
    ),
    { ...size }
  )
}

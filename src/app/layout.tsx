import type { Metadata } from "next"
import { profile } from "@/data/portfolio"
import { SITE_URL, buildProfileAwarePageSeo } from "@/lib/seo"
import "./globals.css"

export const metadata: Metadata = {
  ...buildProfileAwarePageSeo(profile, "about"),
  title: { default: "Siyam Uddin | Web, App Development & AI Automation", template: "%s | Siyam Uddin" },
  metadataBase: new URL(SITE_URL),
  authors: [{ name: "Siyam Uddin", url: SITE_URL }],
  creator: "Siyam Uddin",
  publisher: "Siyam Uddin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-48.webp", type: "image/webp", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
}

export const viewport = {
  themeColor: "#111210",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}

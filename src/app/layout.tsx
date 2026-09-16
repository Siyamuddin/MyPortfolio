import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { SITE_URL, buildPageMetadata } from "@/lib/seo"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: "Siyam Uddin — Web Development & AI Automation",
    description: "Web applications and AI automation by Siyam Uddin, based in Seoul, South Korea. Explore selected projects and get in touch.",
    path: "/",
  }),
  title: { default: "Siyam Uddin — Web Development & AI Automation", template: "%s | Siyam Uddin" },
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
  category: "technology",
  classification: "Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
}

export const viewport = {
  themeColor: "#0a0a0b",
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
      <body className={`${poppins.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}

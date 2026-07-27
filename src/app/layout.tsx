import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import { SITE_URL } from "@/lib/seo"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Siyam Uddin — Full-Stack Software Engineer | Java Spring Boot & React Developer",
    template: "%s | Siyam Uddin",
  },
  description:
    "Full-Stack Software Engineer with 3+ years of experience in Java Spring Boot, React, TypeScript, AWS, Docker, and AI/ML. Based in Seoul, South Korea. Building production-grade systems serving 50K+ req/hr.",
  metadataBase: new URL(SITE_URL),
  keywords: [
    "Siyam Uddin", "Java Developer", "Spring Boot", "Full-Stack Engineer",
    "React Developer", "Backend Developer", "AI/ML Engineer", "DevOps",
    "Seoul Developer", "South Korea Software Engineer", "RAG Pipeline",
    "LangChain", "Microservices", "AWS", "Docker", "TypeScript",
    "Java Backend Developer Seoul", "Spring Boot Developer Korea",
  ],
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
      { url: "/favicon-48.webp", type: "image/webp", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Siyam Uddin — Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in Java Spring Boot, React, TypeScript, AWS, Docker, and AI/ML integration. 3+ years of production experience.",
    url: SITE_URL,
    siteName: "Siyam Uddin Portfolio",
    locale: "en_US",
    type: "website",
    countryName: "South Korea",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Siyam Uddin - Full-Stack Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siyam Uddin — Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer | Java Spring Boot · React · DevOps · AI/ML. Building production systems in Seoul.",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@siyamuddin",
  },
  alternates: {
    canonical: SITE_URL,
  },
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

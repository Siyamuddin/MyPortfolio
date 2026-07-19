import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Siyam Uddin — Portfolio",
  description:
    "Software Developer specializing in full-stack development, AI/ML integration, and automation solutions. Based in Seoul, South Korea.",
  metadataBase: new URL("https://siyamuddin.com"),
  icons: [
    { rel: "icon", url: "/favicon-48.webp", type: "image/webp" },
    { rel: "icon", url: "/HeroImage.webp", sizes: "48x48" },
    { rel: "apple-touch-icon", url: "/favicon-48.webp" },
    { rel: "shortcut icon", url: "/favicon-48.webp" },
  ],
  openGraph: {
    title: "Siyam Uddin — Portfolio",
    description:
      "Software Developer specializing in full-stack development, AI/ML integration, and automation solutions.",
    url: "https://siyamuddin.com",
    siteName: "Siyam Uddin",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://siyamuddin.com/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Siyam Uddin - Software Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siyam Uddin — Portfolio",
    description:
      "Software Developer specializing in full-stack development, AI/ML integration, and automation solutions.",
    images: ["https://siyamuddin.com/og-image.webp"],
  },
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

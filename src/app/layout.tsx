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
  metadataBase: new URL("https://siyamuddin.xyz"),
  openGraph: {
    title: "Siyam Uddin — Portfolio",
    description:
      "Software Developer specializing in full-stack development, AI/ML integration, and automation solutions.",
    url: "https://siyamuddin.xyz",
    siteName: "Siyam Uddin",
    locale: "en_US",
    type: "website",
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

import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Siyam Uddin — Full-Stack Software Engineer | Java Spring Boot & React Developer",
    template: "%s | Siyam Uddin",
  },
  description:
    "Full-Stack Software Engineer with 3+ years of experience in Java Spring Boot, React, TypeScript, AWS, Docker, and AI/ML. Based in Seoul, South Korea. Building production-grade systems serving 50K+ req/hr.",
  metadataBase: new URL("https://siyamuddin.com"),
  keywords: [
    "Siyam Uddin", "Java Developer", "Spring Boot", "Full-Stack Engineer",
    "React Developer", "Backend Developer", "AI/ML Engineer", "DevOps",
    "Seoul Developer", "South Korea Software Engineer", "RAG Pipeline",
    "LangChain", "Microservices", "AWS", "Docker", "TypeScript",
    "Java Backend Developer Seoul", "Spring Boot Developer Korea",
  ],
  authors: [{ name: "Siyam Uddin", url: "https://siyamuddin.com" }],
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
  icons: [
    { rel: "icon", url: "/favicon-48.webp", type: "image/webp" },
    { rel: "icon", url: "/HeroImage.webp", sizes: "48x48" },
    { rel: "apple-touch-icon", url: "/favicon-48.webp", sizes: "180x180" },
    { rel: "shortcut icon", url: "/favicon-48.webp" },
  ],
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Siyam Uddin — Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer specializing in Java Spring Boot, React, TypeScript, AWS, Docker, and AI/ML integration. 3+ years of production experience.",
    url: "https://siyamuddin.com",
    siteName: "Siyam Uddin Portfolio",
    locale: "en_US",
    type: "website",
    countryName: "South Korea",
    images: [
      {
        url: "https://siyamuddin.com/og-image.webp",
        width: 1200,
        height: 630,
        alt: "Siyam Uddin - Full-Stack Software Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Siyam Uddin — Full-Stack Software Engineer",
    description:
      "Full-Stack Software Engineer | Java Spring Boot · React · DevOps · AI/ML. Building production systems in Seoul.",
    images: ["https://siyamuddin.com/og-image.webp"],
    creator: "@SiyamUddin12",
  },
  alternates: {
    canonical: "https://siyamuddin.com",
    languages: {
      "en": "https://siyamuddin.com",
      "ko": "https://siyamuddin.com/ko",
    },
  },
  category: "technology",
  classification: "Portfolio",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Siyam Uddin",
    jobTitle: "Full-Stack Software Engineer",
    url: "https://siyamuddin.com",
    sameAs: [
      "https://github.com/Siyamuddin",
      "https://linkedin.com/in/uddin-siyam-8953511ab",
      "https://x.com/siyamuddin",
    ],
    email: "siyamuddin177@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Seoul",
      addressCountry: "South Korea",
    },
    knowsAbout: [
      "Java", "Spring Boot", "React", "TypeScript", "Python",
      "AWS", "Docker", "Microservices", "AI/ML", "DevOps",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Sejong University",
    },
  }

  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}

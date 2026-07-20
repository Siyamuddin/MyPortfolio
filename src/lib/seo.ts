import type { Metadata } from "next"
import type { NavPage } from "@/lib/types"

export const SITE_URL = "https://siyamuddin.com"
export const SITE_NAME = "Siyam Uddin Portfolio"
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Siyam Uddin - Full-Stack Software Engineer Portfolio",
}

export const pagePaths: Record<NavPage, string> = {
  about: "/",
  resume: "/resume",
  portfolio: "/portfolio",
  blog: "/blog",
  contact: "/contact",
}

export const pathToNavPage = (pathname: string): NavPage => {
  const normalized = pathname.replace(/\/$/, "") || "/"
  const entry = Object.entries(pagePaths).find(([, path]) => path === normalized)
  return (entry?.[0] as NavPage) ?? "about"
}

type PageSeoInput = {
  title: string
  description: string
  path: string
  ogTitle?: string
}

export const buildPageMetadata = ({
  title,
  description,
  path,
  ogTitle,
}: PageSeoInput): Metadata => {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`
  const socialTitle = ogTitle ?? title

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [OG_IMAGE.url],
      creator: "@SiyamUddin12",
    },
  }
}

export const pageSeo = {
  about: {
    ...buildPageMetadata({
      title: "Siyam Uddin — Full-Stack Software Engineer | Java Spring Boot & React Developer",
      description:
        "Full-Stack Software Engineer with 3+ years of experience in Java Spring Boot, React, TypeScript, AWS, Docker, and AI/ML. Based in Seoul, South Korea. Building production-grade systems serving 50K+ req/hr.",
      path: "/",
      ogTitle: "Siyam Uddin — Full-Stack Software Engineer",
    }),
    title: {
      absolute:
        "Siyam Uddin — Full-Stack Software Engineer | Java Spring Boot & React Developer",
    },
  },
  resume: buildPageMetadata({
    title: "Resume",
    description:
      "Resume of Siyam Uddin — education at Sejong University and experience building production Spring Boot, React, and AWS systems in Seoul.",
    path: "/resume",
    ogTitle: "Resume | Siyam Uddin — Full-Stack Software Engineer",
  }),
  portfolio: buildPageMetadata({
    title: "Portfolio",
    description:
      "Selected projects by Siyam Uddin — AirSeoul flight booking, GlobalSellerket, SetlOne, and AI automation tools built with Spring Boot and React.",
    path: "/portfolio",
    ogTitle: "Portfolio | Siyam Uddin — Full-Stack Software Engineer",
  }),
  blog: buildPageMetadata({
    title: "Blog",
    description:
      "Articles and notes from Siyam Uddin on Agentic AI, Spring AI, n8n automation, and full-stack engineering.",
    path: "/blog",
    ogTitle: "Blog | Siyam Uddin — Full-Stack Software Engineer",
  }),
  contact: buildPageMetadata({
    title: "Contact",
    description:
      "Get in touch with Siyam Uddin — Full-Stack Software Engineer in Seoul available for Java, Spring Boot, React, and AI/ML projects.",
    path: "/contact",
    ogTitle: "Contact | Siyam Uddin — Full-Stack Software Engineer",
  }),
} as const

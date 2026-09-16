import type { Metadata } from "next"
import type { Profile } from "@/lib/types"
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
  if (normalized.startsWith("/blog/")) return "blog"
  const entry = Object.entries(pagePaths).find(([, path]) => path === normalized)
  return (entry?.[0] as NavPage) ?? "about"
}

export const twitterHandleFromUrl = (twitterUrl: string) => {
  try {
    const pathname = new URL(twitterUrl).pathname.replace(/\//g, "")
    return pathname ? `@${pathname}` : undefined
  } catch {
    return undefined
  }
}

type PageSeoInput = {
  title: string
  description: string
  path: string
  ogTitle?: string
  absoluteTitle?: boolean
  twitterCreator?: string
}

export const buildPageMetadata = ({
  title,
  description,
  path,
  ogTitle,
  absoluteTitle = false,
  twitterCreator,
}: PageSeoInput): Metadata => {
  const url = path === "/" ? SITE_URL : `${SITE_URL}${path}`
  const socialTitle = ogTitle ?? title

  return {
    title: absoluteTitle ? { absolute: title } : title,
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
      creator: twitterCreator,
    },
  }
}

export const buildProfileAwarePageSeo = (
  profile: Profile,
  page: NavPage
): Metadata => {
  const creator = twitterHandleFromUrl(profile.socials.twitter)
  const bioExcerpt = `${profile.name} builds web applications and AI automation for businesses. Based in ${profile.location}. Explore selected projects and discuss your next build.`

  const pages: Record<NavPage, PageSeoInput> = {
    about: {
      title: `${profile.name} — Web Development & AI Automation`,
      description: bioExcerpt,
      path: "/",
      ogTitle: `${profile.name} — ${profile.title}`,
      absoluteTitle: true,
      twitterCreator: creator,
    },
    resume: {
      title: "Resume",
      description: `Resume of ${profile.name} — ${profile.title} in ${profile.location}. Education, experience, and skills.`,
      path: "/resume",
      ogTitle: `Resume | ${profile.name} — ${profile.title}`,
      twitterCreator: creator,
    },
    portfolio: {
      title: "Web Development & AI Automation Projects",
      description: `Selected projects by ${profile.name} — production web apps, platforms, and AI automation.`,
      path: "/portfolio",
      ogTitle: `Portfolio | ${profile.name} — ${profile.title}`,
      twitterCreator: creator,
    },
    blog: {
      title: "Writing on Software & AI",
      description: `Articles and notes from ${profile.name} on software engineering, AI, and automation.`,
      path: "/blog",
      ogTitle: `Blog | ${profile.name} — ${profile.title}`,
      twitterCreator: creator,
    },
    contact: {
      title: "Discuss a Web or AI Automation Project",
      description: `Get in touch with ${profile.name} — ${profile.title} in ${profile.location}.`,
      path: "/contact",
      ogTitle: `Contact | ${profile.name} — ${profile.title}`,
      twitterCreator: creator,
    },
  }

  return buildPageMetadata(pages[page])
}

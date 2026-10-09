import type { Metadata } from "next"
import type { Profile } from "@/lib/types"
import type { NavPage } from "@/lib/types"

export const SITE_URL = "https://siyamuddin.com"
export const SITE_NAME = "Siyam Uddin Portfolio"

export type OgImageInput = {
  url: string
  width?: number
  height?: number
  alt?: string
  type?: string
}

export const OG_IMAGE: Required<Pick<OgImageInput, "url" | "width" | "height" | "type" | "alt">> = {
  url: `${SITE_URL}/og-image.jpg`,
  width: 1200,
  height: 630,
  type: "image/jpeg",
  alt: "Siyam Uddin — Web Development & AI Automation Portfolio",
}

export const pagePaths: Record<NavPage, string> = {
  about: "/",
  resume: "/resume",
  portfolio: "/portfolio",
  events: "/events",
  blog: "/blog",
  contact: "/contact",
}

export const pathToNavPage = (pathname: string): NavPage => {
  const normalized = pathname.replace(/\/$/, "") || "/"
  if (normalized.startsWith("/blog/")) return "blog"
  if (normalized.startsWith("/events/")) return "events"
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

/** Resolve a relative path, bare slug, or absolute URL to a canonical absolute URL. */
export const absoluteUrl = (pathOrUrl: string) => {
  if (!pathOrUrl) return SITE_URL
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }
  if (pathOrUrl === "/") return SITE_URL
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`
}

const toOgImages = (image: OgImageInput) => [
  {
    url: image.url,
    ...(image.width ? { width: image.width } : {}),
    ...(image.height ? { height: image.height } : {}),
    ...(image.type ? { type: image.type } : {}),
    alt: image.alt ?? OG_IMAGE.alt,
  },
]

export type PageSeoInput = {
  title: string
  description: string
  /** Site-relative path (e.g. "/events/foo") or "/" for the home page. */
  path: string
  ogTitle?: string
  /** When true, the browser title is used verbatim (bypasses the "%s | …" template). */
  absoluteTitle?: boolean
  twitterCreator?: string
  /** Overrides the shared Open Graph image. Falls back to the default when omitted. */
  ogImage?: OgImageInput
  openGraphType?: "website" | "article" | "profile"
  /** Article timestamps surfaced to Open Graph for blog posts and events. */
  publishedTime?: string
  modifiedTime?: string
  /** Freeform keywords, typically derived from content tags. */
  keywords?: string[]
}

export const buildPageMetadata = ({
  title,
  description,
  path,
  ogTitle,
  absoluteTitle = false,
  twitterCreator,
  ogImage,
  openGraphType = "website",
  publishedTime,
  modifiedTime,
  keywords,
}: PageSeoInput): Metadata => {
  const url = absoluteUrl(path)
  const socialTitle = ogTitle ?? title
  const image = ogImage ?? OG_IMAGE
  const images = toOgImages(image)

  const isArticle = openGraphType === "article"

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords && keywords.length ? { keywords } : {}),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: openGraphType,
      ...(isArticle && (publishedTime || modifiedTime)
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
          }
        : {}),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: images.map((entry) => entry.url),
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
      // Open Graph title intentionally mirrors the real browser <title> so the
      // social preview never drifts from the page title.
      absoluteTitle: true,
      openGraphType: "profile",
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
    events: {
      title: "Events & Experiences",
      description: `Hackathons, university events, and community experiences from ${profile.name}, captured in photos and stories.`,
      path: "/events",
      ogTitle: `Events | ${profile.name}`,
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

/** Resolve a stored image reference (absolute URL, "/path", or empty) to an OG image. */
export const resolveOgImage = (
  reference: string | undefined | null,
  alt: string
): OgImageInput => {
  if (!reference) return { ...OG_IMAGE, alt }
  if (reference.startsWith("http://") || reference.startsWith("https://")) {
    return { url: reference, alt }
  }
  if (reference.startsWith("/")) {
    return { url: `${SITE_URL}${reference}`, alt }
  }
  return { ...OG_IMAGE, alt }
}

/** Clamp a long body of text into a meta-description-friendly summary. */
export const toMetaDescription = (value: string, maxLength = 160) => {
  const normalized = value.replace(/\s+/g, " ").trim()
  if (normalized.length <= maxLength) return normalized
  const clipped = normalized.slice(0, maxLength - 1)
  const lastSpace = clipped.lastIndexOf(" ")
  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`
}

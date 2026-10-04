import type { Education, Experience, Profile } from "@/lib/types"
import { SITE_NAME, SITE_URL } from "@/lib/seo"

const PERSON_ID = `${SITE_URL}/#person`
const WEBSITE_ID = `${SITE_URL}/#website`

export const toAbsoluteUrl = (pathOrUrl: string) => {
  if (!pathOrUrl) return SITE_URL
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`
}

export const isAbsoluteHttpUrl = (value: string) =>
  value.startsWith("http://") || value.startsWith("https://")

const parseLocation = (location: string) => {
  const [locality, country] = location.split(",").map((part) => part.trim())
  return {
    "@type": "PostalAddress" as const,
    addressLocality: locality || location,
    ...(country ? { addressCountry: country } : {}),
  }
}

export const buildPersonNode = (
  profile: Profile,
  extras?: {
    education?: Education[]
    experience?: Experience[]
    skills?: string[]
  }
) => {
  const sameAs = Object.values(profile.socials).filter(isAbsoluteHttpUrl)

  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    jobTitle: profile.title,
    url: SITE_URL,
    email: profile.email,
    image: toAbsoluteUrl(profile.avatar),
    sameAs,
    address: parseLocation(profile.location),
    ...(extras?.skills?.length
      ? { knowsAbout: extras.skills }
      : {}),

  }
}

export const buildWebsiteNode = (profile: Profile) => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  description: `${profile.name} — ${profile.title}. Portfolio and professional profile.`,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
})

export const buildSiteGraph = (
  profile: Profile,
  extras?: {
    education?: Education[]
    experience?: Experience[]
    skills?: string[]
  }
) => ({
  "@context": "https://schema.org",
  "@graph": [buildPersonNode(profile, extras), buildWebsiteNode(profile)],
})

export const buildProfilePageJsonLd = (profile: Profile) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: `${profile.name} — ${profile.title}`,
  url: SITE_URL,
  mainEntity: { "@id": PERSON_ID },
})

export const buildBreadcrumbJsonLd = (
  pageName: string,
  path: string,
  parents: { name: string; path: string }[] = []
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    ...parents.map((parent, index) => ({
      "@type": "ListItem" as const,
      position: index + 2,
      name: parent.name,
      item: `${SITE_URL}${parent.path}`,
    })),
    {
      "@type": "ListItem",
      position: parents.length + 2,
      name: pageName,
      item: `${SITE_URL}${path}`,
    },
  ],
})

export const buildFaqPageJsonLd = (
  faqs: { question: string; answer: string }[]
) => {
  if (faqs.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}

export const buildProjectItemListJsonLd = (
  projects: { title: string; description: string; url: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Portfolio Projects",
  url: `${SITE_URL}/portfolio`,
  numberOfItems: projects.length,
  itemListElement: projects.map((project, index) => {
    const item: Record<string, unknown> = {
      "@type": "CreativeWork",
      name: project.title,
      description: project.description,
    }
    if (isAbsoluteHttpUrl(project.url)) item.url = project.url

    return {
      "@type": "ListItem",
      position: index + 1,
      ...(isAbsoluteHttpUrl(project.url) ? { url: project.url } : {}),
      item,
    }
  }),
})

export const buildBlogItemListJsonLd = (
  posts: {
    title: string
    excerpt: string
    url: string
    dateTime?: string
    href?: string | null
  }[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Blog Posts",
  url: `${SITE_URL}/blog`,
  numberOfItems: posts.length,
  itemListElement: posts.map((post, index) => {
    const link =
      post.href?.startsWith("/")
        ? `${SITE_URL}${post.href}`
        : isAbsoluteHttpUrl(post.url)
          ? post.url
          : null
    const item: Record<string, unknown> = {
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      author: { "@id": PERSON_ID },
    }
    if (link) item.url = link
    if (post.dateTime) item.datePublished = post.dateTime

    return {
      "@type": "ListItem",
      position: index + 1,
      ...(link ? { url: link } : {}),
      item,
    }
  }),
})

export const buildResumeJsonLd = (
  profile: Profile,
  education: Education[],
  experience: Experience[],
  skills: string[]
) => ({
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  name: `Resume — ${profile.name}`,
  url: `${SITE_URL}/resume`,
  mainEntity: buildPersonNode(profile, { education, experience, skills }),
})

export const buildContactJsonLd = (profile: Profile) => ({
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact — ${profile.name}`,
  url: `${SITE_URL}/contact`,
  mainEntity: {
    ...buildPersonNode(profile),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "professional",
      email: profile.email,
      availableLanguage: ["English"],
    },
  },
})

type EventJsonLdInput = {
  title: string
  slug: string
  date: string
  description?: string
  highlight?: string
  location?: string
  organizer?: string
  url?: string
  image?: string | null
  tags?: string[]
}

const buildEventNode = (event: EventJsonLdInput) => {
  const detailUrl = `${SITE_URL}/events/${event.slug}`
  const node: Record<string, unknown> = {
    "@type": "Event",
    name: event.title,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: detailUrl,
    mainEntityOfPage: detailUrl,
    performer: { "@id": PERSON_ID },
  }
  const description = event.description?.trim() || event.highlight?.trim()
  if (description) node.description = description
  if (event.highlight?.trim()) node.award = event.highlight.trim()
  if (event.location?.trim()) {
    node.location = {
      "@type": "Place",
      name: event.location,
      address: event.location,
    }
  }
  if (event.organizer?.trim()) {
    node.organizer = { "@type": "Organization", name: event.organizer }
  }
  if (event.image) node.image = toAbsoluteUrl(event.image)
  if (event.url && isAbsoluteHttpUrl(event.url)) node.sameAs = event.url
  if (event.tags?.length) node.keywords = event.tags.join(", ")
  return node
}

export const buildEventJsonLd = (event: EventJsonLdInput) => ({
  "@context": "https://schema.org",
  ...buildEventNode(event),
})

export const buildEventItemListJsonLd = (events: EventJsonLdInput[]) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Events & Experiences",
  url: `${SITE_URL}/events`,
  numberOfItems: events.length,
  itemListElement: events.map((event, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `${SITE_URL}/events/${event.slug}`,
    item: buildEventNode(event),
  })),
})

type TagListItem = {
  name: string
  url: string
  description?: string
  type?: "BlogPosting" | "Event" | "CreativeWork"
}

export const buildTagItemListJsonLd = (
  tag: { slug: string; label: string },
  items: TagListItem[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: `#${tag.label}`,
  url: `${SITE_URL}/tags/${tag.slug}`,
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: item.url,
    item: {
      "@type": item.type ?? "CreativeWork",
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    },
  })),
})

export const buildTagsCollectionJsonLd = (
  tags: { slug: string; label: string }[]
) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Tags",
  url: `${SITE_URL}/tags`,
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: tags.length,
    itemListElement: tags.map((tag, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${SITE_URL}/tags/${tag.slug}`,
      name: `#${tag.label}`,
    })),
  },
})

export const JsonLdScript = ({ data }: { data: unknown }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
  />
)

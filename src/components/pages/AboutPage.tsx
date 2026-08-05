import Link from "next/link"
import { Code2, Download, Server, Smartphone, Sparkles } from "lucide-react"
import { FaqAccordion } from "@/components/pages/FaqAccordion"
import { SkillsGrid } from "@/components/pages/SkillsGrid"
import { FeaturedProjectCard } from "@/components/portfolio/FeaturedProjectCard"
import { SectionEyebrow } from "@/components/ui/SectionEyebrow"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import type { BlogPost, Faq, Profile, Project, Service, Skill } from "@/lib/types"

const serviceIcons = {
  Smartphone,
  Code2,
  Sparkles,
  Server,
} as const

type AboutPageProps = {
  profile: Profile
  services: Service[]
  skills: Skill[]
  faqs?: Faq[]
  featuredPosts?: BlogPost[]
  featuredProject?: Project | null
}

export const AboutPage = ({
  profile,
  services,
  skills,
  faqs = [],
  featuredPosts = [],
  featuredProject = null,
}: AboutPageProps) => {
  const writingLinks = featuredPosts
    .map((post) => {
      const href = getBlogPostHref(post)
      if (!href || href.startsWith("http")) return null
      return { title: post.title, href, category: post.category, date: post.date }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 3)

  const resumeHref = profile.resumeUrl ?? "/resume.pdf"

  return (
    <article
      id="about-panel"
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="about-title"
    >
      <header>
        <SectionEyebrow>Introduction</SectionEyebrow>
        <SectionTitle as="h1">
          <span id="about-title">About Me</span>
        </SectionTitle>
        <p className="mb-5 text-sm font-medium leading-relaxed text-gold min-[580px]:text-[15px]">
          {profile.title} · AI automation · Production systems · {profile.location}
        </p>
        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-smoky-black transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="Contact me for work inquiries"
          >
            Contact me
          </Link>
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-jet px-5 py-2.5 text-sm font-medium text-white-2 transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="Download resume PDF"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download resume
          </a>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center rounded-xl px-2 py-2.5 text-sm font-medium text-light-gray-70 underline-offset-2 transition-colors hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="View portfolio projects"
          >
            View projects
          </Link>
        </div>
      </header>

      <section className="text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
        {profile.bio.map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0">
            {index === 1 && profile.bioHighlight ? (
              <>
                {paragraph.split(profile.bioHighlight)[0]}
                <strong className="font-medium text-white-2">
                  {profile.bioHighlight}
                </strong>
                {paragraph.split(profile.bioHighlight)[1]}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}
      </section>

      {featuredProject ? (
        <section className="mt-10 mb-10" aria-labelledby="featured-project-title">
          <SectionEyebrow>Featured work</SectionEyebrow>
          <SectionTitle as="h3">
            <span id="featured-project-title">Flagship Project</span>
          </SectionTitle>
          <FeaturedProjectCard project={featuredProject} />
        </section>
      ) : null}

      <section className="mt-10 mb-10">
        <SectionEyebrow>Services</SectionEyebrow>
        <SectionTitle as="h3">What I&apos;m Doing</SectionTitle>
        <ul className="grid grid-cols-1 gap-5 min-[580px]:gap-[20px] min-[1024px]:grid-cols-2 min-[1024px]:gap-x-[25px] min-[1024px]:gap-y-5">
          {services.map((service) => {
            const Icon =
              serviceIcons[service.icon as keyof typeof serviceIcons] ?? Code2

            return (
              <li
                key={service.title}
                className="gradient-border-card p-5 shadow-[var(--shadow-2)] min-[580px]:flex min-[580px]:items-start min-[580px]:justify-start min-[580px]:gap-[18px] min-[580px]:p-[30px]"
              >
                <div className="mb-2.5 flex h-12 w-12 items-center justify-center text-2xl text-gold min-[580px]:mb-0 min-[580px]:mt-1">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-center min-[580px]:text-left">
                  <h4 className="mb-1.5 text-base capitalize text-white-2 min-[580px]:text-lg">
                    {service.title}
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
                    {service.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-10">
        <SectionEyebrow>Tech stack</SectionEyebrow>
        <SectionTitle as="h3">Skills</SectionTitle>
        <SkillsGrid skills={skills} />
      </section>

      {writingLinks.length > 0 ? (
        <section className="mb-10" aria-labelledby="recent-writing-title">
          <SectionEyebrow>Writing</SectionEyebrow>
          <SectionTitle as="h3">
            <span id="recent-writing-title">Recent Writing</span>
          </SectionTitle>
          <ul className="space-y-3">
            {writingLinks.map((post) => (
              <li key={post.href}>
                <Link
                  href={post.href}
                  className="group block rounded-xl border border-jet bg-eerie-black-1 px-4 py-3 transition-colors hover:border-gold/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  tabIndex={0}
                  aria-label={`Read blog post: ${post.title}`}
                >
                  <p className="text-sm font-medium text-white-2 transition-colors group-hover:text-gold min-[580px]:text-[15px]">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs text-light-gray-70">
                    {post.category}
                    {post.date ? ` · ${post.date}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-light-gray-70">
            <Link
              href="/blog"
              className="text-gold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="View all blog posts"
            >
              View all posts
            </Link>
          </p>
        </section>
      ) : null}

      <FaqAccordion faqs={faqs} />
    </article>
  )
}

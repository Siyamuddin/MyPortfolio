import Link from "next/link"
import { Code2, Server, Smartphone, Sparkles } from "lucide-react"
import { AboutHeroHeader } from "@/components/pages/AboutHeroHeader"
import { FaqAccordion } from "@/components/pages/FaqAccordion"
import { SkillsGrid } from "@/components/pages/SkillsGrid"
import { FeaturedEventCard } from "@/components/events/FeaturedEventCard"
import { SectionEyebrow } from "@/components/ui/SectionEyebrow"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { Reveal } from "@/components/ui/Reveal"
import { pageShellClassName } from "@/lib/cn"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import type { PortfolioEvent } from "@/lib/portfolio/events"
import type { BlogPost, Faq, Profile, Service, Skill } from "@/lib/types"

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
  featuredEvent?: PortfolioEvent | null
}

export const AboutPage = ({
  profile,
  services,
  skills,
  faqs = [],
  featuredPosts = [],
  featuredEvent = null,
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
      className={`${pageShellClassName} min-[1250px]:min-h-full`}
      aria-labelledby="about-title"
    >
      <AboutHeroHeader profile={profile} resumeHref={resumeHref} />

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

      {featuredEvent ? (
        <section className="mt-10 mb-10" aria-labelledby="featured-event-title">
          <SectionEyebrow>Featured event</SectionEyebrow>
          <SectionTitle section>
            <span id="featured-event-title">In the Spotlight</span>
          </SectionTitle>
          <FeaturedEventCard event={featuredEvent} />
        </section>
      ) : null}

      <section className="mt-10 mb-10">
        <SectionEyebrow>Services</SectionEyebrow>
        <SectionTitle section>What I&apos;m Doing</SectionTitle>
        <ul className="grid grid-cols-1 gap-5 min-[580px]:gap-[20px] min-[1024px]:grid-cols-2 min-[1024px]:gap-x-[25px] min-[1024px]:gap-y-5">
          {services.map((service, index) => {
            const Icon =
              serviceIcons[service.icon as keyof typeof serviceIcons] ?? Code2

            return (
              <Reveal
                as="li"
                key={service.title}
                delay={index * 60}
                className="group gradient-border-card p-5 shadow-[var(--shadow-2)] transition-[transform,box-shadow] duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(0,0,0,0.3)] motion-reduce:transform-none min-[580px]:flex min-[580px]:items-start min-[580px]:justify-start min-[580px]:gap-[18px] min-[580px]:p-[30px]"
              >
                <div className="mx-auto mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl text-2xl text-gold transition-[background,box-shadow] duration-200 group-hover:bg-gold/5 group-hover:shadow-[0_0_20px_rgba(255,219,112,0.12)] min-[580px]:mx-0 min-[580px]:mb-0 min-[580px]:mt-1">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-center min-[580px]:text-left">
                  <h3 className="mb-1.5 text-base capitalize text-white-2 transition-colors group-hover:text-gold min-[580px]:text-lg">
                    {service.title}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
                    {service.description}
                  </p>
                </div>
              </Reveal>
            )
          })}
        </ul>
      </section>

      <section className="mb-10">
        <SectionEyebrow>Tech stack</SectionEyebrow>
        <SectionTitle section>Skills</SectionTitle>
        <SkillsGrid skills={skills} />
      </section>

      {writingLinks.length > 0 ? (
        <section className="mb-10" aria-labelledby="recent-writing-title">
          <SectionEyebrow>Writing</SectionEyebrow>
          <SectionTitle section>
            <span id="recent-writing-title">Recent Writing</span>
          </SectionTitle>
          <ul className="space-y-3">
            {writingLinks.map((post, index) => (
              <Reveal as="li" key={post.href} delay={index * 60}>
                <Link
                  href={post.href}
                  className="group relative block overflow-hidden rounded-xl border border-jet bg-eerie-black-1 px-4 py-3 transition-colors duration-[160ms] ease-[cubic-bezier(.22,1,.36,1)] hover:border-gold/50 hover:bg-onyx focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  tabIndex={0}
                  aria-label={`Read blog post: ${post.title}`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-gold transition-transform duration-[160ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-y-100 motion-reduce:hidden"
                  />
                  <p className="text-sm font-medium text-white-2 transition-[color,transform] duration-[160ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:text-gold motion-reduce:group-hover:translate-x-0 min-[580px]:text-[15px]">
                    {post.title}
                  </p>
                  <p className="mt-1 font-mono text-[11px] tabular-nums text-light-gray-70">
                    {post.category}
                    {post.date ? ` · ${post.date}` : ""}
                  </p>
                </Link>
              </Reveal>
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

import Link from "next/link"
import { ArrowLeft, CalendarDays, FileText, FolderGit2 } from "lucide-react"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import { formatEventDate } from "@/lib/portfolio/events"
import type { TagContent } from "@/lib/portfolio/tags-repository"
import type { Tag } from "@/lib/portfolio/tags"

type Row = {
  key: string
  title: string
  description: string
  href: string
  external: boolean
  kind: string
  meta?: string
}

const rowShell =
  "group block h-full rounded-2xl border border-jet bg-eerie-black-1 p-5 transition-colors hover:border-gold/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"

function ContentRow({ row, icon }: { row: Row; icon: React.ReactNode }) {
  const inner = (
    <>
      <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-gold">
        {icon}
        {row.kind}
      </span>
      <h3 className="mt-2 text-lg leading-snug text-white-2 transition-colors group-hover:text-gold">
        {row.title}
      </h3>
      {row.meta ? <p className="mt-1 text-xs font-light text-light-gray-70">{row.meta}</p> : null}
      {row.description ? (
        <p className="mt-2 line-clamp-2 text-sm font-light leading-relaxed text-light-gray">
          {row.description}
        </p>
      ) : null}
    </>
  )

  return (
    <li className="min-w-0">
      {row.external ? (
        <a href={row.href} target="_blank" rel="noopener noreferrer" className={rowShell} tabIndex={0}>
          {inner}
        </a>
      ) : (
        <Link href={row.href} className={rowShell} tabIndex={0}>
          {inner}
        </Link>
      )}
    </li>
  )
}

function Group({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: Row[] }) {
  if (!rows.length) return null
  return (
    <section className="mt-8" aria-label={title}>
      <h2 className="mb-4 text-lg font-medium text-white-2">{title}</h2>
      <ul className="grid grid-cols-1 gap-4 min-[768px]:grid-cols-2">
        {rows.map((row) => (
          <ContentRow key={row.key} row={row} icon={icon} />
        ))}
      </ul>
    </section>
  )
}

export function TagPage({ tag, content }: { tag: Tag; content: TagContent }) {
  const postRows: Row[] = content.posts.map((post) => {
    const href = getBlogPostHref(post)
    return {
      key: `post-${post.slug || post.title}`,
      title: post.title,
      description: post.excerpt,
      href: href ?? "/blog",
      external: Boolean(href?.startsWith("http")),
      kind: post.category || "Article",
      meta: post.date,
    }
  })

  const eventRows: Row[] = content.events.map((event) => ({
    key: `event-${event.id}`,
    title: event.title,
    description: event.description || event.highlight,
    href: `/events/${event.slug}`,
    external: false,
    kind: event.category,
    meta: `${formatEventDate(event.date)}${event.location ? ` · ${event.location}` : ""}`,
  }))

  const projectRows: Row[] = content.projects.map((project, index) => {
    const external = project.url.startsWith("http")
    return {
      key: `project-${project.id ?? index}`,
      title: project.title,
      description: project.description,
      href: external ? project.url : "/portfolio",
      external,
      kind: project.category,
    }
  })

  const total = postRows.length + eventRows.length + projectRows.length

  return (
    <article
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="tag-title"
    >
      <nav className="mb-6 text-sm text-light-gray-70" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/tags" className="hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold" tabIndex={0}>
              Tags
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-light-gray">#{tag.label}</li>
        </ol>
      </nav>

      <header className="mb-2">
        <SectionTitle>
          <span id="tag-title">#{tag.label}</span>
        </SectionTitle>
        <p className="mt-3 text-sm font-light text-light-gray">
          {total} {total === 1 ? "item" : "items"} tagged{" "}
          <span className="text-gold">#{tag.label}</span>.
        </p>
      </header>

      <Group title="Articles" icon={<FileText size={13} aria-hidden="true" />} rows={postRows} />
      <Group title="Events" icon={<CalendarDays size={13} aria-hidden="true" />} rows={eventRows} />
      <Group title="Projects" icon={<FolderGit2 size={13} aria-hidden="true" />} rows={projectRows} />

      <footer className="mt-10 border-t border-jet pt-6">
        <Link
          href="/tags"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm text-light-gray-70 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          tabIndex={0}
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Browse all tags
        </Link>
      </footer>
    </article>
  )
}

import type { Metadata } from "next"
import Link from "next/link"
import { Hash } from "lucide-react"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { getTagsWithCounts } from "@/lib/portfolio/tags-repository"
import { buildPageMetadata } from "@/lib/seo"
import {
  buildBreadcrumbJsonLd,
  buildTagsCollectionJsonLd,
  JsonLdScript,
} from "@/lib/seo/jsonld"

export const generateMetadata = (): Metadata =>
  buildPageMetadata({
    title: "Tags",
    description:
      "Browse articles, events, and projects by topic. Explore tags across Siyam Uddin's writing and work.",
    path: "/tags",
    ogTitle: "Tags | Siyam Uddin",
  })

export default async function TagsIndexRoute() {
  const tags = await getTagsWithCounts()

  return (
    <>
      <JsonLdScript data={buildBreadcrumbJsonLd("Tags", "/tags")} />
      {tags.length ? <JsonLdScript data={buildTagsCollectionJsonLd(tags)} /> : null}
      <article
        className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
        aria-labelledby="tags-title"
      >
        <header className="mb-2">
          <SectionTitle>
            <span id="tags-title">Tags</span>
          </SectionTitle>
          <p className="mt-3 text-sm font-light text-light-gray">
            Explore writing, events, and projects by topic.
          </p>
        </header>

        {tags.length ? (
          <ul className="mt-6 flex flex-wrap gap-3" aria-label="All tags">
            {tags.map((tag) => (
              <li key={tag.slug}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-jet bg-onyx px-4 py-2 text-sm text-light-gray transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  tabIndex={0}
                  aria-label={`${tag.label}, ${tag.count} ${tag.count === 1 ? "item" : "items"}`}
                >
                  <Hash size={14} aria-hidden="true" className="text-light-gray-70 group-hover:text-gold" />
                  {tag.label}
                  <span className="rounded-full bg-eerie-black-1 px-2 py-0.5 text-xs text-light-gray-70">
                    {tag.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-8 rounded-xl border border-jet bg-eerie-black-1 p-6 text-sm text-light-gray">
            No tags yet. Tags appear here as soon as published content is tagged.
          </p>
        )}
      </article>
    </>
  )
}

import Link from "next/link"
import type { Tag } from "@/lib/portfolio/tags"

type TagChipsProps = {
  tags: Tag[]
  /** Accessible label for the surrounding list. */
  label?: string
  className?: string
}

/**
 * Crawlable hashtag chips. Each chip links to its `/tags/[slug]` landing page so
 * tags double as internal navigation and SEO entry points.
 */
export const TagChips = ({ tags, label = "Tags", className = "" }: TagChipsProps) => {
  if (!tags.length) return null

  return (
    <ul
      className={`flex flex-wrap gap-2 ${className}`}
      aria-label={label}
    >
      {tags.map((tag) => (
        <li key={tag.slug}>
          <Link
            href={`/tags/${tag.slug}`}
            className="inline-flex min-h-[32px] items-center rounded-full border border-jet bg-onyx px-3 py-1 text-xs font-light text-light-gray transition-colors duration-150 hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label={`View all content tagged ${tag.label}`}
          >
            <span aria-hidden="true" className="mr-0.5 text-light-gray-70">#</span>
            {tag.label}
          </Link>
        </li>
      ))}
    </ul>
  )
}

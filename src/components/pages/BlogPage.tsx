import Image from "next/image"
import Link from "next/link"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { getBlogPostHref } from "@/lib/portfolio/blog"
import type { BlogPost } from "@/lib/types"

const placeholderSrc = (title: string) =>
  `https://placehold.co/800x460/1a1a1e/ffdb70?text=${encodeURIComponent(title.slice(0, 20))}`

type BlogPageProps = {
  blogPosts: BlogPost[]
}

export const BlogPage = ({ blogPosts }: BlogPageProps) => {
  return (
    <article
      id="blog-panel"
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="blog-title"
    >
      <header>
        <SectionTitle as="h1">
          <span id="blog-title">Blog</span>
        </SectionTitle>
      </header>

      <section className="mb-2.5">
        <ul className="grid grid-cols-1 gap-5 min-[580px]:gap-[30px] min-[768px]:grid-cols-2">
          {blogPosts.map((post) => {
            const imageSrc =
              post.image.startsWith("http") || post.image.startsWith("/")
                ? post.image
                : placeholderSrc(post.title)
            const href = getBlogPostHref(post)
            const isExternal = Boolean(href?.startsWith("http"))

            const content = (
              <>
                <figure className="h-[200px] w-full overflow-hidden rounded-xl min-[580px]:rounded-2xl min-[1024px]:h-[230px]">
                  <Image
                    src={imageSrc}
                    alt={post.title}
                    width={800}
                    height={460}
                    sizes="(min-width:768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-250 group-hover:scale-110"
                    unoptimized={imageSrc.includes("placehold.co")}
                  />
                </figure>
                <div className="p-4 min-[580px]:p-[25px]">
                  <div className="mb-2.5 flex items-center justify-start gap-1.5">
                    <p className="text-sm font-light text-light-gray-70 min-[580px]:text-[15px]">
                      {post.category}
                    </p>
                    <span className="h-1 w-1 rounded-full bg-light-gray-70" />
                    <time
                      dateTime={post.dateTime}
                      className="text-sm font-light text-light-gray-70 min-[580px]:text-[15px]"
                    >
                      {post.date}
                    </time>
                  </div>
                  <h3 className="mb-2.5 line-clamp-2 text-lg leading-snug text-white-2 transition-colors group-hover:text-gold">
                    {post.title}
                  </h3>
                  <p className="line-clamp-3 text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
                    {post.excerpt}
                  </p>
                </div>
              </>
            )

            const shellClassName =
              "group relative z-[1] block h-full rounded-2xl bg-gradient-to-br from-[#38383d] to-transparent shadow-[var(--shadow-4)] before:absolute before:inset-px before:-z-[1] before:rounded-[inherit] before:bg-eerie-black-1"

            return (
              <li key={post.slug || post.title}>
                {href && isExternal ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${shellClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`}
                    tabIndex={0}
                    aria-label={`Read blog post: ${post.title}`}
                  >
                    {content}
                  </a>
                ) : href ? (
                  <Link
                    href={href}
                    className={`${shellClassName} focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold`}
                    tabIndex={0}
                    aria-label={`Read blog post: ${post.title}`}
                  >
                    {content}
                  </Link>
                ) : (
                  <article className={shellClassName} aria-label={post.title}>
                    {content}
                  </article>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </article>
  )
}

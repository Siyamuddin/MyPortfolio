import Image from "next/image"
import Link from "next/link"
import { ReadingProgress } from "@/components/blog/ReadingProgress"
import { NativeComments } from "@/components/blog/NativeComments"
import { GiscusComments } from "@/components/blog/GiscusComments"
import {
  getGiscusConfig,
  showGiscusComments,
  showNativeComments,
} from "@/lib/comments/config"
import { TagChips } from "@/components/ui/TagChips"
import { pageShellClassName } from "@/lib/cn"
import type { Tag } from "@/lib/portfolio/tags"
import type { BlogComment, BlogPost } from "@/lib/types"

type BlogArticleProps = {
  post: BlogPost
  content: React.ReactNode
  comments: BlogComment[]
  tags?: Tag[]
}

const placeholderSrc = (title: string) =>
  `https://placehold.co/1200x630/1a1a1e/ffdb70?text=${encodeURIComponent(title.slice(0, 28))}`

export const BlogArticle = ({ post, content, comments, tags = [] }: BlogArticleProps) => {
  const imageSrc =
    post.image.startsWith("http") || post.image.startsWith("/")
      ? post.image
      : placeholderSrc(post.title)
  const nativeEnabled = showNativeComments()
  const giscusEnabled = showGiscusComments() && Boolean(getGiscusConfig())

  return (
    <article
      data-reading-root
      className={pageShellClassName}
      aria-labelledby="article-title"
    >
      <ReadingProgress />
      <nav className="mb-6 text-sm text-light-gray-70 min-[1024px]:mt-16" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/blog"
              className="hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="Back to blog"
            >
              Blog
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-light-gray">{post.title}</li>
        </ol>
      </nav>

      <header className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-light-gray-70">
          <span>{post.category}</span>
          <span className="h-1 w-1 rounded-full bg-light-gray-70" />
          <time dateTime={post.dateTime}>{post.date}</time>
        </div>
        <h1
          id="article-title"
          className="mb-4 text-2xl font-medium leading-tight text-white-2 min-[580px]:text-3xl"
        >
          {post.title}
        </h1>
        <p className="text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
          {post.excerpt}
        </p>
      </header>

      <figure className="mb-8 overflow-hidden rounded-xl">
        <Image
          src={imageSrc}
          alt={post.title}
          width={1200}
          height={630}
          sizes="(min-width:1024px) 950px, 100vw"
          className="h-auto w-full object-cover"
          priority
          unoptimized={imageSrc.includes("placehold.co")}
        />
      </figure>

      <div className="mdx-content">{content}</div>

      {tags.length ? (
        <div className="mt-8 border-t border-jet pt-6">
          <h2 className="mb-3 text-sm font-medium text-white-2">Tags</h2>
          <TagChips tags={tags} label={`Tags for ${post.title}`} />
        </div>
      ) : null}

      {nativeEnabled && post.id ? (
        <NativeComments postId={post.id} comments={comments} />
      ) : null}
      {giscusEnabled ? <GiscusComments slug={post.slug} /> : null}
    </article>
  )
}

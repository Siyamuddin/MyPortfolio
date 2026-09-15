import { ContentImage } from "@/components/ui/ContentImage"
import Link from "next/link"
import { NativeComments } from "@/components/blog/NativeComments"
import { GiscusComments } from "@/components/blog/GiscusComments"
import {
  getGiscusConfig,
  showGiscusComments,
  showNativeComments,
} from "@/lib/comments/config"
import type { BlogComment, BlogPost } from "@/lib/types"

type BlogArticleProps = {
  post: BlogPost
  content: React.ReactNode
  comments: BlogComment[]
}

export const BlogArticle = ({ post, content, comments }: BlogArticleProps) => {
  const nativeEnabled = showNativeComments()
  const giscusEnabled = showGiscusComments() && Boolean(getGiscusConfig())

  return (
    <article
      className="page-content article-page"
      aria-labelledby="article-title"
    >
      <nav className="mb-6 text-sm text-light-gray-70" aria-label="Breadcrumb">
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

      <header className="page-header">
        <div className="meta flex flex-wrap items-center gap-2">
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

      <figure className="project-media article-cover"><ContentImage src={post.image} alt={post.title} sizes="(min-width: 800px) 760px, 100vw" priority /></figure>

      <div className="mdx-content">{content}</div>

      {nativeEnabled && post.id ? (
        <NativeComments postId={post.id} comments={comments} />
      ) : null}
      {giscusEnabled ? <GiscusComments slug={post.slug} /> : null}
    </article>
  )
}

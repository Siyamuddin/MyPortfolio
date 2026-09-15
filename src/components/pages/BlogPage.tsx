import Link from "next/link";
import { ContentImage } from "@/components/ui/ContentImage";
import { getBlogPostHref } from "@/lib/portfolio/blog";
import type { BlogPost } from "@/lib/types";

export const BlogPage = ({ blogPosts }: { blogPosts: BlogPost[] }) => (
  <article className="page-content" aria-labelledby="blog-title">
    <header className="page-header">
      <p className="eyebrow">Writing</p>
      <h1 id="blog-title">Notes from building.</h1>
      <p>Practical lessons on software engineering, AI, and automation.</p>
    </header>
    <ul className="blog-grid">
      {blogPosts
        .filter((post) => post.status === "published")
        .map((post) => {
          const href = getBlogPostHref(post);
          const content = (
            <>
              <figure className="project-media">
                <ContentImage
                  src={post.image}
                  alt={post.title}
                  sizes="(min-width: 1200px) 544px, (min-width: 768px) 50vw, 100vw"
                />
              </figure>
              <p className="meta">
                {post.category} ·{" "}
                <time dateTime={post.dateTime}>{post.date}</time>
              </p>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
            </>
          );
          return (
            <li key={post.slug || post.title}>
              {href ? (
                <Link
                  className="blog-card"
                  href={href}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {content}
                </Link>
              ) : (
                <article className="blog-card">{content}</article>
              )}
            </li>
          );
        })}
    </ul>
    {blogPosts.length === 0 && (
      <p>New articles will appear here when published.</p>
    )}
  </article>
);

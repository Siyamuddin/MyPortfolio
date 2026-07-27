import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"
import { Callout } from "@/components/mdx/Callout"
import { CodeBlock } from "@/components/mdx/CodeBlock"
import { YouTube } from "@/components/mdx/YouTube"

const Heading = ({
  as: Tag,
  className = "",
  ...props
}: ComponentPropsWithoutRef<"h2"> & { as: "h1" | "h2" | "h3" | "h4" }) => (
  <Tag
    className={`scroll-mt-24 font-medium text-white-2 ${className}`}
    {...props}
  />
)

/**
 * Extensible MDX component registry.
 * To add a new npm package for CMS MDX:
 * 1. npm install <package>
 * 2. Add a wrapper under src/components/mdx/
 * 3. Register it here
 * 4. Use <WrapperName /> in admin MDX body
 */
export const mdxComponents: MDXComponents = {
  Callout,
  YouTube,
  CodeBlock,
  h1: (props) => (
    <Heading as="h1" className="mb-4 mt-8 text-2xl min-[580px]:text-3xl" {...props} />
  ),
  h2: (props) => (
    <Heading as="h2" className="mb-3 mt-8 text-xl min-[580px]:text-2xl" {...props} />
  ),
  h3: (props) => (
    <Heading as="h3" className="mb-2 mt-6 text-lg" {...props} />
  ),
  h4: (props) => (
    <Heading as="h4" className="mb-2 mt-4 text-base" {...props} />
  ),
  p: (props) => (
    <p
      className="mb-4 text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]"
      {...props}
    />
  ),
  a: (props) => (
    <a
      className="text-gold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-4 list-disc space-y-2 pl-5 text-sm font-light text-light-gray min-[580px]:text-[15px]"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 list-decimal space-y-2 pl-5 text-sm font-light text-light-gray min-[580px]:text-[15px]"
      {...props}
    />
  ),
  li: (props) => <li className="leading-relaxed" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-2 border-gold pl-4 text-sm italic text-light-gray-70"
      {...props}
    />
  ),
  hr: () => <hr className="my-8 border-jet" />,
  strong: (props) => <strong className="font-medium text-white-2" {...props} />,
  code: ({ children, className, ...props }: ComponentPropsWithoutRef<"code">) => {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      return (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
    return (
      <code
        className="rounded bg-onyx px-1.5 py-0.5 text-[0.9em] text-gold"
        {...props}
      >
        {children}
      </code>
    )
  },
  pre: ({ children, ...props }: ComponentPropsWithoutRef<"pre">) => (
    <CodeBlock {...props}>{children}</CodeBlock>
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm text-light-gray" {...props} />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-jet bg-onyx px-3 py-2 text-left font-medium text-white-2"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-jet px-3 py-2" {...props} />
  ),
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="my-6 h-auto w-full rounded-xl border border-jet"
      alt={props.alt ?? ""}
      {...props}
    />
  ),
}

import { compileMDX } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import rehypeSlug from "rehype-slug"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import { mdxComponents } from "@/components/mdx/registry"

export const renderMdx = async (source: string) => {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "prepend",
              properties: {
                className: ["heading-anchor"],
                ariaLabel: "Link to this section",
              },
              content: { type: "text", value: "#" },
            },
          ],
        ],
      },
    },
  })

  return content
}

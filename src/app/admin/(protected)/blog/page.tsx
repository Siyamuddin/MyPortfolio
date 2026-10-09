import { BlogAdmin } from "@/components/admin/BlogAdmin"
import { getAdminRows } from "@/lib/portfolio/admin-data"
import { getTagRegistry } from "@/lib/portfolio/tags-repository"

export default async function AdminBlogPage() {
  try {
    const [rows, registry] = await Promise.all([getAdminRows(), getTagRegistry()])
    const tagLabels = Object.fromEntries(registry.map((tag) => [tag.slug, tag.label]))
    return <BlogAdmin items={rows?.blogPosts ?? []} tagLabels={tagLabels} />
  } catch (error) {
    return (
      <section className="rounded-2xl border border-jet bg-eerie-black-2 p-6">
        <h2 className="text-2xl font-medium text-white-2">Blog</h2>
        <p className="mt-3 text-sm text-light-gray">Blog posts are not available yet.</p>
        <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-relaxed text-amber-200" role="alert">
          {error instanceof Error ? error.message : "Couldn’t load blog posts. Please try again."}
        </p>
      </section>
    )
  }
}

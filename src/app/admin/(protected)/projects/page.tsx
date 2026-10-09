import { ProjectsAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"
import { getTagRegistry } from "@/lib/portfolio/tags-repository"

export default async function AdminProjectsPage() {
  const [rows, registry] = await Promise.all([getAdminRows(), getTagRegistry()])
  const tagLabels = Object.fromEntries(registry.map((tag) => [tag.slug, tag.label]))
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Projects</h2>
      <ProjectsAdmin items={rows?.projects ?? []} tagLabels={tagLabels} />
    </div>
  )
}

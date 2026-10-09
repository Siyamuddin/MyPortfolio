import { ExperienceAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"

export default async function AdminExperiencePage() {
  const rows = await getAdminRows()
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Experience</h2>
      <ExperienceAdmin items={rows?.experience ?? []} />
    </div>
  )
}

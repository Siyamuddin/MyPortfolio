import { SkillsAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"

export default async function AdminSkillsPage() {
  const rows = await getAdminRows()
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Skills</h2>
      <SkillsAdmin items={rows?.skills ?? []} />
    </div>
  )
}

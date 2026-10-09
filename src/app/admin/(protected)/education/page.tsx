import { EducationAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"

export default async function AdminEducationPage() {
  const rows = await getAdminRows()
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Education</h2>
      <EducationAdmin items={rows?.education ?? []} />
    </div>
  )
}

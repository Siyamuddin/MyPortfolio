import { ProfileAdminForm } from "@/components/admin/ProfileAdminForm"
import { getAdminRows } from "@/lib/portfolio/admin-data"

export default async function AdminProfilePage() {
  const rows = await getAdminRows()

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Profile</h2>
      <ProfileAdminForm
        profile={rows?.profile ?? null}
        events={rows?.events ?? []}
      />
    </div>
  )
}

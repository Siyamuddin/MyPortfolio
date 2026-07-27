import { ProfileAdminForm } from "@/components/admin/ProfileAdminForm"
import { getAdminRows } from "@/lib/portfolio/admin-data"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export default async function AdminProfilePage() {
  if (!isSupabaseConfigured()) {
    return (
      <p className="text-sm text-light-gray">
        Configure Supabase env vars to manage profile content.
      </p>
    )
  }

  const rows = await getAdminRows()

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Profile</h2>
      <ProfileAdminForm profile={rows?.profile ?? null} />
    </div>
  )
}

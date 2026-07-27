import { ServicesAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export default async function AdminServicesPage() {
  if (!isSupabaseConfigured()) {
    return <p className="text-sm text-light-gray">Configure Supabase env vars first.</p>
  }
  const rows = await getAdminRows()
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Services</h2>
      <ServicesAdmin items={rows?.services ?? []} />
    </div>
  )
}

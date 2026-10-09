import { ServicesAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"

export default async function AdminServicesPage() {
  const rows = await getAdminRows()
  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">Services</h2>
      <ServicesAdmin items={rows?.services ?? []} />
    </div>
  )
}

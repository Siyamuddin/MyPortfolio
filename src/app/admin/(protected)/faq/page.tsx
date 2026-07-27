import { FaqAdmin } from "@/components/admin/EntityAdmins"
import { getAdminRows } from "@/lib/portfolio/admin-data"

export default async function AdminFaqPage() {
  const rows = await getAdminRows()

  return (
    <div className="space-y-4">
      <h2 className="text-xl text-white-2">FAQ</h2>
      <p className="text-sm text-light-gray-70">
        Shown on the About page with FAQPage structured data.
      </p>
      <FaqAdmin items={rows?.faqs ?? []} />
    </div>
  )
}

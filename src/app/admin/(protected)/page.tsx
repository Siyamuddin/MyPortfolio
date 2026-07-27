import { DashboardClient } from "@/components/admin/DashboardClient"
import { getAdminRows } from "@/lib/portfolio/admin-data"
import { getPortfolio } from "@/lib/portfolio/repository"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export default async function AdminDashboardPage() {
  const configured = isSupabaseConfigured()
  const portfolio = await getPortfolio()
  const rows = configured ? await getAdminRows() : null

  return (
    <DashboardClient
      source={portfolio.source}
      configured={configured}
      hasProfile={Boolean(rows?.profile)}
      counts={{
        services: rows?.services.length ?? 0,
        skills: rows?.skills.length ?? 0,
        education: rows?.education.length ?? 0,
        experience: rows?.experience.length ?? 0,
        projects: rows?.projects.length ?? 0,
        blogPosts: rows?.blogPosts.length ?? 0,
      }}
      errors={rows?.errors ?? []}
    />
  )
}

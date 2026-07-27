import Link from "next/link"
import { logoutAction } from "@/lib/portfolio/auth-actions"

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/profile", label: "Profile" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/skills", label: "Skills" },
  { href: "/admin/education", label: "Education" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/blog", label: "Blog" },
]

export default function AdminProtectedLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-[#121214] text-white-2">
      <header className="border-b border-jet bg-eerie-black-2">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-light-gray-70">
              Portfolio CMS
            </p>
            <h1 className="text-lg font-medium text-gold">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-light-gray transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="View public site"
            >
              View site
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-lg border border-jet px-3 py-1.5 text-sm text-light-gray transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                aria-label="Sign out"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
        <nav
          className="mx-auto max-w-6xl overflow-x-auto px-4 pb-3"
          aria-label="Admin sections"
        >
          <ul className="flex min-w-max gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg bg-onyx px-3 py-1.5 text-sm text-light-gray transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  tabIndex={0}
                  aria-label={`Manage ${item.label}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

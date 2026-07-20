import { MainShell } from "@/components/layout/MainShell"

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <MainShell>{children}</MainShell>
}

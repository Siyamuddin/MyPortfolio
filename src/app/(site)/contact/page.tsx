import type { Metadata } from "next"
import { ContactPage } from "@/components/pages/ContactPage"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo.contact

export default function ContactRoute() {
  return <ContactPage />
}

import type { Metadata } from "next"
import { ResumePage } from "@/components/pages/ResumePage"
import { pageSeo } from "@/lib/seo"

export const metadata: Metadata = pageSeo.resume

export default function ResumeRoute() {
  return <ResumePage />
}

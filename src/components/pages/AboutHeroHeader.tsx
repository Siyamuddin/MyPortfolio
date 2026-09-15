"use client"

import Link from "next/link"
import { useRef } from "react"
import { Download } from "lucide-react"
import { AgenticNetworkBackground } from "@/components/three/AgenticNetworkBackground"
import { SectionEyebrow } from "@/components/ui/SectionEyebrow"
import { SectionTitle } from "@/components/ui/SectionTitle"
import type { Profile } from "@/lib/types"

type AboutHeroHeaderProps = {
  profile: Profile
  resumeHref: string
}

export const AboutHeroHeader = ({ profile, resumeHref }: AboutHeroHeaderProps) => {
  const pointer = useRef({ x: 0, y: 0 })

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    pointer.current = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    }
  }

  const handlePointerLeave = () => {
    pointer.current = { x: 0, y: 0 }
  }

  return (
    <header
      className="relative mb-8 overflow-hidden rounded-2xl border border-jet/60 bg-eerie-black-1/30 px-1 py-4 min-[580px]:px-2 min-[580px]:py-5"
      aria-labelledby="about-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <AgenticNetworkBackground
        pointer={pointer}
        className="min-h-[260px] opacity-45 min-[768px]:min-h-[300px]"
      />
      <div className="relative z-10">
        <SectionEyebrow>Introduction</SectionEyebrow>
        <SectionTitle as="h1">
          <span id="about-title">About Me</span>
        </SectionTitle>
        <p className="mb-5 text-sm font-medium leading-relaxed text-gold min-[580px]:text-[15px]">
          {profile.title} · AI automation · Production systems · {profile.location}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-smoky-black transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="Contact me for work inquiries"
          >
            Contact me
          </Link>
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-jet px-5 py-2.5 text-sm font-medium text-white-2 transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="Download resume PDF"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download resume
          </a>
          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center rounded-xl px-2 py-2.5 text-sm font-medium text-light-gray-70 underline-offset-2 transition-colors hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="View portfolio projects"
          >
            View projects
          </Link>
        </div>
      </div>
    </header>
  )
}

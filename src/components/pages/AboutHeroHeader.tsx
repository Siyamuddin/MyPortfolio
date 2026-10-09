"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"
import { DeferredNetwork } from "@/components/three/DeferredVisuals"
import { SectionEyebrow } from "@/components/ui/SectionEyebrow"
import { SectionTitle } from "@/components/ui/SectionTitle"
import type { Profile } from "@/lib/types"

type AboutHeroHeaderProps = {
  profile: Profile
  resumeHref: string
}

export const AboutHeroHeader = ({ profile, resumeHref }: AboutHeroHeaderProps) => {
  const pointer = useRef({ x: 0, y: 0 })
  const [showCaret, setShowCaret] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem("hero-caret-shown")) return
      sessionStorage.setItem("hero-caret-shown", "1")
    } catch {
      /* sessionStorage unavailable — just show the caret once this mount. */
    }
    setShowCaret(true)
  }, [])

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
      <DeferredNetwork
        pointer={pointer}
        className="min-h-[260px] opacity-45 min-[768px]:min-h-[300px]"
      />
      <div className="relative z-10">
        <div className="hero-enter" style={{ "--enter-delay": "0ms" } as React.CSSProperties}>
          <SectionEyebrow>Introduction</SectionEyebrow>
        </div>
        <div className="hero-enter" style={{ "--enter-delay": "80ms" } as React.CSSProperties}>
          <SectionTitle>
            <span id="about-title">{profile.name}</span>
            {showCaret ? (
              <span className="hero-caret" aria-hidden="true" />
            ) : null}
          </SectionTitle>
        </div>
        <p
          className="hero-enter mb-5 text-sm font-medium leading-relaxed text-gold min-[580px]:text-[15px]"
          style={{ "--enter-delay": "160ms" } as React.CSSProperties}
        >
          AI automation · Production systems · {profile.location}
        </p>
        <div
          className="hero-enter flex flex-wrap gap-3"
          style={{ "--enter-delay": "240ms" } as React.CSSProperties}
        >
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-smoky-black transition-[transform,box-shadow,opacity] duration-150 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-px hover:opacity-95 hover:shadow-[0_6px_20px_rgba(255,219,112,0.18)] active:scale-[0.98] motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="Contact me for work inquiries"
          >
            Contact me
          </Link>
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-jet px-5 py-2.5 text-sm font-medium text-white-2 transition-colors hover:border-gold/50 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="Download resume PDF"
          >
            <Download
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5 motion-reduce:transform-none"
              aria-hidden="true"
            />
            Download resume
          </a>
          <Link
            href="/portfolio"
            className="group inline-flex items-center justify-center rounded-xl px-2 py-2.5 text-sm font-medium text-light-gray-70 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            tabIndex={0}
            aria-label="View portfolio projects"
          >
            <span className="relative">
              View projects
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 motion-reduce:transition-none motion-reduce:group-hover:scale-x-0"
              />
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}

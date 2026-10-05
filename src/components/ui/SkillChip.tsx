"use client"

import Image from "next/image"
import type { CSSProperties } from "react"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { getSkillMeta } from "@/lib/portfolio/skill-meta"
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll"
import type { Skill } from "@/lib/types"

export const SkillChip = ({ skill, delay = 0 }: { skill: Skill; delay?: number }) => {
  const meta = getSkillMeta(skill.name)
  const id = useId()
  const anchor = useRef<HTMLLIElement>(null)
  const revealRef = useRevealOnScroll()
  const setRefs = (node: HTMLLIElement | null) => {
    anchor.current = node
    revealRef(node)
  }
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const openTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const keepOpen = () => {
    clearTimeout(closeTimer.current)
    clearTimeout(openTimer.current)
  }
  const scheduleClose = () => {
    keepOpen()
    closeTimer.current = setTimeout(() => setPosition(null), 200)
  }
  const show = () => {
    keepOpen()
    const place = () => {
      const rect = anchor.current?.getBoundingClientRect()
      if (!rect) return
      setPosition({ left: Math.max(12, Math.min(rect.left + rect.width / 2 - 104, window.innerWidth - 220)), top: rect.bottom + 8 })
    }
    if (position) {
      place()
      return
    }
    openTimer.current = setTimeout(place, 300)
  }
  useEffect(() => () => {
    clearTimeout(closeTimer.current)
    clearTimeout(openTimer.current)
  }, [])
  useEffect(() => {
    if (!position) return
    const close = () => setPosition(null)
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") close() }
    window.addEventListener("scroll", close, true)
    window.addEventListener("resize", close)
    window.addEventListener("keydown", escape)
    return () => {
      window.removeEventListener("scroll", close, true)
      window.removeEventListener("resize", close)
      window.removeEventListener("keydown", escape)
    }
  }, [position])

  const className = "flex h-16 w-16 items-center justify-center rounded-xl bg-onyx transition-transform duration-200 ease-[cubic-bezier(.22,1,.36,1)] hover:scale-[1.06] motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
  const icon = skill.icon ? <Image src={skill.icon.startsWith("http") || skill.icon.startsWith("/") ? skill.icon : `/images/skills/${skill.icon}.svg`} alt={`${skill.name} logo`} width={32} height={32} unoptimized aria-hidden="true" className="h-8 w-8" /> : <span style={{ color: skill.color }} aria-hidden="true">{skill.name.slice(0, 2)}</span>
  return (
    <li
      ref={setRefs}
      data-reveal
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined}
      onMouseEnter={show}
      onMouseLeave={scheduleClose}
      onFocus={show}
      onBlur={scheduleClose}
    >
      {meta?.url ? <a href={meta.url} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${skill.name} official website`} aria-describedby={position ? id : undefined}>{icon}</a> : <button type="button" className={className} aria-label={skill.name} aria-describedby={position ? id : undefined} onClick={() => position ? setPosition(null) : show()}>{icon}</button>}
      {position ? createPortal(
        <div id={id} role="tooltip" onMouseEnter={keepOpen} onMouseLeave={scheduleClose} className="fixed z-50 w-52 max-w-[calc(100vw-24px)] rounded-xl border border-jet bg-eerie-black-1 p-3 text-center text-xs leading-relaxed text-light-gray shadow-lg motion-safe:animate-[overlayFade_120ms_linear]" style={position}>
          <span className="mb-1 block font-mono text-[11px] font-medium text-white-2">{skill.name}</span>{meta?.description ?? skill.name}
        </div>, document.body
      ) : null}
    </li>
  )
}

"use client"

import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { getSkillMeta } from "@/lib/portfolio/skill-meta"
import type { Skill } from "@/lib/types"

export const SkillChip = ({ skill }: { skill: Skill }) => {
  const meta = getSkillMeta(skill.name)
  const id = useId()
  const anchor = useRef<HTMLLIElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [position, setPosition] = useState<{ left: number; top: number } | null>(null)
  const keepOpen = () => clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    keepOpen()
    closeTimer.current = setTimeout(() => setPosition(null), 200)
  }
  const show = () => {
    keepOpen()
    const rect = anchor.current?.getBoundingClientRect()
    if (!rect) return
    setPosition({ left: Math.max(12, Math.min(rect.left + rect.width / 2 - 104, window.innerWidth - 220)), top: rect.bottom + 8 })
  }
  useEffect(() => () => clearTimeout(closeTimer.current), [])
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

  const className = "flex h-16 w-16 items-center justify-center rounded-xl bg-onyx transition-transform hover:scale-110 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
  const icon = skill.icon ? <Image src={skill.icon.startsWith("http") || skill.icon.startsWith("/") ? skill.icon : `/images/skills/${skill.icon}.svg`} alt="" width={32} height={32} unoptimized className="h-8 w-8" /> : <span style={{ color: skill.color }}>{skill.name.slice(0, 2)}</span>
  return (
    <li ref={anchor} onMouseEnter={show} onMouseLeave={scheduleClose} onFocus={show} onBlur={scheduleClose}>
      {meta?.url ? <a href={meta.url} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${skill.name} official website`} aria-describedby={position ? id : undefined}>{icon}</a> : <button type="button" className={className} aria-label={skill.name} aria-describedby={position ? id : undefined} onClick={() => position ? setPosition(null) : show()}>{icon}</button>}
      {position ? createPortal(
        <div id={id} role="tooltip" onMouseEnter={keepOpen} onMouseLeave={scheduleClose} className="fixed z-50 w-52 max-w-[calc(100vw-24px)] rounded-xl border border-jet bg-eerie-black-1 p-3 text-center text-xs leading-relaxed text-light-gray shadow-lg" style={position}>
          <span className="mb-1 block font-medium text-white-2">{skill.name}</span>{meta?.description ?? skill.name}
        </div>, document.body
      ) : null}
    </li>
  )
}

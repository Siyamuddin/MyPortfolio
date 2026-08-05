"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { cn } from "@/lib/cn"
import { getSkillMeta } from "@/lib/portfolio/skill-meta"
import type { Skill } from "@/lib/types"

const getSkillIconSrc = (icon: string) => {
  if (icon.startsWith("http") || icon.startsWith("/")) return icon
  return `/images/skills/${icon}.svg`
}

type SkillChipProps = {
  skill: Skill
}

export const SkillChip = ({ skill }: SkillChipProps) => {
  const meta = getSkillMeta(skill.name)
  const href = meta?.url
  const description = meta?.description ?? skill.name
  const tooltipId = useId()
  const [open, setOpen] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(hover: none), (pointer: coarse)")
    const syncTouch = () => setIsTouch(media.matches)
    syncTouch()
    media.addEventListener("change", syncTouch)
    return () => media.removeEventListener("change", syncTouch)
  }, [])

  useEffect(() => {
    if (!open) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [open])

  const handleToggle = useCallback(() => {
    setOpen((current) => !current)
  }, [])

  const handleBlur = useCallback((event: React.FocusEvent) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false)
    }
  }, [])

  const chipClassName = cn(
    "group relative flex h-16 w-16 items-center justify-center rounded-xl bg-onyx transition-transform duration-250 hover:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100 hover:border hover:border-gold/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
    open && "border border-gold/30"
  )

  const tooltipClassName = cn(
    "absolute bottom-[calc(100%+10px)] left-1/2 z-20 w-52 -translate-x-1/2 rounded-xl border border-jet bg-eerie-black-1 px-3 py-2 text-center text-xs font-light leading-relaxed text-light-gray shadow-[var(--shadow-2)] transition-all duration-200 motion-reduce:transition-none",
    open
      ? "pointer-events-auto translate-y-0 opacity-100"
      : "pointer-events-none translate-y-1 opacity-0 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100"
  )

  const icon = skill.icon ? (
    <img
      src={getSkillIconSrc(skill.icon)}
      alt=""
      width={32}
      height={32}
      className="h-8 w-8"
      aria-hidden="true"
    />
  ) : (
    <span
      className="text-sm font-semibold tracking-tight"
      style={{ color: skill.color }}
    >
      {skill.name.slice(0, 2).toUpperCase()}
    </span>
  )

  const tooltip = (
    <span id={tooltipId} role="tooltip" className={tooltipClassName}>
      <span className="mb-0.5 block text-[13px] font-medium text-white-2">
        {skill.name}
      </span>
      {description}
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-[11px] font-medium text-gold underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          tabIndex={open ? 0 : -1}
          aria-label={`Visit official ${skill.name} website`}
          onClick={() => setOpen(false)}
        >
          Visit official site
        </a>
      ) : null}
      <span
        className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-r border-b border-jet bg-eerie-black-1"
        aria-hidden="true"
      />
    </span>
  )

  if (href && isTouch) {
    return (
      <li>
        <button
          type="button"
          className={chipClassName}
          aria-label={`${skill.name}: ${description}`}
          aria-describedby={open ? tooltipId : undefined}
          aria-expanded={open}
          onClick={handleToggle}
          onBlur={handleBlur}
        >
          {icon}
          {tooltip}
        </button>
      </li>
    )
  }

  if (href) {
    return (
      <li>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={chipClassName}
          aria-label={`${skill.name}: ${description}. Opens official website.`}
          aria-describedby={tooltipId}
          tabIndex={0}
        >
          {icon}
          {tooltip}
        </a>
      </li>
    )
  }

  return (
    <li
      className={chipClassName}
      aria-label={skill.name}
      aria-describedby={tooltipId}
      tabIndex={0}
    >
      {icon}
      {tooltip}
    </li>
  )
}

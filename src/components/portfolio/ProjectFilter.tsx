"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/cn"

const FILTERS = [
  "All",
  "Web Development",
  "Applications",
  "Automation",
] as const

export type ProjectFilterValue = (typeof FILTERS)[number]

type ProjectFilterProps = {
  value: ProjectFilterValue
  onChange: (value: ProjectFilterValue) => void
}

export const ProjectFilter = ({ value, onChange }: ProjectFilterProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const selectRef = useRef<HTMLDivElement>(null)

  const handleSelect = (next: ProjectFilterValue) => {
    onChange(next)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <>
      <ul className="mb-8 hidden items-center justify-start gap-[25px] pl-1.5 min-[768px]:flex">
        {FILTERS.map((filter) => (
          <li key={filter}>
            <button
              type="button"
              className={cn(
                "text-[15px] text-light-gray transition-colors hover:text-light-gray-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                value === filter && "text-gold"
              )}
              onClick={() => onChange(filter)}
              aria-pressed={value === filter}
              tabIndex={0}
            >
              {filter}
            </button>
          </li>
        ))}
      </ul>

      <div ref={selectRef} className="relative mb-6 min-[768px]:hidden">
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-[14px] border border-jet bg-eerie-black-2 px-4 py-3 text-sm font-light text-light-gray focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
            isOpen && "[&_.select-icon]:rotate-180"
          )}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <span>{value === "All" ? "Select category" : value}</span>
          <span className="select-icon transition-transform">
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </button>

        <ul
          className={cn(
            "absolute top-[calc(100%+6px)] z-[2] w-full rounded-[14px] border border-jet bg-eerie-black-2 p-1.5 transition-all duration-150",
            isOpen
              ? "visible opacity-100"
              : "invisible pointer-events-none opacity-0"
          )}
          role="listbox"
          aria-label="Project category"
        >
          {FILTERS.map((filter) => (
            <li key={filter}>
              <button
                type="button"
                className="w-full rounded-lg px-2.5 py-2 text-left text-sm font-light capitalize text-light-gray hover:bg-[#2f2f33] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                role="option"
                aria-selected={value === filter}
                onClick={() => handleSelect(filter)}
                tabIndex={0}
              >
                {filter}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {value} projects
      </p>
    </>
  )
}

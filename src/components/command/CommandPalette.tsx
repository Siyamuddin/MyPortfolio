"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { useRouter } from "next/navigation"
import {
  ArrowRight,
  Calendar,
  Check,
  Copy,
  Download,
  FileText,
  Hash,
  Search,
} from "lucide-react"
import { navPages } from "@/data/portfolio"
import { useModalDialog } from "@/hooks/useModalDialog"
import { pagePaths } from "@/lib/seo"
import type { NavPage } from "@/lib/types"

export type CommandData = {
  email: string
  resumeHref: string
  events: { title: string; slug: string }[]
  posts: { title: string; href: string }[]
}

type CommandItem = {
  id: string
  label: string
  group: string
  keywords?: string
  icon: typeof ArrowRight
  run: () => void | Promise<void>
  /** Keep the palette open after running (used by Copy email). */
  keepOpen?: boolean
}

type CommandContextValue = {
  open: () => void
  toggle: () => void
}

const CommandPaletteContext = createContext<CommandContextValue | null>(null)

export const useCommandPalette = () => {
  const context = useContext(CommandPaletteContext)
  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider")
  }
  return context
}

export const CommandPaletteProvider = ({
  data,
  children,
}: {
  data: CommandData
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((prev) => !prev), [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const value = useMemo(() => ({ open, toggle }), [open, toggle])

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      {isOpen ? <CommandPalette data={data} onClose={close} /> : null}
    </CommandPaletteContext.Provider>
  )
}

const CommandPalette = ({
  data,
  onClose,
}: {
  data: CommandData
  onClose: () => void
}) => {
  const router = useRouter()
  const dialogRef = useModalDialog()
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const go = useCallback(
    (href: string) => {
      onClose()
      if (href.startsWith("http")) {
        window.open(href, "_blank", "noopener,noreferrer")
        return
      }
      router.push(href)
    },
    [onClose, router]
  )

  const items = useMemo<CommandItem[]>(() => {
    const pageItems: CommandItem[] = navPages.map((page) => ({
      id: `page-${page.id}`,
      label: page.label,
      group: "Pages",
      keywords: page.id,
      icon: ArrowRight,
      run: () => go(pagePaths[page.id as NavPage]),
    }))

    const eventItems: CommandItem[] = data.events.slice(0, 6).map((event) => ({
      id: `event-${event.slug}`,
      label: event.title,
      group: "Events",
      keywords: "event experience",
      icon: Calendar,
      run: () => go(`/events/${event.slug}`),
    }))

    const postItems: CommandItem[] = data.posts.slice(0, 6).map((post) => ({
      id: `post-${post.href}`,
      label: post.title,
      group: "Writing",
      keywords: "blog post article writing",
      icon: Hash,
      run: () => go(post.href),
    }))

    const actionItems: CommandItem[] = [
      {
        id: "action-copy-email",
        label: copied ? "Email copied" : "Copy email",
        group: "Actions",
        keywords: `email ${data.email} contact`,
        icon: copied ? Check : Copy,
        keepOpen: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(data.email)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1400)
          } catch {
            go("/contact")
          }
        },
      },
      {
        id: "action-resume",
        label: "Download resume",
        group: "Actions",
        keywords: "cv resume pdf download",
        icon: Download,
        run: () => go(data.resumeHref),
      },
      {
        id: "action-contact",
        label: "Send a message",
        group: "Actions",
        keywords: "contact email hire",
        icon: FileText,
        run: () => go("/contact"),
      },
    ]

    return [...pageItems, ...eventItems, ...postItems, ...actionItems]
  }, [copied, data, go])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) =>
      `${item.label} ${item.keywords ?? ""}`.toLowerCase().includes(q)
    )
  }, [items, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const runItem = (item: CommandItem | undefined) => {
    if (!item) return
    void item.run()
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((prev) => (prev + 1) % Math.max(filtered.length, 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex(
        (prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1)
      )
    } else if (event.key === "Enter") {
      event.preventDefault()
      runItem(filtered[activeIndex])
    }
  }

  let renderIndex = -1
  const groups = ["Pages", "Events", "Writing", "Actions"].filter((group) =>
    filtered.some((item) => item.group === group)
  )

  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={handleKeyDown}
      className="mx-auto mt-[12vh] mb-auto w-[min(560px,calc(100vw-24px))] max-w-none rounded-2xl border border-jet bg-eerie-black-2/95 p-0 text-light-gray shadow-[var(--shadow-5)] backdrop:bg-black/70 backdrop:backdrop-blur-sm motion-safe:animate-[panelIn_160ms_var(--ease-out)] motion-safe:backdrop:animate-[overlayFade_120ms_linear]"
    >
      <div className="flex items-center gap-3 border-b border-jet px-4 py-3">
        <Search className="h-4 w-4 shrink-0 text-light-gray-70" aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls="command-list"
          aria-activedescendant={
            filtered[activeIndex] ? `cmd-${filtered[activeIndex].id}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          placeholder="Jump to a page, event, or action…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-transparent text-sm text-white-2 placeholder:text-light-gray-70 focus:outline-none"
        />
        <kbd className="hidden rounded-md border border-jet bg-onyx px-1.5 py-0.5 font-mono text-[10px] text-light-gray-70 min-[580px]:inline">
          ESC
        </kbd>
      </div>

      <ul
        id="command-list"
        role="listbox"
        aria-label="Commands"
        className="max-h-[52vh] overflow-y-auto p-2"
      >
        {groups.map((group) => (
          <li key={group} role="presentation">
            <p className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-light-gray-70">
              {`// ${group}`}
            </p>
            <ul role="presentation">
              {filtered
                .filter((item) => item.group === group)
                .map((item) => {
                  renderIndex += 1
                  const index = renderIndex
                  const isActive = index === activeIndex
                  const Icon = item.icon
                  return (
                    <li
                      key={item.id}
                      id={`cmd-${item.id}`}
                      role="option"
                      aria-selected={isActive}
                      onMouseMove={() => setActiveIndex(index)}
                      onClick={() => runItem(item)}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        isActive
                          ? "bg-onyx text-white-2"
                          : "text-light-gray hover:text-white-2"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 ${
                          isActive ? "text-gold" : "text-light-gray-70"
                        }`}
                        aria-hidden="true"
                      />
                      <span className="truncate">{item.label}</span>
                    </li>
                  )
                })}
            </ul>
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-light-gray-70">
            No matches for{" "}
            <span className="font-mono text-light-gray">{query}</span>
          </li>
        ) : null}
      </ul>
    </dialog>
  )
}

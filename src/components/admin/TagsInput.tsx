"use client"

import { useMemo, useState, type KeyboardEvent } from "react"
import { X } from "lucide-react"
import { MAX_TAGS_PER_ITEM, normalizeTag, type Tag } from "@/lib/portfolio/tags"

type TagsInputProps = {
  /** Serialized under this form field name as a JSON array of labels. */
  name?: string
  label?: string
  defaultTags?: Tag[]
}

/**
 * Admin tag editor. Emits a JSON array of labels under a hidden field; the
 * server action slugifies, dedupes and syncs the shared tag registry.
 */
export const TagsInput = ({ name = "tags", label = "Tags", defaultTags = [] }: TagsInputProps) => {
  const [tags, setTags] = useState<Tag[]>(() => {
    const seen = new Set<string>()
    return defaultTags.filter((tag) => {
      if (seen.has(tag.slug)) return false
      seen.add(tag.slug)
      return true
    })
  })
  const [draft, setDraft] = useState("")

  const serialized = useMemo(() => JSON.stringify(tags.map((tag) => tag.label)), [tags])

  const addDraft = () => {
    const next = normalizeTag(draft)
    setDraft("")
    if (!next) return
    setTags((current) => {
      if (current.length >= MAX_TAGS_PER_ITEM || current.some((tag) => tag.slug === next.slug)) {
        return current
      }
      return [...current, next]
    })
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      addDraft()
      return
    }
    if (event.key === "Backspace" && !draft && tags.length) {
      setTags((current) => current.slice(0, -1))
    }
  }

  const removeTag = (slug: string) =>
    setTags((current) => current.filter((tag) => tag.slug !== slug))

  return (
    <div className="block text-sm text-light-gray-70">
      <span>
        {label}{" "}
        <span className="text-xs text-light-gray-70/70">
          ({tags.length}/{MAX_TAGS_PER_ITEM})
        </span>
      </span>
      <input type="hidden" name={name} value={serialized} readOnly />
      <div className="mt-1 flex flex-wrap gap-2 rounded-lg border border-jet bg-onyx px-3 py-2 focus-within:border-gold">
        {tags.map((tag) => (
          <span
            key={tag.slug}
            className="inline-flex items-center gap-1 rounded-full border border-jet bg-eerie-black-1 px-2.5 py-1 text-xs text-white-2"
          >
            {tag.label}
            <button
              type="button"
              onClick={() => removeTag(tag.slug)}
              className="text-light-gray-70 hover:text-red-400 focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold"
              aria-label={`Remove tag ${tag.label}`}
              tabIndex={0}
            >
              <X size={13} aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addDraft}
          disabled={tags.length >= MAX_TAGS_PER_ITEM}
          placeholder={tags.length ? "Add another…" : "e.g. hackathon, seoul"}
          className="min-w-[8rem] flex-1 bg-transparent text-white-2 outline-none placeholder:text-light-gray-70/60 disabled:opacity-50"
          aria-label={`Add a ${label.toLowerCase().replace(/s$/, "")}`}
          tabIndex={0}
        />
      </div>
      <small className="mt-1 block text-xs text-light-gray-70/70">
        Press Enter or comma to add. Tags become crawlable <code>/tags</code> pages.
      </small>
    </div>
  )
}

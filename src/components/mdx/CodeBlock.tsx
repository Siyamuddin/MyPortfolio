"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { Check, Copy } from "lucide-react"

type CodeBlockProps = {
  children?: ReactNode
  className?: string
}

const readText = (node: ReactNode): string => {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(readText).join("")
  if (node && typeof node === "object" && "props" in node) {
    const props = node.props as { children?: ReactNode }
    return readText(props.children)
  }
  return ""
}

export const CodeBlock = ({ children, className = "" }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(readText(children).replace(/\n$/, ""))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1400)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="group/code relative my-6">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy code"}
        className="absolute top-2 right-2 inline-flex h-8 items-center gap-1.5 rounded-lg border border-jet bg-onyx/90 px-2 font-mono text-[11px] text-light-gray-70 opacity-100 transition-colors hover:border-gold/40 hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold min-[768px]:opacity-0 min-[768px]:group-hover/code:opacity-100 min-[768px]:focus-visible:opacity-100"
      >
        {copied ? (
          <Check className="h-3.5 w-3.5 text-diff-green" aria-hidden="true" />
        ) : (
          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span className="transition-opacity duration-150">{copied ? "Copied" : "Copy"}</span>
      </button>
      <pre
        className={`overflow-x-auto rounded-xl border border-jet bg-eerie-black-1 p-4 pr-16 text-sm text-white-2 ${className}`}
      >
        <code>{children}</code>
      </pre>
    </div>
  )
}

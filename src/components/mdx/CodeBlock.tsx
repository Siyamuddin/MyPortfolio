import type { ReactNode } from "react"

type CodeBlockProps = {
  children?: ReactNode
  className?: string
}

export const CodeBlock = ({ children, className = "" }: CodeBlockProps) => (
  <pre
    className={`my-6 overflow-x-auto rounded-xl border border-jet bg-eerie-black-1 p-4 text-sm text-white-2 ${className}`}
  >
    <code>{children}</code>
  </pre>
)

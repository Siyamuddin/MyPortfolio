import type { ReactNode } from "react"

type CalloutProps = {
  type?: "info" | "warn" | "tip"
  title?: string
  children?: ReactNode
}

const calloutStyles: Record<NonNullable<CalloutProps["type"]>, string> = {
  info: "border-sky-500/40 bg-sky-500/10",
  warn: "border-amber-500/40 bg-amber-500/10",
  tip: "border-emerald-500/40 bg-emerald-500/10",
}

export const Callout = ({ type = "info", title, children }: CalloutProps) => (
  <aside
    className={`my-6 rounded-xl border px-4 py-3 text-sm leading-relaxed text-light-gray ${calloutStyles[type]}`}
    role="note"
    aria-label={title ?? `${type} callout`}
  >
    {title ? (
      <p className="mb-1 font-medium text-white-2">{title}</p>
    ) : null}
    <div className="[&_p]:mb-0">{children}</div>
  </aside>
)

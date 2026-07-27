"use client"

import { useState, useTransition } from "react"
import {
  seedFromStaticAction,
} from "@/lib/portfolio/admin-actions"
import type { ActionResult } from "@/lib/portfolio/auth-actions"

type DashboardClientProps = {
  source: "supabase" | "static"
  configured: boolean
  hasProfile: boolean
  counts: {
    services: number
    skills: number
    education: number
    experience: number
    projects: number
    blogPosts: number
  }
  errors: string[]
}

export const DashboardClient = ({
  source,
  configured,
  hasProfile,
  counts,
  errors,
}: DashboardClientProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSeed = () => {
    startTransition(async () => {
      const result: ActionResult = await seedFromStaticAction()
      setMessage(
        result.ok
          ? "Seeded successfully from static portfolio data."
          : result.error ?? "Seed failed"
      )
    })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-jet bg-eerie-black-2 p-6">
        <h2 className="mb-2 text-xl text-white-2">Dashboard</h2>
        <p className="text-sm text-light-gray">
          Public site data source:{" "}
          <span className="text-gold">{source}</span>
          {!configured
            ? " (Supabase env vars missing — using static fallback)"
            : !hasProfile
              ? " (no profile row yet — public site still uses static fallback until you seed or create a profile)"
              : ""}
        </p>
      </section>

      {errors.length > 0 ? (
        <section className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
          <p className="mb-2 font-medium">Supabase errors</p>
          <ul className="list-disc pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(counts).map(([key, value]) => (
          <div
            key={key}
            className="rounded-2xl border border-jet bg-eerie-black-2 p-4"
          >
            <p className="text-xs uppercase tracking-wide text-light-gray-70">
              {key}
            </p>
            <p className="mt-1 text-2xl text-gold">{value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-jet bg-eerie-black-2 p-6">
        <h3 className="mb-2 text-lg text-white-2">Import from static</h3>
        <p className="mb-4 text-sm text-light-gray">
          Replace all CMS rows with the current{" "}
          <code className="text-gold">src/data/portfolio.ts</code> content.
          Requires <code className="text-gold">SUPABASE_SERVICE_ROLE_KEY</code>.
        </p>
        <button
          type="button"
          onClick={handleSeed}
          disabled={isPending || !configured}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-eerie-black-1 transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Seed database from static portfolio data"
          tabIndex={0}
        >
          {isPending ? "Seeding…" : "Seed from static data"}
        </button>
        {message ? (
          <p className="mt-3 text-sm text-light-gray" role="status">
            {message}
          </p>
        ) : null}
      </section>
    </div>
  )
}

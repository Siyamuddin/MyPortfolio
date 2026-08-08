"use client"

import { useCallback, useEffect, useState } from "react"
import { BookOpenCheck, ShieldCheck } from "lucide-react"
import { ErrorState } from "@/components/finance/ErrorState"
import { SeverityBadge } from "@/components/finance/SeverityBadge"
import { FinanceSubNav } from "@/components/finance/FinanceSubNav"
import { Skeleton } from "@/components/ui/Skeleton"
import { getGuidelines } from "@/lib/finance/client-api"
import type { Guideline } from "@/lib/finance/types"

const GuidelinesSkeleton = () => (
  <div
    className="space-y-4"
    aria-busy="true"
    aria-label="Loading guidelines"
  >
    <Skeleton className="h-24 w-full" />
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
      <Skeleton className="h-44" />
    </div>
  </div>
)

export default function FinanceGuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getGuidelines()
      setGuidelines(data)
      setError(null)
    } catch (err) {
      setGuidelines([])
      setError(
        err instanceof Error ? err.message : "Failed to load guidelines"
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void (async () => {
      await load()
    })()
  }, [load])

  if (loading) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Guidelines
            </h1>
            <p className="text-sm text-light-gray-70">
              Operating rules from the Finance agent
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <GuidelinesSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Guidelines
            </h1>
            <p className="text-sm text-light-gray-70">
              Operating rules from the Finance agent
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <ErrorState
          message={error}
          onRetry={() => {
            setLoading(true)
            void load()
          }}
        />
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight text-white-2">
            Guidelines
          </h1>
          <p className="text-sm text-light-gray-70">
            Operating rules from the Finance agent
          </p>
        </div>
        <FinanceSubNav />
      </div>

      <aside
        className="flex gap-3 rounded-xl border border-jet bg-eerie-black-2/70 p-4"
        aria-label="Finance officer's rules"
      >
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold"
          aria-hidden="true"
        >
          <ShieldCheck className="size-5" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-medium text-white-2">
            Finance officer&apos;s rules
          </p>
          <p className="text-sm text-light-gray-70">
            These guidelines are authored by the Finance agent and pin the
            budget caps, remittance policy, emergency-fund plan, and hard
            deadlines. Treat them as the source of truth when spending
            decisions conflict with impulse.
          </p>
        </div>
      </aside>

      {guidelines.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-jet bg-eerie-black-2/70 px-6 py-16 text-center">
          <BookOpenCheck
            className="size-8 text-light-gray-70"
            aria-hidden="true"
          />
          <p className="text-sm font-medium text-white-2">No guidelines yet</p>
          <p className="max-w-sm text-sm text-light-gray-70">
            Guidelines will appear here once the Finance agent publishes them.
          </p>
        </div>
      ) : (
        <ul
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
          aria-label="Guideline cards"
        >
          {guidelines.map((guideline) => (
            <li
              key={guideline.id}
              className="flex flex-col gap-3 rounded-xl border border-jet bg-eerie-black-2/70 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-sm font-medium leading-snug text-white-2">
                  {guideline.title}
                </h2>
                <SeverityBadge severity={guideline.severity} />
              </div>
              <p className="text-sm leading-relaxed text-light-gray-70">
                {guideline.body}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

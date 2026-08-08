"use client"

import { useCallback, useEffect, useState } from "react"
import { CheckCircle2, Circle, Scale } from "lucide-react"
import { ErrorState } from "@/components/finance/ErrorState"
import { FinanceSubNav } from "@/components/finance/FinanceSubNav"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { Skeleton } from "@/components/ui/Skeleton"
import { getObligations, toggleObligation } from "@/lib/finance/client-api"
import type { Obligation } from "@/lib/finance/types"
import { formatDate, formatKRW, formatPercent } from "@/lib/finance/format"
import { cn } from "@/lib/cn"

const ObligationsSkeleton = () => (
  <div
    className="space-y-4"
    aria-busy="true"
    aria-label="Loading obligations"
  >
    <Skeleton className="h-28 w-full" />
    <div className="grid gap-3 md:grid-cols-2">
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
      <Skeleton className="h-40" />
    </div>
  </div>
)

export default function FinanceObligationsPage() {
  const [obligations, setObligations] = useState<Obligation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pendingId, setPendingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await getObligations()
      setObligations(data)
      setError(null)
    } catch (err) {
      setObligations([])
      setError(
        err instanceof Error ? err.message : "Failed to load obligations"
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

  const handleToggle = async (id: string) => {
    setPendingId(id)
    setError(null)

    try {
      const updated = await toggleObligation(id)
      setObligations((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      )
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update obligation"
      )
    } finally {
      setPendingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Obligations
            </h1>
            <p className="text-sm text-light-gray-70">
              Priority payments and loan paydowns
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <ObligationsSkeleton />
      </div>
    )
  }

  if (error && obligations.length === 0) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Obligations
            </h1>
            <p className="text-sm text-light-gray-70">
              Priority payments and loan paydowns
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

  const sorted = [...obligations].sort((a, b) => a.priority - b.priority)
  const totalAmount = sorted.reduce((sum, item) => sum + item.amount, 0)
  const unpaidAmount = sorted
    .filter((item) => !item.paid)
    .reduce((sum, item) => sum + item.amount, 0)
  const paidCount = sorted.filter((item) => item.paid).length
  const clearedPercent =
    sorted.length === 0 ? 0 : (paidCount / sorted.length) * 100

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight text-white-2">
            Obligations
          </h1>
          <p className="text-sm text-light-gray-70">
            Priority payments and loan paydowns
          </p>
        </div>
        <FinanceSubNav />
      </div>

      {error ? (
        <div
          className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      <section
        className="grid gap-3 rounded-xl border border-jet bg-eerie-black-2/70 p-4 sm:grid-cols-3"
        aria-label="Obligations summary"
      >
        <div>
          <p className="text-xs tracking-wide text-light-gray-70 uppercase">
            Total obligations
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-white-2">
            {formatKRW(totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-light-gray-70 uppercase">
            Total unpaid
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-red-400">
            {formatKRW(unpaidAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs tracking-wide text-light-gray-70 uppercase">
            Cleared
          </p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-gold">
            {formatPercent(clearedPercent, 0)}
          </p>
          <p className="text-xs text-light-gray-70">
            {paidCount} of {sorted.length} paid
          </p>
        </div>
      </section>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-jet bg-eerie-black-2/70 px-6 py-16 text-center">
          <Scale className="size-8 text-light-gray-70" aria-hidden="true" />
          <p className="text-sm font-medium text-white-2">No obligations yet</p>
          <p className="max-w-sm text-sm text-light-gray-70">
            When obligations are added to the data store, they will appear here
            in priority order.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2" aria-label="Obligation list">
          {sorted.map((item) => {
            const progressValue = item.paid ? 100 : 0
            const isPending = pendingId === item.id

            return (
              <li
                key={item.id}
                className={cn(
                  "rounded-xl border border-jet bg-eerie-black-2/70 p-4",
                  item.paid && "opacity-90"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.paid ? (
                        <CheckCircle2
                          className="size-4 shrink-0 text-gold"
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="size-4 shrink-0 text-light-gray-70"
                          aria-hidden="true"
                        />
                      )}
                      <h2
                        className={cn(
                          "truncate text-sm font-medium text-white-2",
                          item.paid && "text-light-gray-70 line-through"
                        )}
                      >
                        {item.name}
                      </h2>
                    </div>
                    <p className="font-mono text-xl font-semibold tabular-nums text-white-2">
                      {formatKRW(item.amount)}
                    </p>
                    <p className="text-xs text-light-gray-70">
                      Due {formatDate(item.dueDate)} · Priority {item.priority}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className={
                      item.paid
                        ? "border-gold/30 bg-gold/15 text-gold"
                        : "border-jet bg-onyx text-light-gray"
                    }
                  >
                    {item.paid ? "Paid" : "Unpaid"}
                  </Badge>
                </div>

                <div className="mt-4">
                  <Progress value={progressValue} className="w-full" />
                </div>

                <div className="mt-4">
                  <Button
                    type="button"
                    variant={item.paid ? "outline" : "default"}
                    size="sm"
                    disabled={isPending}
                    onClick={() => void handleToggle(item.id)}
                    aria-label={
                      item.paid
                        ? `Mark ${item.name} unpaid`
                        : `Mark ${item.name} paid`
                    }
                    tabIndex={0}
                  >
                    {isPending
                      ? "Updating…"
                      : item.paid
                        ? "Mark unpaid"
                        : "Mark paid"}
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

"use client"

import { useCallback, useEffect, useState, type KeyboardEvent } from "react"
import { AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react"
import { BudgetBars } from "@/components/finance/BudgetBars"
import { AddSpendDialog } from "@/components/finance/AddSpendDialog"
import { ErrorState } from "@/components/finance/ErrorState"
import { FinanceSubNav } from "@/components/finance/FinanceSubNav"
import { Button } from "@/components/ui/Button"
import { Skeleton } from "@/components/ui/Skeleton"
import { budgetStatus } from "@/lib/finance/calculations"
import { getConfig, getSpends } from "@/lib/finance/client-api"
import type { FinanceConfig, SpendEntry } from "@/lib/finance/types"
import { formatDate, formatKRW, monthKey, todayISO } from "@/lib/finance/format"
import {
  formatMonthLabel,
  shiftMonthKey,
  sumSpendEntries,
  toBudgetBarData,
} from "@/lib/finance/spend-utils"

type SpendPageData = {
  config: FinanceConfig
  spends: SpendEntry[]
}

const SpendSkeleton = () => (
  <div
    className="space-y-4"
    aria-busy="true"
    aria-label="Loading spend tracker"
  >
    <Skeleton className="h-24 w-full" />
    <Skeleton className="h-64 w-full" />
    <Skeleton className="h-72 w-full" />
  </div>
)

export default function FinanceSpendPage() {
  const [month, setMonth] = useState(() => monthKey(todayISO()))
  const [data, setData] = useState<SpendPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const [config, spends] = await Promise.all([
        getConfig(),
        getSpends(month),
      ])
      setData({ config, spends })
      setError(null)
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : "Failed to load spends")
    } finally {
      setLoading(false)
    }
  }, [month])

  useEffect(() => {
    void (async () => {
      await load()
    })()
  }, [load])

  const handlePrevMonth = () => {
    setLoading(true)
    setMonth((prev) => shiftMonthKey(prev, -1))
  }

  const handleNextMonth = () => {
    setLoading(true)
    setMonth((prev) => shiftMonthKey(prev, 1))
  }

  const handleKeyPrev = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handlePrevMonth()
    }
  }

  const handleKeyNext = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleNextMonth()
    }
  }

  if (loading && !data) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Spend Tracker
            </h1>
            <p className="text-sm text-light-gray-70">
              Daily category spend for the selected month
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <SpendSkeleton />
      </div>
    )
  }

  if ((error && !data) || (!loading && !data)) {
    return (
      <div className="min-w-0 space-y-4 overflow-x-hidden">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-white-2">
              Spend Tracker
            </h1>
            <p className="text-sm text-light-gray-70">
              Daily category spend for the selected month
            </p>
          </div>
          <FinanceSubNav />
        </div>
        <ErrorState
          message={error ?? undefined}
          onRetry={() => {
            setLoading(true)
            void load()
          }}
        />
      </div>
    )
  }

  const config = data!.config
  const spends = data!.spends
  const totals = sumSpendEntries(spends)
  const status = budgetStatus(config, totals)
  const remaining = status.overall.remaining
  const foodOver = status.categories.foodDaily.percentUsed > 100
  const totalOver = status.overall.percentUsed > 100
  const overspend = foodOver || totalOver
  const sorted = [...spends].sort((a, b) => b.date.localeCompare(a.date))
  const budgetBars = toBudgetBarData(config, totals)

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-medium tracking-tight text-white-2">
            Spend Tracker
          </h1>
          <p className="text-sm text-light-gray-70">
            Daily category spend for the selected month
          </p>
        </div>
        <div className="flex flex-col items-stretch gap-3 sm:items-end">
          <FinanceSubNav />
          <AddSpendDialog
            onSaved={() => {
              setLoading(true)
              void load()
            }}
            defaultMonth={month}
          />
        </div>
      </div>

      <section
        className="flex flex-col gap-4 rounded-xl border border-jet bg-eerie-black-2/70 p-4 sm:flex-row sm:items-center sm:justify-between"
        aria-label="Month summary"
      >
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handlePrevMonth}
            onKeyDown={handleKeyPrev}
            aria-label="Previous month"
            tabIndex={0}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
          <p className="min-w-[9.5rem] text-center text-sm font-medium tabular-nums text-white-2">
            {formatMonthLabel(month)}
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            onKeyDown={handleKeyNext}
            aria-label="Next month"
            tabIndex={0}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-6">
          <div>
            <p className="text-xs tracking-wide text-light-gray-70 uppercase">
              Total spent
            </p>
            <p className="font-mono text-xl font-semibold tabular-nums text-white-2">
              {formatKRW(totals.total)}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wide text-light-gray-70 uppercase">
              Remaining vs budget
            </p>
            <p
              className={`font-mono text-xl font-semibold tabular-nums ${
                remaining < 0 ? "text-red-400" : "text-gold"
              }`}
            >
              {formatKRW(remaining)}
            </p>
            <p className="text-xs text-light-gray-70">
              Cap {formatKRW(config.totalMonthlyBudget)}
            </p>
          </div>
        </div>
      </section>

      {overspend ? (
        <div
          className="flex items-start gap-3 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-300"
          role="alert"
        >
          <AlertTriangle
            className="mt-0.5 size-4 shrink-0"
            aria-hidden="true"
          />
          <div>
            <p className="font-medium">Overspend alert</p>
            <p className="text-red-300/90">
              {foodOver && totalOver
                ? "Food daily and overall monthly budget caps are exceeded."
                : foodOver
                  ? "Food daily spend exceeds the monthly food cap."
                  : "Total spend exceeds the monthly budget cap."}
            </p>
          </div>
        </div>
      ) : null}

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-jet bg-eerie-black-2/70 px-6 py-16 text-center">
          <p className="text-sm font-medium text-white-2">No entries yet</p>
          <p className="max-w-sm text-sm text-light-gray-70">
            Add a spend for {formatMonthLabel(month)} to start tracking this
            month.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-jet bg-eerie-black-2/70">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-jet text-xs uppercase tracking-wide text-light-gray-70">
                <th className="px-3 py-3 font-medium">Date</th>
                <th className="px-3 py-3 text-right font-medium">Food</th>
                <th className="px-3 py-3 text-right font-medium">Transport</th>
                <th className="px-3 py-3 text-right font-medium">Shopping</th>
                <th className="px-3 py-3 text-right font-medium">Subs</th>
                <th className="px-3 py-3 text-right font-medium">Remit</th>
                <th className="px-3 py-3 text-right font-medium">Other</th>
                <th className="px-3 py-3 text-right font-medium">Total</th>
                <th className="px-3 py-3 font-medium">Note</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry) => (
                <tr key={entry.date} className="border-b border-jet/60">
                  <td className="px-3 py-2.5 font-medium text-white-2">
                    {formatDate(entry.date)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-light-gray">
                    {formatKRW(entry.food)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-light-gray">
                    {formatKRW(entry.transport)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-light-gray">
                    {formatKRW(entry.shopping)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-light-gray">
                    {formatKRW(entry.subscriptions)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-light-gray">
                    {formatKRW(entry.remittance)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-light-gray">
                    {formatKRW(entry.other)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono font-semibold tabular-nums text-gold">
                    {formatKRW(entry.total)}
                  </td>
                  <td className="max-w-[12rem] truncate px-3 py-2.5 text-light-gray-70">
                    {entry.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BudgetBars data={budgetBars} height={280} />
    </div>
  )
}

import { budgetStatus, type MonthTotals } from "@/lib/finance/calculations"
import type {
  BudgetBarDatum,
  BudgetCaps,
  FinanceConfig,
  SpendEntry,
} from "@/lib/finance/types"
import { todayISO } from "@/lib/finance/format"

const SPEND_CATEGORY_KEYS = [
  "food",
  "transport",
  "shopping",
  "subscriptions",
  "remittance",
  "other",
] as const

export const emptyMonthTotals = (): MonthTotals => ({
  food: 0,
  transport: 0,
  shopping: 0,
  subscriptions: 0,
  remittance: 0,
  other: 0,
  total: 0,
})

/** Sums all entries in the array (caller should pass month-filtered spends). */
export const sumSpendEntries = (spends: SpendEntry[]): MonthTotals => {
  const totals = emptyMonthTotals()

  for (const entry of spends) {
    for (const key of SPEND_CATEGORY_KEYS) {
      totals[key] += entry[key]
    }
    totals.total += entry.total
  }

  return totals
}

const BUDGET_LABELS: Record<keyof BudgetCaps, string> = {
  rent: "Rent",
  utilities: "Utilities",
  transport: "Transport",
  phone: "Phone",
  foodDaily: "Food",
  subscriptions: "Subs",
}

export const toBudgetBarData = (
  config: FinanceConfig,
  totals: MonthTotals
): BudgetBarDatum[] => {
  const status = budgetStatus(config, totals)

  return (Object.keys(config.budgetCaps) as (keyof BudgetCaps)[]).map(
    (key) => ({
      category: BUDGET_LABELS[key],
      spent: status.categories[key].spent,
      cap: status.categories[key].cap,
    })
  )
}

export const shiftMonthKey = (month: string, delta: number): string => {
  const [yearRaw, monthRaw] = month.split("-")
  const year = Number(yearRaw)
  const monthIndex = Number(monthRaw) - 1

  if (!Number.isFinite(year) || !Number.isFinite(monthIndex)) {
    return month
  }

  const date = new Date(year, monthIndex + delta, 1)
  const nextYear = date.getFullYear()
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0")
  return `${nextYear}-${nextMonth}`
}

export const formatMonthLabel = (month: string): string => {
  const date = new Date(`${month}-01T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return month
  }

  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export const buildFourteenDayTrend = (
  spends: SpendEntry[]
): { date: string; total: number }[] => {
  const byDate = new Map<string, number>()
  for (const entry of spends) {
    byDate.set(entry.date, (byDate.get(entry.date) ?? 0) + entry.total)
  }

  const today = new Date(`${todayISO()}T00:00:00`)
  const points: { date: string; total: number }[] = []

  for (let offset = 13; offset >= 0; offset -= 1) {
    const day = new Date(today)
    day.setDate(today.getDate() - offset)
    const year = day.getFullYear()
    const month = String(day.getMonth() + 1).padStart(2, "0")
    const date = String(day.getDate()).padStart(2, "0")
    const iso = `${year}-${month}-${date}`
    points.push({ date: iso, total: byDate.get(iso) ?? 0 })
  }

  return points
}

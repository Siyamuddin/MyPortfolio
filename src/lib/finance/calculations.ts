import type { BudgetCaps, FinanceConfig, SpendEntry } from "@/lib/finance/types"

export type MonthTotals = {
  food: number
  transport: number
  shopping: number
  subscriptions: number
  remittance: number
  other: number
  total: number
}

export type CategoryBudgetStatus = {
  cap: number
  spent: number
  remaining: number
  percentUsed: number
}

export type BudgetStatus = {
  categories: Record<keyof BudgetCaps, CategoryBudgetStatus>
  overall: CategoryBudgetStatus
}

export type EfProgress = {
  target: number
  seeded: number
  percent: number
}

const SPEND_CATEGORY_KEYS = [
  "food",
  "transport",
  "shopping",
  "subscriptions",
  "remittance",
  "other",
] as const

type SpendCategoryKey = (typeof SPEND_CATEGORY_KEYS)[number]

const emptyMonthTotals = (): MonthTotals => ({
  food: 0,
  transport: 0,
  shopping: 0,
  subscriptions: 0,
  remittance: 0,
  other: 0,
  total: 0,
})

const currentMonthPrefix = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

const buildCategoryStatus = (
  cap: number,
  spent: number
): CategoryBudgetStatus => {
  const remaining = cap - spent
  const percentUsed = cap === 0 ? 0 : (spent / cap) * 100

  return {
    cap,
    spent,
    remaining,
    percentUsed,
  }
}

const spentForBudgetCap = (
  key: keyof BudgetCaps,
  monthTotals: MonthTotals
): number => {
  switch (key) {
    case "foodDaily":
      return monthTotals.food
    case "transport":
      return monthTotals.transport
    case "subscriptions":
      return monthTotals.subscriptions
    case "rent":
    case "utilities":
    case "phone":
      return 0
    default: {
      const _exhaustive: never = key
      return _exhaustive
    }
  }
}

export const monthlyTotals = (spends: SpendEntry[]): MonthTotals => {
  const prefix = currentMonthPrefix()
  const totals = emptyMonthTotals()

  for (const entry of spends) {
    if (!entry.date.startsWith(prefix)) {
      continue
    }

    for (const key of SPEND_CATEGORY_KEYS) {
      totals[key] += entry[key]
    }
    totals.total += entry.total
  }

  return totals
}

export const budgetStatus = (
  config: FinanceConfig,
  monthTotals: MonthTotals
): BudgetStatus => {
  const categories = {} as Record<keyof BudgetCaps, CategoryBudgetStatus>

  for (const key of Object.keys(config.budgetCaps) as (keyof BudgetCaps)[]) {
    const cap = config.budgetCaps[key]
    const spent = spentForBudgetCap(key, monthTotals)
    categories[key] = buildCategoryStatus(cap, spent)
  }

  return {
    categories,
    overall: buildCategoryStatus(
      config.totalMonthlyBudget,
      monthTotals.total
    ),
  }
}

export const moneyLeftThisMonth = (
  config: FinanceConfig,
  monthTotals: MonthTotals
): number => config.monthlyIncome - monthTotals.total

export const efProgress = (config: FinanceConfig): EfProgress => {
  const target = config.emergencyFundTarget
  const seeded = config.emergencyFundSeed
  const percent = target === 0 ? 0 : (seeded / target) * 100

  return {
    target,
    seeded,
    percent,
  }
}

export const daysUntil = (dateStr: string): number => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(`${dateStr}T00:00:00`)
  const diffMs = target.getTime() - today.getTime()

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

export const computeSpendTotal = (
  entry: Pick<SpendEntry, SpendCategoryKey>
): number =>
  SPEND_CATEGORY_KEYS.reduce((sum, key) => sum + entry[key], 0)

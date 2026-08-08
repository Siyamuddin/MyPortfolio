import { createServiceClient } from "@/lib/supabase/admin"
import { isSupabaseConfigured } from "@/lib/supabase/env"
import type {
  BudgetCaps,
  FinanceConfig,
  Guideline,
  Obligation,
  SpendEntry,
} from "@/lib/finance/types"

type SpendRow = {
  date: string
  food: number | null
  transport: number | null
  shopping: number | null
  subscriptions: number | null
  remittance: number | null
  other: number | null
  total: number | null
  note: string | null
}

type ConfigRow = {
  currency: string | null
  monthly_income: number | null
  budget_caps: unknown
  total_monthly_budget: number | null
  emergency_fund_target: number | null
  emergency_fund_seed: number | null
  hero_metric: string | null
  tuition_due: string | null
  tuition_amount: number | null
  passport_cost: number | null
}

type ObligationRow = {
  id: string
  name: string | null
  amount: number | null
  paid: boolean | null
  due_date: string | null
  priority: number | null
}

type GuidelineRow = {
  id: string
  title: string | null
  body: string | null
  severity: string | null
}

const emptyBudgetCaps = (): BudgetCaps => ({
  rent: 0,
  utilities: 0,
  transport: 0,
  phone: 0,
  foodDaily: 0,
  subscriptions: 0,
})

const asNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const mapBudgetCaps = (raw: unknown): BudgetCaps => {
  if (!raw || typeof raw !== "object") return emptyBudgetCaps()
  const caps = raw as Record<string, unknown>
  return {
    rent: asNumber(caps.rent),
    utilities: asNumber(caps.utilities),
    transport: asNumber(caps.transport),
    phone: asNumber(caps.phone),
    foodDaily: asNumber(caps.foodDaily ?? caps.food_daily),
    subscriptions: asNumber(caps.subscriptions),
  }
}

const mapSpend = (row: SpendRow): SpendEntry => ({
  date: row.date,
  food: asNumber(row.food),
  transport: asNumber(row.transport),
  shopping: asNumber(row.shopping),
  subscriptions: asNumber(row.subscriptions),
  remittance: asNumber(row.remittance),
  other: asNumber(row.other),
  total: asNumber(row.total),
  note: row.note ?? "",
})

const mapConfig = (row: ConfigRow): FinanceConfig => ({
  currency: row.currency ?? "KRW",
  monthlyIncome: asNumber(row.monthly_income),
  budgetCaps: mapBudgetCaps(row.budget_caps),
  totalMonthlyBudget: asNumber(row.total_monthly_budget),
  emergencyFundTarget: asNumber(row.emergency_fund_target),
  emergencyFundSeed: asNumber(row.emergency_fund_seed),
  heroMetric: row.hero_metric ?? "moneyLeftThisMonth",
  tuitionDue: row.tuition_due ?? "",
  tuitionAmount: asNumber(row.tuition_amount),
  passportCost: asNumber(row.passport_cost),
})

const mapObligation = (row: ObligationRow): Obligation => ({
  id: row.id,
  name: row.name ?? "",
  amount: asNumber(row.amount),
  paid: Boolean(row.paid),
  dueDate: row.due_date ?? "",
  priority: asNumber(row.priority),
})

const mapGuideline = (row: GuidelineRow): Guideline => ({
  id: row.id,
  title: row.title ?? "",
  body: row.body ?? "",
  severity: row.severity ?? "info",
})

const getAdminOrNull = () => {
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }

  try {
    return createServiceClient()
  } catch {
    return null
  }
}

const monthBounds = (month: string): { start: string; endExclusive: string } | null => {
  const match = /^(\d{4})-(\d{2})$/.exec(month)
  if (!match) return null

  const year = Number(match[1])
  const monthIndex = Number(match[2])
  if (!Number.isFinite(year) || monthIndex < 1 || monthIndex > 12) return null

  const start = `${match[1]}-${match[2]}-01`
  const nextYear = monthIndex === 12 ? year + 1 : year
  const nextMonth = monthIndex === 12 ? 1 : monthIndex + 1
  const endExclusive = `${nextYear}-${String(nextMonth).padStart(2, "0")}-01`
  return { start, endExclusive }
}

export const computeSpendTotal = (entry: {
  food?: number
  transport?: number
  shopping?: number
  subscriptions?: number
  remittance?: number
  other?: number
}): number =>
  asNumber(entry.food) +
  asNumber(entry.transport) +
  asNumber(entry.shopping) +
  asNumber(entry.subscriptions) +
  asNumber(entry.remittance) +
  asNumber(entry.other)

export const getSpends = async (month?: string): Promise<SpendEntry[]> => {
  const admin = getAdminOrNull()
  if (!admin) return []

  try {
    let query = admin
      .from("finance_spends")
      .select(
        "date, food, transport, shopping, subscriptions, remittance, other, total, note"
      )
      .order("date", { ascending: true })

    if (month) {
      const bounds = monthBounds(month)
      if (!bounds) return []
      query = query.gte("date", bounds.start).lt("date", bounds.endExclusive)
    }

    const { data, error } = await query
    if (error || !data) return []
    return (data as SpendRow[]).map(mapSpend)
  } catch {
    return []
  }
}

export type UpsertSpendInput = {
  date: string
  food?: number
  transport?: number
  shopping?: number
  subscriptions?: number
  remittance?: number
  other?: number
  note?: string
}

export const upsertSpend = async (
  entry: UpsertSpendInput
): Promise<SpendEntry | null> => {
  const admin = getAdminOrNull()
  if (!admin) return null

  const food = asNumber(entry.food)
  const transport = asNumber(entry.transport)
  const shopping = asNumber(entry.shopping)
  const subscriptions = asNumber(entry.subscriptions)
  const remittance = asNumber(entry.remittance)
  const other = asNumber(entry.other)
  const total = computeSpendTotal({
    food,
    transport,
    shopping,
    subscriptions,
    remittance,
    other,
  })

  const row = {
    date: entry.date,
    food,
    transport,
    shopping,
    subscriptions,
    remittance,
    other,
    total,
    note: entry.note ?? "",
    updated_at: new Date().toISOString(),
  }

  try {
    const { data, error } = await admin
      .from("finance_spends")
      .upsert(row, { onConflict: "date" })
      .select(
        "date, food, transport, shopping, subscriptions, remittance, other, total, note"
      )
      .single()

    if (error || !data) return null
    return mapSpend(data as SpendRow)
  } catch {
    return null
  }
}

export const getConfig = async (): Promise<FinanceConfig | null> => {
  const admin = getAdminOrNull()
  if (!admin) return null

  try {
    const { data, error } = await admin
      .from("finance_config")
      .select(
        "currency, monthly_income, budget_caps, total_monthly_budget, emergency_fund_target, emergency_fund_seed, hero_metric, tuition_due, tuition_amount, passport_cost"
      )
      .eq("id", 1)
      .maybeSingle()

    if (error || !data) return null
    return mapConfig(data as ConfigRow)
  } catch {
    return null
  }
}

export const updateConfig = async (
  partial: Partial<FinanceConfig>
): Promise<FinanceConfig | null> => {
  const admin = getAdminOrNull()
  if (!admin) return null

  try {
    const existing = await getConfig()
    const payload = {
      id: 1,
      currency: partial.currency ?? existing?.currency ?? "KRW",
      monthly_income:
        partial.monthlyIncome ?? existing?.monthlyIncome ?? 0,
      budget_caps: partial.budgetCaps ?? existing?.budgetCaps ?? emptyBudgetCaps(),
      total_monthly_budget:
        partial.totalMonthlyBudget ?? existing?.totalMonthlyBudget ?? 0,
      emergency_fund_target:
        partial.emergencyFundTarget ?? existing?.emergencyFundTarget ?? 0,
      emergency_fund_seed:
        partial.emergencyFundSeed ?? existing?.emergencyFundSeed ?? 0,
      hero_metric:
        partial.heroMetric ?? existing?.heroMetric ?? "moneyLeftThisMonth",
      tuition_due: partial.tuitionDue ?? existing?.tuitionDue ?? "",
      tuition_amount: partial.tuitionAmount ?? existing?.tuitionAmount ?? 0,
      passport_cost: partial.passportCost ?? existing?.passportCost ?? 0,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await admin
      .from("finance_config")
      .upsert(payload, { onConflict: "id" })
      .select(
        "currency, monthly_income, budget_caps, total_monthly_budget, emergency_fund_target, emergency_fund_seed, hero_metric, tuition_due, tuition_amount, passport_cost"
      )
      .single()

    if (error || !data) return null
    return mapConfig(data as ConfigRow)
  } catch {
    return null
  }
}

export const getObligations = async (): Promise<Obligation[]> => {
  const admin = getAdminOrNull()
  if (!admin) return []

  try {
    const { data, error } = await admin
      .from("finance_obligations")
      .select("id, name, amount, paid, due_date, priority")
      .order("priority", { ascending: true })

    if (error || !data) return []
    return (data as ObligationRow[]).map(mapObligation)
  } catch {
    return []
  }
}

export const toggleObligation = async (
  id: string
): Promise<Obligation | null> => {
  const admin = getAdminOrNull()
  if (!admin) return null

  try {
    const { data: existing, error: readError } = await admin
      .from("finance_obligations")
      .select("id, name, amount, paid, due_date, priority")
      .eq("id", id)
      .maybeSingle()

    if (readError || !existing) return null

    const current = existing as ObligationRow
    const { data, error } = await admin
      .from("finance_obligations")
      .update({
        paid: !Boolean(current.paid),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("id, name, amount, paid, due_date, priority")
      .single()

    if (error || !data) return null
    return mapObligation(data as ObligationRow)
  } catch {
    return null
  }
}

export const getGuidelines = async (): Promise<Guideline[]> => {
  const admin = getAdminOrNull()
  if (!admin) return []

  try {
    const { data, error } = await admin
      .from("finance_guidelines")
      .select("id, title, body, severity")
      .order("id", { ascending: true })

    if (error || !data) return []
    return (data as GuidelineRow[]).map(mapGuideline)
  } catch {
    return []
  }
}

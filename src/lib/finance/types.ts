export type SpendEntry = {
  date: string
  food: number
  transport: number
  shopping: number
  subscriptions: number
  remittance: number
  other: number
  total: number
  note: string
}

export type BudgetCaps = {
  rent: number
  utilities: number
  transport: number
  phone: number
  foodDaily: number
  subscriptions: number
}

export type FinanceConfig = {
  currency: string
  monthlyIncome: number
  budgetCaps: BudgetCaps
  totalMonthlyBudget: number
  emergencyFundTarget: number
  emergencyFundSeed: number
  heroMetric: string
  tuitionDue: string
  tuitionAmount: number
  passportCost: number
}

export type Obligation = {
  id: string
  name: string
  amount: number
  paid: boolean
  dueDate: string
  priority: number
}

export type Guideline = {
  id: string
  title: string
  body: string
  severity: string
}

export type BudgetBarDatum = {
  category: string
  spent: number
  cap: number
}

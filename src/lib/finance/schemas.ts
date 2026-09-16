import { z } from "zod"

const number = z.number().finite()
export const spendSchema = z.object({
  date: z.string(), food: number, transport: number, shopping: number,
  subscriptions: number, remittance: number, other: number, total: number, note: z.string(),
})
export const configSchema = z.object({
  currency: z.string(), monthlyIncome: number,
  budgetCaps: z.object({ rent: number, utilities: number, transport: number, phone: number, foodDaily: number, subscriptions: number }),
  totalMonthlyBudget: number, emergencyFundTarget: number, emergencyFundSeed: number,
  heroMetric: z.string(), tuitionDue: z.string(), tuitionAmount: number, passportCost: number,
})
export const obligationSchema = z.object({
  id: z.string(), name: z.string(), amount: number, paid: z.boolean(), dueDate: z.string(), priority: number,
})
export const guidelineSchema = z.object({ id: z.string(), title: z.string(), body: z.string(), severity: z.string() })

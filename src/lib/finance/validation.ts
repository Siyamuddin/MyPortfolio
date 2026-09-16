import { z } from "zod"

export const monthSchema = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/)
  .refine((value) => Number(value.slice(0, 4)) >= 1, "Enter a valid year")

export const dateSchema = z.iso.date()
  .refine((value) => Number(value.slice(0, 4)) >= 1, "Enter a valid year")

export const amountSchema = z.coerce.number().finite().nonnegative()

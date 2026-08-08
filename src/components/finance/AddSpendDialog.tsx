"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CheckCircle2, Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Dialog } from "@/components/ui/Dialog"
import { postSpend } from "@/lib/finance/client-api"
import { todayISO } from "@/lib/finance/format"
import { fieldClassName } from "@/components/admin/AdminForm"

const amountField = z
  .number({ error: "Must be a number" })
  .min(0, "Must be ≥ 0")
  .finite()

const spendSchema = z.object({
  date: z.string().min(1, "Date is required"),
  food: amountField,
  transport: amountField,
  shopping: amountField,
  subscriptions: amountField,
  remittance: amountField,
  other: amountField,
  note: z.string().optional(),
})

type SpendFormValues = z.infer<typeof spendSchema>

const AMOUNT_FIELDS = [
  { name: "food", label: "Food" },
  { name: "transport", label: "Transport" },
  { name: "shopping", label: "Shopping" },
  { name: "subscriptions", label: "Subscriptions" },
  { name: "remittance", label: "Remittance" },
  { name: "other", label: "Other" },
] as const

type AddSpendDialogProps = {
  onSaved: () => void
  defaultMonth?: string
}

export const AddSpendDialog = ({
  onSaved,
  defaultMonth,
}: AddSpendDialogProps) => {
  const [open, setOpen] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const defaultDate =
    defaultMonth && /^\d{4}-\d{2}$/.test(defaultMonth)
      ? `${defaultMonth}-01`
      : todayISO()

  const form = useForm<SpendFormValues>({
    resolver: zodResolver(spendSchema),
    defaultValues: {
      date: defaultDate,
      food: 0,
      transport: 0,
      shopping: 0,
      subscriptions: 0,
      remittance: 0,
      other: 0,
      note: "",
    },
  })

  const handleOpenChange = (next: boolean) => {
    if (next) {
      form.reset({
        date: defaultDate,
        food: 0,
        transport: 0,
        shopping: 0,
        subscriptions: 0,
        remittance: 0,
        other: 0,
        note: "",
      })
      setSubmitError(null)
      setSuccess(false)
    }
    setOpen(next)
  }

  const handleSubmit = form.handleSubmit(async (values) => {
    setSubmitError(null)
    setSuccess(false)

    try {
      await postSpend({
        date: values.date,
        food: values.food,
        transport: values.transport,
        shopping: values.shopping,
        subscriptions: values.subscriptions,
        remittance: values.remittance,
        other: values.other,
        note: values.note ?? "",
      })
      setSuccess(true)
      onSaved()
      window.setTimeout(() => {
        setOpen(false)
      }, 700)
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to save spend entry"
      )
    }
  })

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      title="Add spend"
      description="Log a daily entry. Saving the same date replaces the existing row."
      trigger={
        <Button
          type="button"
          onClick={() => handleOpenChange(true)}
          aria-label="Add spend entry"
          tabIndex={0}
        >
          <Plus className="size-4" aria-hidden="true" />
          Add spend
        </Button>
      }
    >
      <form className="grid gap-3" onSubmit={handleSubmit} noValidate>
        <div className="grid gap-1.5">
          <label htmlFor="spend-date" className="text-sm text-light-gray-70">
            Date
          </label>
          <input
            id="spend-date"
            type="date"
            className={fieldClassName}
            aria-invalid={Boolean(form.formState.errors.date)}
            {...form.register("date")}
          />
          {form.formState.errors.date ? (
            <p className="text-xs text-red-400" role="alert">
              {form.formState.errors.date.message}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-3">
          {AMOUNT_FIELDS.map((field) => (
            <div key={field.name} className="grid gap-1.5">
              <label
                htmlFor={`spend-${field.name}`}
                className="text-sm text-light-gray-70"
              >
                {field.label}
              </label>
              <input
                id={`spend-${field.name}`}
                type="number"
                min={0}
                step={1}
                inputMode="numeric"
                className={fieldClassName}
                aria-invalid={Boolean(form.formState.errors[field.name])}
                {...form.register(field.name, {
                  valueAsNumber: true,
                  setValueAs: (value) => {
                    if (
                      value === "" ||
                      value === null ||
                      value === undefined
                    ) {
                      return 0
                    }
                    const parsed = Number(value)
                    return Number.isFinite(parsed) ? parsed : 0
                  },
                })}
              />
            </div>
          ))}
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="spend-note" className="text-sm text-light-gray-70">
            Note
          </label>
          <textarea
            id="spend-note"
            rows={2}
            placeholder="Optional note"
            className={fieldClassName}
            {...form.register("note")}
          />
        </div>

        {submitError ? (
          <p className="text-sm text-red-400" role="alert">
            {submitError}
          </p>
        ) : null}

        {success ? (
          <p
            className="inline-flex items-center gap-1.5 text-sm text-gold"
            role="status"
          >
            <CheckCircle2 className="size-4" aria-hidden="true" />
            Saved successfully
          </p>
        ) : null}

        <div className="mt-2 flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            aria-label="Cancel add spend"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            aria-label="Save spend entry"
          >
            {form.formState.isSubmitting ? "Saving…" : "Save entry"}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

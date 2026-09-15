/** Omit partial dates instead of inventing a publication day or time. */
export const isoDate = (value?: string) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(value)) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  if (value.length === 10) return date.toISOString().slice(0, 10) === value ? value : undefined
  return date.toISOString()
}

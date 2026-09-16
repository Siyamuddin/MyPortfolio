// Keep server-rendered and hydrated text identical regardless of host locale or
// browser time zone. Label UTC explicitly so the displayed time is unambiguous.
export const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (!Number.isFinite(date.getTime())) return "Unknown date"
  return `${date.toISOString().slice(0, 16).replace("T", " ")} UTC`
}

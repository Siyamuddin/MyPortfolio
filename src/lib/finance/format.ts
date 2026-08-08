const krwFormatter = new Intl.NumberFormat("en-KR", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
})

const percentFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
})

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
})

export const formatKRW = (n: number): string => {
  const safe = Number.isFinite(n) ? Math.round(n) : 0
  return `₩${krwFormatter.format(safe)}`
}

export const formatPercent = (n: number, digits = 1): string => {
  const safe = Number.isFinite(n) ? n : 0
  if (digits === 1) {
    return `${percentFormatter.format(safe)}%`
  }

  return `${safe.toFixed(digits)}%`
}

export const formatDate = (dateStr: string): string => {
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) {
    return dateStr
  }

  return dateFormatter.format(date)
}

export const todayISO = (): string => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export const monthKey = (dateStr: string): string => {
  if (dateStr.length >= 7) {
    return dateStr.slice(0, 7)
  }

  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) {
    return dateStr
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  return `${year}-${month}`
}

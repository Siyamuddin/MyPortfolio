"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/env"

export type ActionResult = {
  ok: boolean
  error?: string
  url?: string
}

export const requireAdmin = async () => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured")
  }

  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error("Unauthorized")
  }

  return { supabase, user }
}

export const loginAction = async (
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> => {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured. Add env vars first." }
  }

  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { ok: false, error: "Email and password are required" }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { ok: false, error: error.message }
  }

  redirect("/admin")
}

export const logoutAction = async () => {
  if (!isSupabaseConfigured()) {
    redirect("/admin/login")
  }

  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

export const revalidatePortfolio = async () => {
  revalidatePath("/", "layout")
  revalidatePath("/admin", "layout")
}

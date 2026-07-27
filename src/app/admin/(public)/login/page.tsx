"use client"

import { useActionState } from "react"
import {
  loginAction,
  type ActionResult,
} from "@/lib/portfolio/auth-actions"

const initialState: ActionResult = { ok: false }

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(
    loginAction,
    initialState
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#121214] px-4">
      <form
        action={formAction}
        className="w-full max-w-md rounded-[20px] border border-jet bg-eerie-black-2 p-8 shadow-[var(--shadow-1)]"
        aria-label="Admin login"
      >
        <h1 className="mb-2 text-2xl font-medium text-white-2">Admin login</h1>
        <p className="mb-6 text-sm text-light-gray">
          Sign in with your Supabase admin account.
        </p>

        <label className="mb-4 block text-sm text-light-gray-70">
          Email
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"
            aria-label="Email"
            tabIndex={0}
          />
        </label>

        <label className="mb-6 block text-sm text-light-gray-70">
          Password
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-jet bg-onyx px-3 py-2 text-white-2 outline-none focus:border-gold"
            aria-label="Password"
            tabIndex={0}
          />
        </label>

        {state?.error ? (
          <p className="mb-4 text-sm text-red-400" role="alert">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-eerie-black-1 transition-opacity hover:opacity-90 disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Sign in"
        >
          {isPending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}

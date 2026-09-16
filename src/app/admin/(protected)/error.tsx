"use client"

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <section role="alert" className="rounded-xl border border-jet p-6 text-light-gray">
      <h2 className="mb-2 text-xl text-white-2">This page could not be loaded</h2>
      <p>Your data may be temporarily unavailable. Please try again.</p>
      <button onClick={reset} className="mt-4 min-h-11 rounded-lg border border-gold px-4 text-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold">Try again</button>
    </section>
  )
}

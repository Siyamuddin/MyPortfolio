"use client"

export default function EventsError({ reset }: { reset: () => void }) {
  return (
    <section className="rounded-[20px] border border-jet bg-eerie-black-2 px-6 py-24 text-center" aria-labelledby="events-error-title">
      <h1 id="events-error-title" className="text-2xl text-white-2">Events are taking a little longer to load.</h1>
      <p className="mt-3 text-sm text-light-gray">Please try again in a moment.</p>
      <button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full bg-gold px-6 text-sm font-medium text-smoky-black">Try again</button>
    </section>
  )
}

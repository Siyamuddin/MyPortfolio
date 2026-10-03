import { EventsAdmin } from "@/components/admin/EventsAdmin"
import { getAdminEvents } from "@/lib/portfolio/events-repository"

export default async function AdminEventsPage() {
  try {
    const events = await getAdminEvents()
    return <EventsAdmin items={events} />
  } catch (error) {
    return (
      <section className="rounded-2xl border border-jet bg-eerie-black-2 p-6">
        <h2 className="text-2xl font-medium text-white-2">Events</h2>
        <p className="mt-3 text-sm text-light-gray">Events are not available yet.</p>
        <p className="mt-3 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-relaxed text-amber-200" role="alert">
          {error instanceof Error ? error.message : "Couldn’t load events. Please try again."}
        </p>
      </section>
    )
  }
}

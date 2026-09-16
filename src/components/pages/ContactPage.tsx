import { SectionTitle } from "@/components/ui/SectionTitle"
import { ContactForm } from "@/components/contact/ContactForm"

export const ContactPage = ({ email }: { email: string }) => {
  return (
    <article
      id="contact-panel"
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="contact-title"
    >
      <header>
        <SectionTitle as="h1">
          <span id="contact-title">Contact</span>
        </SectionTitle>
      </header>

      <section>
        <h2 className="mb-5 text-lg capitalize text-white-2">Send Message</h2>
        <ContactForm />
        <p className="mt-5 text-sm text-light-gray">Prefer email? <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center text-gold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-gold">{email}</a></p>
      </section>
    </article>
  )
}

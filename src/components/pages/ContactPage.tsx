import { SectionTitle } from "@/components/ui/SectionTitle"
import { pageShellClassName } from "@/lib/cn"
import { ContactForm } from "@/components/contact/ContactForm"

export const ContactPage = ({ email }: { email: string }) => {
  return (
    <article
      id="contact-panel"
      className={`${pageShellClassName} min-[1250px]:min-h-full`}
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

import { SectionTitle } from "@/components/ui/SectionTitle"
import { ContactForm } from "@/components/contact/ContactForm"

export const ContactPage = () => {
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
        <h3 className="mb-5 text-lg capitalize text-white-2">Send Message</h3>
        <ContactForm />
      </section>
    </article>
  )
}

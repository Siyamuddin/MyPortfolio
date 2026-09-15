import { ContactForm } from "@/components/contact/ContactForm";
import type { Profile } from "@/lib/types";

export const ContactPage = ({ profile }: { profile: Profile }) => (
  <article className="page-content" aria-labelledby="contact-title">
    <header className="page-header">
      <p className="eyebrow">Start a conversation</p>
      <h1 id="contact-title">What are you working on?</h1>
      <p>
        A new product, a workflow that takes too long, or an existing
        application that needs attention. Tell me about it.
      </p>
    </header>
    <div className="contact-layout">
      <aside className="contact-aside">
        <h2>A little context goes a long way.</h2>
        <p>
          Share your goal, what you have so far, and your ideal timeline. If you
          have a budget in mind, include it too.
        </p>
        <p>Prefer email?</p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
        </a>
        <p className="meta">{profile.location}</p>
      </aside>
      <ContactForm />
    </div>
  </article>
);

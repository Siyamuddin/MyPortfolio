import { Plus } from "lucide-react";
import type { Faq } from "@/lib/types";

export const FaqAccordion = ({ faqs }: { faqs: Faq[] }) =>
  faqs.length === 0 ? null : (
    <section className="site-section faq-section" aria-labelledby="faq-title">
      <div>
        <p className="eyebrow">Before we get started</p>
        <h2 id="faq-title">Common questions.</h2>
      </div>
      <div>
        {faqs.map((faq, index) => (
          <details key={faq.id ?? index} className="faq-item">
            <summary>
              {faq.question}
              <Plus size={20} aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );

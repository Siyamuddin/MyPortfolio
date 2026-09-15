"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { SectionTitle } from "@/components/ui/SectionTitle"
import type { Faq } from "@/lib/types"

type FaqAccordionProps = {
  faqs: Faq[]
}

export const FaqAccordion = ({ faqs }: FaqAccordionProps) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? "0")

  if (faqs.length === 0) return null

  const handleToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id))
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    id: string
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleToggle(id)
    }
  }

  return (
    <section className="mt-10 mb-2" aria-labelledby="faq-title">
      <SectionTitle as="h3">
        <span id="faq-title">FAQ</span>
      </SectionTitle>
      <ul className="space-y-3">
        {faqs.map((faq, index) => {
          const id = faq.id ?? String(index)
          const isOpen = openId === id

          return (
            <li
              key={id}
              className="overflow-hidden rounded-xl border border-jet bg-eerie-black-1"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-white-2 transition-colors hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${id}`}
                id={`faq-button-${id}`}
                tabIndex={0}
                onClick={() => handleToggle(id)}
                onKeyDown={(event) => handleKeyDown(event, id)}
              >
                <span className="text-sm font-medium min-[580px]:text-[15px]">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-gold transition-transform ${isOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-panel-${id}`}
                role="region"
                aria-labelledby={`faq-button-${id}`}
                hidden={!isOpen}
                className="border-t border-jet px-4 py-3 text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]"
              >
                {faq.answer}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

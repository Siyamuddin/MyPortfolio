type SectionEyebrowProps = {
  children: React.ReactNode
}

export const SectionEyebrow = ({ children }: SectionEyebrowProps) => (
  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold min-[580px]:text-xs">
    {children}
  </p>
)

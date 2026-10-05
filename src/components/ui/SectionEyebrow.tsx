type SectionEyebrowProps = {
  children: React.ReactNode
}

export const SectionEyebrow = ({ children }: SectionEyebrowProps) => (
  <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold min-[580px]:text-xs">
    <span aria-hidden="true" className="font-mono font-normal normal-case tracking-normal text-gold/60">
      {"//"}
    </span>
    {children}
  </p>
)

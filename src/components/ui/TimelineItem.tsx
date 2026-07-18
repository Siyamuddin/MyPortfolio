type TimelineItemProps = {
  title: string
  period: string
  children?: React.ReactNode
}

export const TimelineItem = ({ title, period, children }: TimelineItemProps) => {
  return (
    <li className="relative mb-5 last:mb-0 before:absolute before:top-[-25px] before:left-[-30px] before:h-[calc(100%+50px)] before:w-px before:bg-jet last:before:hidden after:absolute after:top-[5px] after:left-[-33px] after:h-1.5 after:w-1.5 after:rounded-full after:bg-gradient-to-r after:from-gold after:to-gold-dark after:shadow-[0_0_0_4px_var(--jet)] min-[580px]:before:left-[-40px] min-[580px]:after:left-[-43px] min-[580px]:after:h-2 min-[580px]:after:w-2">
      <h4 className="mb-1.5 text-sm leading-snug text-white-2 min-[580px]:text-[15px]">
        {title}
      </h4>
      <span className="font-normal leading-relaxed text-gold">{period}</span>
      {children ? (
        <div className="mt-1 font-light leading-relaxed text-light-gray min-[1250px]:max-w-[700px]">
          {children}
        </div>
      ) : null}
    </li>
  )
}

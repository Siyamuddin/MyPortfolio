import { cn } from "@/lib/cn"
import type { Skill } from "@/lib/types"

type SkillChipProps = {
  skill: Skill
}

export const SkillChip = ({ skill }: SkillChipProps) => {
  const label = skill.name.slice(0, 2).toUpperCase()

  return (
    <li
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-xl bg-onyx text-[28px] transition-transform duration-250 hover:scale-110"
      )}
      style={{ color: skill.color }}
      title={skill.name}
      aria-label={skill.name}
    >
      <span className="text-sm font-semibold tracking-tight">{label}</span>
    </li>
  )
}

import { cn } from "@/lib/cn"
import type { Skill } from "@/lib/types"

const getSkillIconSrc = (icon: string) => {
  if (icon.startsWith("http") || icon.startsWith("/")) return icon
  return `/images/skills/${icon}.svg`
}

type SkillChipProps = {
  skill: Skill
}

export const SkillChip = ({ skill }: SkillChipProps) => {
  return (
    <li
      className={cn(
        "flex h-16 w-16 items-center justify-center rounded-xl bg-onyx transition-transform duration-250 hover:scale-110"
      )}
      title={skill.name}
      aria-label={skill.name}
    >
      {skill.icon ? (
        <img
          src={getSkillIconSrc(skill.icon)}
          alt=""
          width={32}
          height={32}
          className="h-8 w-8"
          aria-hidden="true"
        />
      ) : (
        <span
          className="text-sm font-semibold tracking-tight"
          style={{ color: skill.color }}
        >
          {skill.name.slice(0, 2).toUpperCase()}
        </span>
      )}
    </li>
  )
}

import { SkillChip } from "@/components/ui/SkillChip"
import { groupSkills } from "@/lib/portfolio/skill-groups"
import type { Skill } from "@/lib/types"

type SkillsGridProps = {
  skills: Skill[]
}

export const SkillsGrid = ({ skills }: SkillsGridProps) => {
  const groups = groupSkills(skills)
  let flatIndex = -1

  return (
    <div className="space-y-8">
      {groups.map((group) => (
        <div key={group.label}>
          <h3 className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-light-gray-70 min-[580px]:text-left">
            {group.label}
          </h3>
          <ul className="flex flex-wrap items-center justify-center gap-4 min-[580px]:justify-start">
            {group.skills.map((skill) => {
              flatIndex += 1
              return (
                <SkillChip
                  key={skill.name}
                  skill={skill}
                  delay={Math.min(flatIndex * 30, 400)}
                />
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

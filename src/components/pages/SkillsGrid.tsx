import { groupSkills } from "@/lib/portfolio/skill-groups";
import type { Skill } from "@/lib/types";

export const SkillsGrid = ({ skills }: { skills: Skill[] }) => (
  <dl className="skills-list">
    {groupSkills(skills).map((group) => (
      <div key={group.label}>
        <dt>{group.label}</dt>
        <dd>{group.skills.map((skill) => skill.name).join(" · ")}</dd>
      </div>
    ))}
  </dl>
);

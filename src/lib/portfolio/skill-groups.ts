import type { Skill } from "@/lib/types"

const SKILL_GROUPS: { label: string; names: string[] }[] = [
  {
    label: "Languages",
    names: ["Java", "Python", "Dart", "TypeScript", "JavaScript"],
  },
  {
    label: "Frontend & Mobile",
    names: ["React", "Flutter", "Next.js"],
  },
  {
    label: "Backend & Data",
    names: [
      "Spring Boot",
      "FastAPI",
      "MySQL",
      "PostgreSQL",
      "MariaDB",
      "Redis",
      "Apache Kafka",
    ],
  },
  {
    label: "DevOps & Cloud",
    names: ["Docker", "AWS", "GitHub Actions", "Prometheus", "Grafana"],
  },
  {
    label: "AI & Automation",
    names: [
      "LangChain",
      "Ollama",
      "N8N",
      "AI Automation",
      "Business Automation",
    ],
  },
]

export type SkillGroup = {
  label: string
  skills: Skill[]
}

export const groupSkills = (skills: Skill[]): SkillGroup[] => {
  const byName = new Map(skills.map((skill) => [skill.name, skill]))
  const assigned = new Set<string>()

  const groups = SKILL_GROUPS.map((group) => {
    const grouped = group.names
      .map((name) => byName.get(name))
      .filter((skill): skill is Skill => {
        if (!skill) return false
        assigned.add(skill.name)
        return true
      })

    return { label: group.label, skills: grouped }
  }).filter((group) => group.skills.length > 0)

  const remaining = skills.filter((skill) => !assigned.has(skill.name))
  if (remaining.length > 0) {
    groups.push({ label: "More", skills: remaining })
  }

  return groups
}

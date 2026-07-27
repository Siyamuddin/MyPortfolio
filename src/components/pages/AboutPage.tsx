import { Code2, Server, Smartphone, Sparkles } from "lucide-react"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { SkillChip } from "@/components/ui/SkillChip"
import type { Profile, Service, Skill } from "@/lib/types"

const serviceIcons = {
  Smartphone,
  Code2,
  Sparkles,
  Server,
} as const

type AboutPageProps = {
  profile: Profile
  services: Service[]
  skills: Skill[]
}

export const AboutPage = ({ profile, services, skills }: AboutPageProps) => {
  return (
    <article
      id="about-panel"
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="about-title"
    >
      <header>
        <SectionTitle>
          <span id="about-title">About Me</span>
        </SectionTitle>
      </header>

      <section className="text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
        {profile.bio.map((paragraph, index) => (
          <p key={index} className="mb-4 last:mb-0">
            {index === 1 && profile.bioHighlight ? (
              <>
                {paragraph.split(profile.bioHighlight)[0]}
                <strong className="font-medium text-white-2">
                  {profile.bioHighlight}
                </strong>
                {paragraph.split(profile.bioHighlight)[1]}
              </>
            ) : (
              paragraph
            )}
          </p>
        ))}
      </section>

      <section className="mt-8 mb-9">
        <SectionTitle as="h3">What I&apos;m Doing</SectionTitle>
        <ul className="grid grid-cols-1 gap-5 min-[580px]:gap-[20px] min-[1024px]:grid-cols-2 min-[1024px]:gap-x-[25px] min-[1024px]:gap-y-5">
          {services.map((service) => {
            const Icon =
              serviceIcons[service.icon as keyof typeof serviceIcons] ?? Code2

            return (
              <li key={service.title} className="gradient-border-card p-5 shadow-[var(--shadow-2)] min-[580px]:flex min-[580px]:items-start min-[580px]:justify-start min-[580px]:gap-[18px] min-[580px]:p-[30px]">
                <div className="mb-2.5 flex h-12 w-12 items-center justify-center text-2xl text-gold min-[580px]:mb-0 min-[580px]:mt-1">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="text-center min-[580px]:text-left">
                  <h4 className="mb-1.5 text-base capitalize text-white-2 min-[580px]:text-lg">
                    {service.title}
                  </h4>
                  <p className="text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
                    {service.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="mb-2">
        <SectionTitle as="h3">Skills</SectionTitle>
        <ul className="flex flex-wrap items-center justify-center gap-4 p-5">
          {skills.map((skill) => (
            <SkillChip key={skill.name} skill={skill} />
          ))}
        </ul>
      </section>
    </article>
  )
}

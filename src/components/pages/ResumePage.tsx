import { BookOpen, Briefcase, Download } from "lucide-react"
import { education, experience, profile } from "@/data/portfolio"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { TimelineItem } from "@/components/ui/TimelineItem"
import { IconBox } from "@/components/ui/IconBox"

export const ResumePage = () => {
  const resumeHref = profile.resumeUrl ?? "/resume.pdf"

  return (
    <article
      id="resume-panel"
      className="rounded-[20px] border border-jet bg-eerie-black-2 p-[15px] shadow-[var(--shadow-1)] min-[580px]:mx-auto min-[580px]:w-[520px] min-[580px]:p-[30px] min-[768px]:w-[700px] min-[1024px]:w-[950px] min-[1024px]:shadow-[var(--shadow-5)] min-[1250px]:w-auto min-[1250px]:min-h-full"
      aria-labelledby="resume-title"
    >
      <header>
        <SectionTitle>
          <span id="resume-title">Resume</span>
        </SectionTitle>
      </header>

      <section className="mb-8">
        <div className="mb-6 flex items-center gap-4">
          <IconBox>
            <BookOpen className="h-4 w-4" />
          </IconBox>
          <h3 className="text-lg capitalize text-white-2">Education</h3>
        </div>
        <ol className="ml-[45px] text-sm min-[580px]:ml-[65px] min-[580px]:text-[15px]">
          {education.map((item) => (
            <TimelineItem
              key={item.school}
              title={`${item.school} — ${item.degree}`}
              period={item.period}
            >
              <p>{item.description}</p>
            </TimelineItem>
          ))}
        </ol>
      </section>

      <section className="mb-8">
        <div className="mb-6 flex items-center gap-4">
          <IconBox>
            <Briefcase className="h-4 w-4" />
          </IconBox>
          <h3 className="text-lg capitalize text-white-2">Experience</h3>
        </div>
        <ol className="ml-[45px] text-sm min-[580px]:ml-[65px] min-[580px]:text-[15px]">
          {experience.map((item) => (
            <TimelineItem
              key={`${item.company}-${item.role}`}
              title={`${item.role} — ${item.company}`}
              period={item.period}
            >
              <ul>
                {item.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="relative list-none pl-4 before:absolute before:left-0 before:font-bold before:text-gold before:content-['•']"
                  >
                    {highlight}
                  </li>
                ))}
              </ul>
            </TimelineItem>
          ))}
        </ol>
      </section>

      <div className="mt-5">
        <a
          href={resumeHref}
          className="relative z-[1] inline-flex items-center gap-2.5 rounded-[14px] bg-gradient-to-br from-[#38383d] to-transparent px-6 py-3 text-sm capitalize text-gold shadow-[var(--shadow-3)] transition-colors before:absolute before:inset-px before:-z-[1] before:rounded-[inherit] before:bg-[linear-gradient(to_bottom_right,hsla(240,1%,18%,0.251),hsla(240,2%,11%,0)),#222226] before:transition-colors hover:bg-gradient-to-br hover:from-[#ffdb70] hover:to-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          download
          tabIndex={0}
          aria-label="Download CV"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          <span>Download CV</span>
        </a>
      </div>
    </article>
  )
}

import { Download } from "lucide-react";
import type { Education, Experience, Profile } from "@/lib/types";

type ResumePageProps = {
  profile: Profile;
  education: Education[];
  experience: Experience[];
};
export const ResumePage = ({
  profile,
  education,
  experience,
}: ResumePageProps) => (
  <article className="page-content" aria-labelledby="resume-title">
    <header className="page-header">
      <p className="eyebrow">Background</p>
      <h1 id="resume-title">Experience & education.</h1>
      <p>
        {profile.name} · {profile.title}
        <br />
        {profile.location}
      </p>
      <a
        className="site-button secondary mt-6"
        href={profile.resumeUrl || "/resume.pdf"}
        target="_blank"
        rel="noopener noreferrer"
      >
        View resume PDF <Download size={17} aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </header>
    <section className="resume-section" aria-labelledby="experience-title">
      <h2 id="experience-title">Experience</h2>
      <ol>
        {experience.map((item) => (
          <li key={`${item.company}-${item.role}`} className="resume-entry">
            <h3>{item.role}</h3>
            <p className="meta">
              {item.company} · {item.period}
              {item.location ? ` · ${item.location}` : ""}
            </p>
            <ul>
              {item.highlights.map((highlight) => (
                <li key={highlight}>{highlight}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
    <section className="resume-section" aria-labelledby="education-title">
      <h2 id="education-title">Education</h2>
      <ol>
        {education.map((item) => (
          <li key={`${item.school}-${item.degree}`} className="resume-entry">
            <h3>{item.school}</h3>
            <p className="meta">
              {item.degree} · {item.period}
            </p>
            <p>{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  </article>
);

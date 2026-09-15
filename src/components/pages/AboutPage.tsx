import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { AboutHeroHeader } from "@/components/pages/AboutHeroHeader";
import { FaqAccordion } from "@/components/pages/FaqAccordion";
import { SkillsGrid } from "@/components/pages/SkillsGrid";
import { FeaturedProjectCard } from "@/components/portfolio/FeaturedProjectCard";
import { getBlogPostHref } from "@/lib/portfolio/blog";
import type {
  BlogPost,
  Faq,
  Profile,
  Project,
  Service,
  Skill,
} from "@/lib/types";

type AboutPageProps = {
  profile: Profile;
  services: Service[];
  skills: Skill[];
  faqs?: Faq[];
  featuredPosts?: BlogPost[];
  featuredProject?: Project | null;
};

export const AboutPage = ({
  profile,
  services,
  skills,
  faqs = [],
  featuredPosts = [],
  featuredProject = null,
}: AboutPageProps) => {
  const writing = featuredPosts
    .map((post) => ({ post, href: getBlogPostHref(post) }))
    .filter((item) => item.href?.startsWith("/"))
    .slice(0, 3);
  return (
    <article aria-labelledby="about-title">
      <AboutHeroHeader profile={profile} />
      {featuredProject && (
        <section className="site-section" aria-labelledby="work-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Selected work</p>
              <h2 id="work-title">From idea to working product.</h2>
            </div>
            <Link className="text-link" href="/portfolio">
              All work <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <FeaturedProjectCard project={featuredProject} />
        </section>
      )}
      {services.length > 0 && (
        <section className="site-section" aria-labelledby="services-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Services</p>
              <h2 id="services-title">What I can help you build.</h2>
            </div>
          </div>
          <ul className="services-grid">
            {services.map((service, index) => (
              <li key={service.title}>
                <span className="service-number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
      <section
        className="site-section about-section"
        aria-labelledby="about-heading"
      >
        <div>
          <p className="eyebrow">A little about me</p>
          <h2 id="about-heading">The person behind the work.</h2>
          <Link href="/resume" className="text-link">
            Experience & resume <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="biography">
          {profile.bio.filter(Boolean).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </section>
      {skills.length > 0 && (
        <section className="site-section" aria-labelledby="skills-title">
          <div className="section-heading">
            <h2 id="skills-title">Tools I work with.</h2>
          </div>
          <SkillsGrid skills={skills} />
        </section>
      )}
      {writing.length > 0 && (
        <section className="site-section" aria-labelledby="writing-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Notes from the work</p>
              <h2 id="writing-title">Recent writing.</h2>
            </div>
            <Link href="/blog" className="text-link">
              All articles <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <ul className="writing-list">
            {writing.map(({ post, href }) => (
              <li key={href}>
                <Link href={href!}>
                  <div>
                    <p className="meta">
                      {post.category} · {post.date}
                    </p>
                    <h3>{post.title}</h3>
                  </div>
                  <ArrowUpRight size={22} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <FaqAccordion faqs={faqs} />
      <section
        className="contact-invitation"
        aria-labelledby="invitation-title"
      >
        <p className="eyebrow">Have something in mind?</p>
        <h2 id="invitation-title">Let&apos;s make it work.</h2>
        <p>Tell me what you want to build, improve, or automate.</p>
        <Link className="site-button primary" href="/contact">
          Discuss a project <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </article>
  );
};

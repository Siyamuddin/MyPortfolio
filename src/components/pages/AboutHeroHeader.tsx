import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Profile } from "@/lib/types";

export const AboutHeroHeader = ({ profile }: { profile: Profile }) => (
  <header className="home-hero">
    <div className="hero-copy">
      <p className="eyebrow">Independent development & AI automation</p>
      <h1 id="about-title">
        Software for your business.
        <br />
        <span>Built with care.</span>
      </h1>
      <p className="hero-description">
        I&apos;m {profile.name}. I build web and mobile applications, connect AI
        to existing products, and automate the work between them.
      </p>
      <div className="hero-actions">
        <Link className="site-button primary" href="/contact">
          Discuss a project <ArrowUpRight size={18} aria-hidden="true" />
        </Link>
        <Link className="site-button secondary" href="/portfolio">
          View work <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
      <p className="hero-location">Based in {profile.location}</p>
    </div>
    <figure className="hero-portrait">
      <Image
        src={profile.avatar || "/SiyamImage.webp"}
        alt={profile.name}
        width={600}
        height={720}
        sizes="(min-width: 1200px) 300px, (min-width: 768px) 28vw, 120px"
        priority
      />
      <figcaption>
        <span>{profile.name}</span>
        <span>{profile.title}</span>
      </figcaption>
    </figure>
  </header>
);

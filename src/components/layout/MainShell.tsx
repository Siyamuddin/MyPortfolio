import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import type { Profile } from "@/lib/types";

export const MainShell = ({
  children,
  profile,
}: {
  children: React.ReactNode;
  profile: Profile;
}) => (
  <div className="public-site">
    <a className="skip-link" href="#main-content">
      Skip to content
    </a>
    <Navbar name={profile.name} />
    <main id="main-content" className="site-container" tabIndex={-1}>
      {children}
    </main>
    <footer className="site-footer site-container">
      <div>
        <Link href="/" className="footer-name">
          {profile.name}
        </Link>
        <p>{profile.location}</p>
      </div>
      <nav aria-label="Social links" className="footer-links">
        <a href={`mailto:${profile.email}`}>Email</a>
        {profile.socials.github && (
          <a
            href={profile.socials.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        {profile.socials.linkedin && (
          <a
            href={profile.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
        <Link href="/resume">Resume</Link>
      </nav>
    </footer>
  </div>
);

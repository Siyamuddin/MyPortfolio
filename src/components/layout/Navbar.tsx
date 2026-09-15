"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { pagePaths, pathToNavPage } from "@/lib/seo";
import type { NavPage } from "@/lib/types";

const links: { id: NavPage; label: string }[] = [
  { id: "about", label: "Home" },
  { id: "portfolio", label: "Work" },
  { id: "resume", label: "Resume" },
  { id: "blog", label: "Writing" },
  { id: "contact", label: "Contact" },
];

export const Navbar = ({ name }: { name: string }) => {
  const pathname = usePathname();
  const [openPath, setOpenPath] = useState<string | null>(null);
  const open = openPath === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const activePage = pathToNavPage(pathname);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpenPath(null);
          buttonRef.current?.focus();
        }
      }}
    >
      <div className="site-container header-inner">
        <Link
          href="/"
          className="wordmark"
          onClick={() => setOpenPath(null)}
          aria-label={`${name}, home`}
        >
          <span className="brand-dot" aria-hidden="true" />
          {name}
        </Link>
        <button
          ref={buttonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="primary-navigation"
          onClick={() => setOpenPath(open ? null : pathname)}
        >
          {open ? (
            <X size={20} aria-hidden="true" />
          ) : (
            <Menu size={20} aria-hidden="true" />
          )}
          <span>{open ? "Close" : "Menu"}</span>
        </button>
        <nav
          id="primary-navigation"
          aria-label="Primary"
          className="primary-nav"
          data-open={open}
        >
          {links.map(({ id, label }) => (
            <Link
              key={id}
              href={pagePaths[id]}
              aria-current={activePage === id ? "page" : undefined}
              onClick={() => setOpenPath(null)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

import { ArrowUpRight, Code2 } from "lucide-react";
import type { Project } from "@/lib/types";

const httpUrl = (value?: string) => {
  try {
    const url = new URL(value ?? "");
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export const ProjectLinks = ({ project }: { project: Project }) => {
  const url = httpUrl(project.url);
  const suppliedSource = httpUrl(project.githubUrl);
  const isGithub = (value: string) => new URL(value).hostname === "github.com";
  const source = suppliedSource || (url && isGithub(url) ? url : null);
  const live = url && !isGithub(url) ? url : null;
  const repository =
    source && new URL(source).pathname.split("/").filter(Boolean).length >= 2;
  return (
    <div className="project-links">
      {live && (
        <a
          href={live}
          className="text-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${project.title} website (opens in a new tab)`}
        >
          Visit website <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      {source && source !== live && (
        <a
          href={source}
          className="text-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${repository ? `View ${project.title} source` : "View GitHub profile"} (opens in a new tab)`}
        >
          {repository ? "Source code" : "GitHub profile"}
          <Code2 size={16} aria-hidden="true" />
        </a>
      )}
    </div>
  );
};

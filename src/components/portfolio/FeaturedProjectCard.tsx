import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { FeaturedProjectVisual } from "@/components/three/FeaturedProjectMockup"
import { cn } from "@/lib/cn"
import { resolveProjectImageSrc } from "@/lib/portfolio/project-image"
import type { Project } from "@/lib/types"

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
)

type FeaturedProjectCardProps = {
  project: Project
  variant?: "default" | "showcase"
}

export const FeaturedProjectCard = ({
  project,
  variant = "default",
}: FeaturedProjectCardProps) => {
  const imageSrc = resolveProjectImageSrc(project.image, project.title)
  const liveUrl =
    project.url.startsWith("http") &&
    (!project.githubUrl || project.url !== project.githubUrl)
      ? project.url
      : project.url.startsWith("http")
        ? project.url
        : null
  const githubUrl = project.githubUrl?.startsWith("http")
    ? project.githubUrl
    : null
  const showLive = Boolean(
    project.url.startsWith("http") &&
      (!githubUrl || project.url !== githubUrl)
  )
  const showGithub = Boolean(githubUrl)

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-jet bg-eerie-black-1",
        variant === "showcase" && "shadow-[var(--shadow-3)]"
      )}
    >
      <div className="grid min-[768px]:grid-cols-2">
        <figure
          className={cn(
            "relative aspect-[16/10] min-[768px]:aspect-auto",
            variant === "showcase"
              ? "min-h-[240px] min-[768px]:min-h-[280px]"
              : "min-[768px]:min-h-[220px]"
          )}
        >
          {variant === "showcase" ? (
            <FeaturedProjectVisual imageSrc={imageSrc} title={project.title} />
          ) : (
            <Image
              src={imageSrc}
              alt={project.title}
              fill
              sizes="(min-width:768px) 50vw, 100vw"
              className="object-cover"
              unoptimized={imageSrc.includes("placehold.co")}
            />
          )}
        </figure>
        <div className="flex flex-col justify-center p-5 min-[580px]:p-6">
          {project.highlight ? (
            <p className="mb-2 w-max rounded-lg bg-onyx px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-gold">
              {project.highlight}
            </p>
          ) : null}
          <h3 className="mb-2 text-lg font-medium text-white-2 min-[580px]:text-xl">
            {project.title}
          </h3>
          <p className="mb-4 text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-3">
            {showLive && liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold px-4 py-2 text-sm font-medium text-smoky-black transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                tabIndex={0}
                aria-label={`View live demo of ${project.title}`}
              >
                Live demo
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : null}
            {showGithub && githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
                  showLive
                    ? "border border-jet text-white-2 hover:border-gold/50 hover:text-gold"
                    : "bg-gold text-smoky-black hover:opacity-90"
                )}
                tabIndex={0}
                aria-label={`View ${project.title} source code on GitHub`}
              >
                <GithubIcon className="h-4 w-4" />
                {showLive ? "Source" : "View on GitHub"}
              </a>
            ) : null}
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm text-light-gray-70 underline-offset-2 transition-colors hover:text-gold hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              tabIndex={0}
              aria-label="View all portfolio projects"
            >
              All projects
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

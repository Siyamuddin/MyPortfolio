import { ArrowUpRight } from "lucide-react"
import { ContentImage as Image } from "@/components/portfolio/ContentImage"
import type { Project } from "@/lib/types"
import { projectPlaceholderSrc } from "@/lib/portfolio/project-image"
import { getProjectLinks } from "@/lib/portfolio/project-links"

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

type ProjectCardProps = {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { liveUrl, githubUrl } = getProjectLinks(project)
  const imageSrc =
    project.image.startsWith("http") || project.image.startsWith("/")
      ? project.image
      : projectPlaceholderSrc()

  const media = (
    <>
      <figure className="relative mb-4 h-[200px] w-full overflow-hidden rounded-2xl before:absolute before:inset-0 before:z-[1] before:bg-transparent before:transition-colors min-[450px]:h-auto min-[450px]:aspect-[3/2]">
        <Image
          src={imageSrc}
          alt={project.title}
          width={600}
          height={400}
          sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-250 group-hover:scale-110 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          unoptimized={imageSrc.includes("placehold.co")}
        />
      </figure>
      <div className="ml-2.5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <h2 className="text-[15px] font-normal capitalize leading-snug text-white-2">
            {project.title}
          </h2>
          {project.highlight ? (
            <span className="rounded-md bg-onyx px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-gold">
              {project.highlight}
            </span>
          ) : null}
        </div>
        <p className="mb-2 text-sm font-light text-light-gray-70 min-[580px]:text-[15px]">
          {project.category}
        </p>
        <p className="line-clamp-2 text-sm font-light leading-relaxed text-light-gray min-[580px]:text-[15px]">
          {project.description}
        </p>
        {(liveUrl || githubUrl) && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-medium">
            {liveUrl ? (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.title} website`} className="inline-flex min-h-11 items-center gap-1 text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                Visit website
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}
            {githubUrl && githubUrl !== liveUrl ? (
              <a href={githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`View ${project.title} source on GitHub`} className="inline-flex min-h-11 items-center gap-1 text-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
                <GithubIcon className="h-3.5 w-3.5" />
                Source
              </a>
            ) : null}
          </div>
        )}
      </div>
    </>
  )

  return <li className="group scale-up motion-reduce:animate-none">{media}</li>
}

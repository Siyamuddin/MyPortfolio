import { ArrowUpRight, Eye } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/cn"

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

const placeholderSrc = (title: string) =>
  `https://placehold.co/600x400/1a1a1e/ffdb70?text=${encodeURIComponent(title.slice(0, 18))}`

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const liveUrl = project.url.startsWith("http") ? project.url : null
  const githubUrl = project.githubUrl?.startsWith("http")
    ? project.githubUrl
    : null
  const imageSrc =
    project.image.startsWith("http") || project.image.startsWith("/")
      ? project.image
      : placeholderSrc(project.title)

  const media = (
    <>
      <figure className="relative mb-4 h-[200px] w-full overflow-hidden rounded-2xl before:absolute before:inset-0 before:z-[1] before:bg-transparent before:transition-colors group-hover:before:bg-black/50 min-[450px]:h-auto min-[450px]:aspect-[3/2]">
        {liveUrl || githubUrl ? (
          <div className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 scale-[0.8] rounded-xl bg-jet p-[18px] text-gold opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <Eye className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
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
          <h3 className="text-[15px] font-normal capitalize leading-snug text-white-2">
            {project.title}
          </h3>
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
              <span className="inline-flex items-center gap-1 text-gold">
                Live demo
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            ) : null}
            {githubUrl && githubUrl !== liveUrl ? (
              <span className="inline-flex items-center gap-1 text-light-gray-70">
                <GithubIcon className="h-3.5 w-3.5" />
                Source
              </span>
            ) : null}
          </div>
        )}
      </div>
    </>
  )

  const cardClassName =
    "group block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"

  return (
    <li className="scale-up motion-reduce:animate-none">
      {liveUrl ? (
        <a
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClassName}
          tabIndex={0}
          aria-label={`View project ${project.title}`}
        >
          {media}
        </a>
      ) : githubUrl ? (
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClassName}
          tabIndex={0}
          aria-label={`View ${project.title} on GitHub`}
        >
          {media}
        </a>
      ) : (
        <div className={cn(cardClassName, "cursor-default")} aria-label={project.title}>
          {media}
        </div>
      )}
    </li>
  )
}

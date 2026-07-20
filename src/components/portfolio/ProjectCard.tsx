"use client"

import { Eye } from "lucide-react"
import Image from "next/image"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/cn"

type ProjectCardProps = {
  project: Project
}

const placeholderSrc = (title: string) =>
  `https://placehold.co/600x400/1a1a1e/ffdb70?text=${encodeURIComponent(title.slice(0, 18))}`

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const hasUrl = project.url.startsWith("http")
  const imageSrc = project.image.startsWith("http")
    ? project.image
    : placeholderSrc(project.title)

  const media = (
    <>
      <figure className="relative mb-4 h-[200px] w-full overflow-hidden rounded-2xl before:absolute before:inset-0 before:z-[1] before:bg-transparent before:transition-colors group-hover:before:bg-black/50 min-[450px]:h-auto min-[450px]:aspect-[3/2]">
        {hasUrl ? (
          <div className="absolute top-1/2 left-1/2 z-[1] -translate-x-1/2 -translate-y-1/2 scale-[0.8] rounded-xl bg-jet p-[18px] text-gold opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100">
            <Eye className="h-5 w-5" aria-hidden="true" />
          </div>
        ) : null}
        <Image
          src={imageSrc}
          alt={project.title}
          width={600}
          height={400}
          className="h-full w-full object-cover transition-transform duration-250 group-hover:scale-110"
          unoptimized={imageSrc.includes("placehold.co")}
        />
      </figure>
      <h3 className="ml-2.5 text-[15px] font-normal capitalize leading-snug text-white-2">
        {project.title}
      </h3>
      <p
        className={cn(
          "ml-2.5 text-sm font-light text-light-gray-70 min-[580px]:text-[15px]"
        )}
      >
        {project.category}
      </p>
    </>
  )

  return (
    <li className="scale-up">
      {hasUrl ? (
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          tabIndex={0}
          aria-label={`View project ${project.title}`}
        >
          {media}
        </a>
      ) : (
        <div className="group block w-full" aria-label={project.title}>
          {media}
        </div>
      )}
    </li>
  )
}

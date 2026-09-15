import { ContentImage } from "@/components/ui/ContentImage";
import { ProjectLinks } from "@/components/portfolio/ProjectLinks";
import type { Project } from "@/lib/types";

export const ProjectCard = ({ project }: { project: Project }) => (
  <li>
    <article>
      <figure className="project-media">
        <ContentImage
          src={project.image}
          alt={project.title}
          sizes="(min-width: 1200px) 544px, (min-width: 768px) 50vw, 100vw"
        />
      </figure>
      <div className="project-copy">
        <p className="meta">{project.category}</p>
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        {project.highlight && (
          <span className="project-highlight">{project.highlight}</span>
        )}
        <ProjectLinks project={project} />
      </div>
    </article>
  </li>
);

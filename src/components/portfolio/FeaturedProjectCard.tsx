import { ContentImage } from "@/components/ui/ContentImage";
import { ProjectLinks } from "@/components/portfolio/ProjectLinks";
import type { Project } from "@/lib/types";

export const FeaturedProjectCard = ({ project }: { project: Project }) => (
  <article className="featured-work">
    <figure className="project-media">
      <ContentImage
        src={project.image}
        alt={project.title}
        sizes="(min-width: 1200px) 600px, (min-width: 768px) 55vw, 100vw"
      />
    </figure>
    <div className="featured-copy">
      <p className="meta">{project.category}</p>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      {project.highlight && (
        <span className="project-highlight">{project.highlight}</span>
      )}
      <ProjectLinks project={project} />
    </div>
  </article>
);

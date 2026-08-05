export type SkillMeta = {
  description: string
  url: string
}

/** Official site + short blurb keyed by skill display name. */
export const SKILL_META: Record<string, SkillMeta> = {
  Java: {
    description: "Enterprise backend development with the JVM ecosystem.",
    url: "https://www.oracle.com/java/",
  },
  "Spring Boot": {
    description: "Production REST APIs, security, and microservices on Spring.",
    url: "https://spring.io/projects/spring-boot",
  },
  React: {
    description: "Component-based UI for fast, interactive web apps.",
    url: "https://react.dev",
  },
  Flutter: {
    description: "Cross-platform mobile apps from a single Dart codebase.",
    url: "https://flutter.dev",
  },
  Dart: {
    description: "Modern language powering Flutter and client-side apps.",
    url: "https://dart.dev",
  },
  TypeScript: {
    description: "Typed JavaScript for safer large-scale frontends.",
    url: "https://www.typescriptlang.org",
  },
  Python: {
    description: "Scripting, data work, and backend services.",
    url: "https://www.python.org",
  },
  JavaScript: {
    description: "Core language of the modern web platform.",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  },
  "Next.js": {
    description: "React framework with SSR, routing, and SEO built in.",
    url: "https://nextjs.org",
  },
  FastAPI: {
    description: "High-performance Python APIs with async support.",
    url: "https://fastapi.tiangolo.com",
  },
  MySQL: {
    description: "Relational database for structured application data.",
    url: "https://www.mysql.com",
  },
  Redis: {
    description: "In-memory cache, queues, and rate limiting.",
    url: "https://redis.io",
  },
  PostgreSQL: {
    description: "Advanced open-source relational database.",
    url: "https://www.postgresql.org",
  },
  MariaDB: {
    description: "MySQL-compatible database for production workloads.",
    url: "https://mariadb.org",
  },
  Docker: {
    description: "Containerized builds and portable deployments.",
    url: "https://www.docker.com",
  },
  AWS: {
    description: "Cloud hosting, storage, and managed services.",
    url: "https://aws.amazon.com",
  },
  "GitHub Actions": {
    description: "CI/CD pipelines integrated with GitHub repos.",
    url: "https://github.com/features/actions",
  },
  Prometheus: {
    description: "Metrics collection and alerting for services.",
    url: "https://prometheus.io",
  },
  Grafana: {
    description: "Dashboards and observability visualization.",
    url: "https://grafana.com",
  },
  N8N: {
    description: "Visual workflow automation and integrations.",
    url: "https://n8n.io",
  },
  "AI Automation": {
    description: "LLM agents, RAG pipelines, and intelligent workflows.",
    url: "https://huggingface.co",
  },
  "Business Automation": {
    description: "No-code business process and app integrations.",
    url: "https://www.make.com",
  },
  LangChain: {
    description: "Framework for building LLM-powered applications.",
    url: "https://www.langchain.com",
  },
  Ollama: {
    description: "Run open-source LLMs locally and in production.",
    url: "https://ollama.com",
  },
  "Apache Kafka": {
    description: "Distributed event streaming for real-time data.",
    url: "https://kafka.apache.org",
  },
}

export const getSkillMeta = (name: string): SkillMeta | null =>
  SKILL_META[name] ?? null

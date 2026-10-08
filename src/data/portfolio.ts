import { Profile, Service, Skill, Education, Experience, Project, BlogPost, Faq } from "@/lib/types"

export const profile: Profile = {
  name: "Siyam Uddin",
  title: "Flutter Dev @ Mixroom.ai",
  email: "business@siyamuddin.com",
  location: "Seoul, South Korea",
  bio: [
    "Independent IT & AI solutions provider helping businesses build production-grade software, automation pipelines, and AI-powered systems. I help businesses automate workflows with AI by building intelligent agents, orchestration pipelines, and full-stack applications using LangChain, n8n, Spring Boot, React, Docker, AWS, and Cloudflare.",
    "My research in Depression Detection using Multimodal clinical Data and Agentic AI for Industrial IoT Security keeps me at the frontier of autonomous systems, while my hands-on engineering delivers real products. Whether you need an AI automation or full-stack web application, an AI integration layer, a DevOps pipeline, or a custom automation workflow, I design, build, and ship it.",
    "I currently work as a Flutter Developer at Mixroom.ai, an AI-based digital audio workstation (DAW). Based in Seoul, working with clients globally.",
  ],
  bioHighlight: "Agentic AI in Industrial IoT Security",
  socials: {
    github: "https://github.com/Siyamuddin",
    linkedin: "https://www.linkedin.com/in/siyam-uddin-8953511ab/",
    googlescholar: "https://scholar.google.com/citations?user=_wYEtSgAAAAJ&hl=en",
    facebook: "https://www.facebook.com/siyam.mizi.94",
    youtube: "https://www.youtube.com/@siyamuddin",
    twitter: "https://x.com/siyamuddin",
  },
  avatar: "/SiyamImage.webp",
  resumeUrl: "/resume.pdf",
};

export const services: Service[] = [
    {
    title: "AI/ML Solutions",
    description: "Intelligent automation, building scalable AI agents, LLM integration and tuning, and workflow automation with n8n, Open-claw, and Hermes.",
    icon: "Sparkles",
  },
  {
    title: "Mobile Apps",
    description: "Professional development of applications for Android and iOS using Flutter, Capacitor for rapid web to app conversion.",
    icon: "Smartphone",
  },
  {
    title: "Web Development",
    description: "High-quality scalable development of full-stack web applications with modern tools and frameworks.",
    icon: "Code2",
  },
  {
    title: "Backend Development",
    description: "High-performance backend services with reliable deployment on AWS, GCP.",
    icon: "Server",
  },
];

export const skills: Skill[] = [
  { name: "Java", color: "#ED8B00", icon: "java" },
  { name: "Spring Boot", color: "#6DB33F", icon: "spring" },
  { name: "React", color: "#61DAFB", icon: "react" },
  { name: "Flutter", color: "#02569B", icon: "flutter" },
  { name: "Dart", color: "#0175C2", icon: "dart" },
  { name: "TypeScript", color: "#3178C6", icon: "typescript" },
  { name: "Python", color: "#FFD43B", icon: "python" },
  { name: "JavaScript", color: "#F7DF1E", icon: "javascript" },
  { name: "Next.js", color: "#000000", icon: "nextjs" },
  { name: "FastAPI", color: "#009688", icon: "fastapi" },
  { name: "MySQL", color: "#4479A1", icon: "mysql" },
  { name: "Redis", color: "#FF4438", icon: "redis" },
  { name: "PostgreSQL", color: "#336791", icon: "postgresql" },
  { name: "MariaDB", color: "#003545", icon: "mariadb" },
  { name: "Docker", color: "#2496ED", icon: "docker" },
  { name: "AWS", color: "#FF9900", icon: "aws" },
  { name: "GitHub Actions", color: "#2088FF", icon: "githubactions" },
  { name: "Prometheus", color: "#E6522C", icon: "prometheus" },
  { name: "Grafana", color: "#F46800", icon: "grafana" },
  { name: "N8N", color: "#EA4AAA", icon: "n8n" },
  { name: "AI Automation", color: "#FFD21E", icon: "huggingface" },
  { name: "Business Automation", color: "#6D00CC", icon: "make" },
  { name: "LangChain", color: "#1C3C3C", icon: "langchain" },
  { name: "Ollama", color: "#000000", icon: "ollama" },
  { name: "Apache Kafka", color: "#231F20", icon: "apachekafka" },
];

export const education: Education[] = [
  {
    school: "Sejong University",
    degree: "B.Eng. Computer Science & Engineering",
    period: "2022 — 2026",
    description: "Final year B.Eng. in Computer Science & Engineering at Sejong University, Seoul. Research focus: Agentic AI in Industrial IoT Security. Graduating August 2026.",
  },
];

export const experience: Experience[] = [
  {
    role: "Flutter Developer",
    company: "Mixroom.ai",
    period: "Aug 2026 — Present",
    location: "Seoul, South Korea",
    highlights: [
      "Building the Flutter app for Mixroom.ai, an AI-based digital audio workstation (DAW)",
      "Tech: Flutter, Dart, AI audio",
    ],
  },
  {
    role: "Founder & IT/AI Solutions Architect",
    company: "Solopreneur",
    period: "2025-present ",
    location: "Seoul, South Korea",
    highlights: [
      "Run an independent IT & AI solutions practice delivering full-stack development, AI agent pipelines, automation infrastructure, and technical consulting to clients globally",
      "Built and maintain hermes agent a production automation dashboard with n8n, Cloudflare Tunnel, cron jobs, Telegram integration, and scheduled SVG report generation",
      "Developed AI agent systems using LangChain, Spring AI, and multi-agent architectures for production deployments",
      "Designed and deployed Docker Compose stacks with PostgreSQL, n8n, Cloudflare Tunnel, and monitoring for always-on infrastructure",
      "Created YouTube SEO automation workflows handling tag generation, playlist management, and thumbnail processing for @siyamuddin channel (1,450+ subscribers)",
      "Provide end-to-end technical consulting: architecture design, stack selection, AI feasibility, and production deployment",
    ],
  },
  {
    role: "Full-Stack Engineer (Sellerket)",
    company: "Sellerket LTD",
    period: "2024 — 2026",
    location: "",
    highlights: [],
  },
  {
    role: "Full-Stack Developer",
    company: "Sellerket LTD",
    period: "2024 — 2026",
    location: "",
    highlights: [],
  },
];

export const projects: Project[] = [
  {
    title: "AirSeoul",
    category: "Web Development",
    image: "/images/projects/portfolio.jpg",
    url: "",
    description: "Full-stack flight booking platform handling 50K+ req/hr with Spring Boot, React, Redis, Docker, and AWS",
    tags: ["spring-boot", "react", "aws"],
  },
  {
    title: "GlobalSellerket",
    category: "Web Development",
    image: "/images/projects/n8n.jpg",
    url: "https://shop.setlone.com",
    description: "Brand & influencer e-commerce platform with blockchain-based payment module deployed on AWS",
    tags: ["ecommerce", "aws", "blockchain"],
  },
  {
    title: "SetlOne",
    category: "Applications",
    image: "/images/projects/dashboard.jpg",
    url: "https://setlone.com",
    description: "Social networking + fintech platform with real-time features, WebSocket architecture, and Redis caching",
    tags: ["fintech", "websocket", "redis"],
  },
  {
    title: "Automation Tools",
    category: "Automation",
    image: "/images/projects/ai-agent.jpg",
    url: "",
    description: "Agentic automation with FastAPI, Whisper ASR, RAG pipelines, and LLM integration — 100+ real users",
    tags: ["fastapi", "llm", "rag"],
  },
  {
    title: "Spring Boot API Service",
    category: "Applications",
    image: "/images/projects/spring.jpg",
    url: "",
    description: "RESTful API service with Spring Boot, JPA, MySQL, Redis caching, and Docker containerization",
    tags: ["spring-boot", "redis", "docker"],
  },
  {
    title: "View more on GitHub",
    category: "Applications",
    image: "/images/projects/more.jpg",
    url: "https://github.com/Siyamuddin",
    description: "Check out my full portfolio on GitHub",
    tags: [],
  },
];

export const blogPosts: BlogPost[] = [
  {
    title: "Agentic AI in Industrial IoT Security",
    category: "Research",
    date: "Mar 2026",
    dateTime: "2026-03",
    excerpt:
      "Exploring how autonomous AI agents can transform security monitoring and threat response in Industrial IoT environments.",
    image: "/images/blog/agentic-ai.jpg",
    url: "",
    slug: "agentic-ai-in-industrial-iot-security",
    status: "published",
    tags: ["agentic-ai", "iot", "security"],
    body: `## Why agentic AI matters for IIoT

Industrial IoT environments generate continuous telemetry. Traditional alert rules struggle when signals are noisy, delayed, or incomplete.

<Callout type="info" title="Key idea">
Autonomous agents can triage alerts, correlate events across sites, and propose containment steps — with a human still in the loop.
</Callout>

### Practical pattern

1. Ingest sensor + network events
2. Rank risk with a retrieval-backed model
3. Open a ticket with evidence and recommended actions

\`\`\`ts
const agent = createSecurityAgent({
  tools: ["queryLogs", "isolateHost", "notifyOnCall"],
})
await agent.run(alert)
\`\`\`

Use agents for **triage and recommendation**, not silent destructive actions, until trust is proven.
`,
  },
  {
    title: "Integrating AI into Spring Boot with Spring AI",
    category: "Tutorial",
    date: "Feb 2026",
    dateTime: "2026-02",
    excerpt:
      "A practical guide to using Spring AI starter for adding LLM capabilities to your Java backend applications.",
    image: "/images/blog/spring-ai.jpg",
    url: "",
    slug: "integrating-ai-into-spring-boot-with-spring-ai",
    status: "published",
    tags: ["spring-boot", "ai", "java"],
    body: `## Spring AI in production backends

Spring AI gives you a familiar Spring Boot surface for chat models, embeddings, and vector stores.

### Starter checklist

- Add the Spring AI starter for your provider
- Externalize model credentials
- Keep prompts versioned next to the feature that owns them

<Callout type="warn" title="Guardrails">
Never send secrets or PII into prompts. Redact upstream and log only hashed identifiers.
</Callout>

### Minimal chat client

Wire a \`ChatClient\` bean, inject it into a service, and expose a narrow API that validates inputs before calling the model.

MDX components like \`YouTube\` work here too when you register them in the app registry.
`,
  },
  {
    title: "Building Production Automation Pipelines with n8n",
    category: "Automation",
    date: "Jan 2026",
    dateTime: "2026-01",
    excerpt:
      "How I built a scalable automation infrastructure using n8n, Docker, and Cloudflare Tunnel.",
    image: "/images/blog/n8n.jpg",
    url: "",
    slug: "building-production-automation-pipelines-with-n8n",
    status: "published",
    tags: ["n8n", "automation", "docker"],
    body: `## n8n + Docker + Tunnel

For internal ops workflows, n8n is a strong fit when you need visual pipelines without building a custom orchestrator.

### Stack

- **n8n** for workflow logic
- **Docker Compose** for packaging
- **Cloudflare Tunnel** for private inbound webhooks

<Callout type="tip" title="Ops tip">
Treat credentials as secrets, pin image tags, and add healthchecks before exposing any webhook path.
</Callout>

### Reliability habits

- Idempotent webhook handlers
- Dead-letter queues for failed steps
- Alerting when a critical workflow stalls
`,
  },
]

export const faqs: Faq[] = [
  {
    question: "What kind of work do you take on?",
    answer:
      "Full-stack web apps, Spring Boot APIs, automation with n8n, and applied AI/IoT security projects — from prototypes to production hardening.",
  },
  {
    question: "Are you available for freelance or consulting?",
    answer:
      "Yes for scoped engagements. Use the contact form with a short brief, timeline, and stack preferences so I can respond quickly.",
  },
  {
    question: "Where can I read more of your writing?",
    answer:
      "Published articles live under Blog. Drafts stay private in the admin CMS until they are ready.",
  },
]

export const navPages: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "portfolio", label: "Portfolio" },
  { id: "events", label: "Events" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
]

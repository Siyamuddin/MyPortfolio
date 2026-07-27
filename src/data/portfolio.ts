import { Profile, Service, Skill, Education, Experience, Project, BlogPost } from "@/lib/types";

export const profile: Profile = {
  name: "Siyam Uddin",
  title: "Software Engineer",
  email: "business@siyamuddin.com",
  location: "Seoul, South Korea",
  bio: [
    "Results-driven Software Engineer with 3+ years of hands-on experience designing and operating large-scale production systems using Python, FastAPI, Java Spring Boot, React, and TypeScript. Proven track record of end-to-end delivery across AWS deployments, CI/CD automation, Redis caching, real-time WebSocket architecture, and JWT/OAuth2 security. Experienced integrating AI/ML technologies — including LangChain, RAG pipelines, and Whisper ASR — directly into production services.",
    "Currently completing a B.Eng. in Computer Science & Engineering at Sejong University (graduating August 2026). Researching Agentic AI in Industrial IoT Security.",
  ],
  bioHighlight: "Agentic AI in Industrial IoT Security",
  socials: {
    github: "https://github.com/Siyamuddin",
    linkedin: "https://www.linkedin.com/in/siyam-uddin-8953511ab/",
    googlescholar:"https://scholar.google.com/citations?user=_wYEtSgAAAAJ&hl=en",
    facebook:"https://www.facebook.com/siyam.mizi.94",
    youtube:"https://www.youtube.com/@siyamuddin",
    twitter: "https://x.com/siyamuddin",
  },
  avatar: "/SiyamImage.webp",
  resumeUrl: "/resume.pdf",
};

export const services: Service[] = [
    {
    title: "AI/ML Solutions",
    description: "Intelligent automation, Building Scalable AI agents, LLM integration/Tuning, and workflow automation with n8n,Open-claw, Hermes.",
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
    role: "Full-Stack Engineer (Sellerket)",
    company: "Sellerket LTD",
    period: "2024 — 2026",
    location: "Seoul, South Korea",
    highlights: [
      "Led zero-downtime migration of legacy platform to modern full-stack architecture using React 19 and Java Spring Boot",
      "Architected and deployed flight booking platform handling 50,000+ API requests per hour reliably",
      "Eliminated concurrent booking race conditions through Redis rate limiting and REPEATABLE_READ transaction isolation",
      "Implemented JWT refresh token rotation, OAuth2 (Google), RBAC, CSRF/XSS/HSTS security headers, and audit logging",
      "Integrated TossPay payment gateway with idempotency checks and webhook signature validation",
      "Set up full observability stack: Prometheus, Grafana, Loki + Promtail; containerized all services with Docker Compose",
      "Delivered PWA with i18n multi-language support, keyboard accessibility, and Flyway auto-migration",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "Sellerket LTD",
    period: "2024 — 2026",
    location: "Seoul, South Korea",
    highlights: [
      "Built GlobalSellerket (brand-influencer e-commerce) and SetlOne (social networking + fintech) platforms deployed to AWS production",
      "Transformed legacy PHP 7 codebase to modern Java, Spring Boot, React, TypeScript monolithic architecture",
      "Developed Agentic Automation tool using FastAPI, Whisper ASR, Groq API, LLaMA 3.1, and RAG pipeline — acquired 100+ real users",
      "Built cross-platform iOS and Android mobile apps from single React codebase using Capacitor",
      "Developed automated image and video generation tools for marketing team; delivered multiple investor-facing MVPs",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "AirSeoul",
    category: "Web Development",
    image: "/images/projects/portfolio.jpg",
    url: "https://github.com/Siyamuddin",
    description: "Full-stack flight booking platform handling 50K+ req/hr with Spring Boot, React, Redis, Docker, and AWS",
  },
  {
    title: "GlobalSellerket",
    category: "Web Development",
    image: "/images/projects/n8n.jpg",
    url: "https://shop.setlone.com",
    description: "Brand & influencer e-commerce platform with blockchain-based payment module deployed on AWS",
  },
  {
    title: "SetlOne",
    category: "Applications",
    image: "/images/projects/dashboard.jpg",
    url: "https://setlone.com",
    description: "Social networking + fintech platform with real-time features, WebSocket architecture, and Redis caching",
  },
  {
    title: "Automation Tools",
    category: "Automation",
    image: "/images/projects/ai-agent.jpg",
    url: "",
    description: "Agentic automation with FastAPI, Whisper ASR, RAG pipelines, and LLM integration — 100+ real users",
  },
  {
    title: "Spring Boot API Service",
    category: "Applications",
    image: "/images/projects/spring.jpg",
    url: "",
    description: "RESTful API service with Spring Boot, JPA, MySQL, Redis caching, and Docker containerization",
  },
  {
    title: "View More on GitHub →",
    category: "Applications",
    image: "/images/projects/more.jpg",
    url: "https://github.com/Siyamuddin",
    description: "Check out my full portfolio on GitHub",
  },
];

export const blogPosts: BlogPost[] = [
  {
    title: "Agentic AI in Industrial IoT Security",
    category: "Research",
    date: "Mar 2026",
    dateTime: "2026-03",
    excerpt: "Exploring how autonomous AI agents can transform security monitoring and threat response in Industrial IoT environments.",
    image: "/images/blog/agentic-ai.jpg",
    url: "",
  },
  {
    title: "Integrating AI into Spring Boot with Spring AI",
    category: "Tutorial",
    date: "Feb 2026",
    dateTime: "2026-02",
    excerpt: "A practical guide to using Spring AI starter for adding LLM capabilities to your Java backend applications.",
    image: "/images/blog/spring-ai.jpg",
    url: "",
  },
  {
    title: "Building Production Automation Pipelines with n8n",
    category: "Automation",
    date: "Jan 2026",
    dateTime: "2026-01",
    excerpt: "How I built a scalable automation infrastructure using n8n, Docker, and Cloudflare Tunnel.",
    image: "/images/blog/n8n.jpg",
    url: "",
  },
];

export const navPages: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

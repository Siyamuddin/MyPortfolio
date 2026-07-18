import { Profile, Service, Skill, Education, Experience, Project, BlogPost } from "@/lib/types";

export const profile: Profile = {
  name: "Siyam Uddin",
  title: "Software Developer",
  email: "siyamuddin177@gmail.com",
  location: "Seoul, South Korea",
  bio: [
    "A passionate Software Developer with strong expertise in full-stack development, AI/ML integration, and automation solutions. Proven track record in delivering cutting-edge solutions, including API integration, scalable backend services, and intelligent workflow automation. Adept at debugging to ensure high-quality, responsive applications and an agile collaborator committed to staying current with industry trends.",
    "I'm a final-year Computer Science & Engineering student, actively researching Agentic AI in Industrial IoT Security for a Q1 journal publication. I specialize in Java, Spring Boot, React, TypeScript, Python, Docker, and n8n — building everything from production APIs to autonomous AI agents.",
  ],
  bioHighlight: "Agentic AI in Industrial IoT Security",
  socials: {
    github: "https://github.com/Siyamuddin",
    linkedin: "https://linkedin.com/in/siyamuddin",
    twitter: "https://x.com/siyamuddin",
  },
  avatar: "/images/avatar.jpg",
};

export const services: Service[] = [
  {
    title: "Mobile Apps",
    description: "Professional development of applications for Android and iOS using React Native and Flutter.",
    icon: "Smartphone",
  },
  {
    title: "Web Development",
    description: "High-quality development of full-stack web applications with React, Spring Boot, and modern frameworks.",
    icon: "Code2",
  },
  {
    title: "AI/ML Solutions",
    description: "Intelligent automation, AI agents, LLM integration, and workflow automation with n8n and LangChain.",
    icon: "Sparkles",
  },
  {
    title: "Backend Development",
    description: "High-performance backend services with Spring Boot, FastAPI, MySQL, Redis, and Docker.",
    icon: "Server",
  },
];

export const skills: Skill[] = [
  { name: "Java", color: "#ED8B00", icon: "java" },
  { name: "Spring Boot", color: "#6DB33F", icon: "leaf" },
  { name: "React", color: "#61DAFB", icon: "react" },
  { name: "TypeScript", color: "#3178C6", icon: "typescript" },
  { name: "Python", color: "#FFD43B", icon: "python" },
  { name: "Docker", color: "#2496ED", icon: "docker" },
  { name: "MySQL", color: "#4479A1", icon: "database" },
  { name: "Redis", color: "#FF4438", icon: "zap" },
  { name: "Git", color: "#F05032", icon: "git" },
  { name: "FastAPI", color: "#009688", icon: "rocket" },
];

export const education: Education[] = [
  {
    school: "University",
    degree: "B.Sc. Computer Science & Engineering",
    period: "2022 — 2026",
    description: "Final year B.Sc. in Computer Science & Engineering. Research focus: Agentic AI in Industrial IoT Security.",
  },
];

export const experience: Experience[] = [
  {
    role: "Research Assistant",
    company: "Agentic AI / IoT Security",
    period: "2025 — Present",
    location: "Seoul, South Korea",
    highlights: [
      "Researching autonomous AI agents for securing Industrial IoT systems",
      "Targeting Q1 journal publication on Agentic AI in IIoT Security",
      "Building experimental frameworks with LangChain, n8n, and custom agent architectures",
    ],
  },
  {
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    period: "2023 — Present",
    location: "Remote",
    highlights: [
      "Developed and deployed full-stack web applications using React, Spring Boot, and MySQL",
      "Built automation workflows with n8n, integrating 20+ third-party APIs",
      "Designed cloud infrastructure on AWS and Railway for scalable deployments",
      "Delivered end-to-end solutions for clients across education and e-commerce sectors",
    ],
  },
  {
    role: "Open Source Contributor",
    company: "GitHub",
    period: "2024 — Present",
    location: "Remote",
    highlights: [
      "Active contributor to developer tooling and AI/automation projects",
      "Published multiple repos: Hermes Agent configurations, n8n workflows, automation tools",
      "Portfolio site: github.com/Siyamuddin",
    ],
  },
];

export const projects: Project[] = [
  {
    title: "Personal Portfolio",
    category: "Web Development",
    image: "/images/projects/portfolio.jpg",
    url: "https://siyamuddin.github.io",
    description: "Modern dark-themed portfolio with Three.js and GSAP animations",
  },
  {
    title: "n8n Automation Workflows",
    category: "Automation",
    image: "/images/projects/n8n.jpg",
    url: "#",
    description: "Production automation pipelines with n8n, Docker, and 20+ API integrations",
  },
  {
    title: "AI Research Dashboard",
    category: "Web Development",
    image: "/images/projects/dashboard.jpg",
    url: "#",
    description: "Analytics dashboard for AI agent performance monitoring",
  },
  {
    title: "Spring Boot API Service",
    category: "Applications",
    image: "/images/projects/spring.jpg",
    url: "#",
    description: "RESTful API service with Spring Boot, JPA, and MySQL",
  },
  {
    title: "Autonomous AI Agent",
    category: "Automation",
    image: "/images/projects/ai-agent.jpg",
    url: "#",
    description: "Multi-agent system for automated research and content generation",
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
    excerpt: "Exploring how autonomous AI agents can transform security monitoring and threat response in Industrial IoT environments.",
    image: "/images/blog/agentic-ai.jpg",
    url: "#",
  },
  {
    title: "Integrating AI into Spring Boot with Spring AI",
    category: "Tutorial",
    date: "Feb 2026",
    excerpt: "A practical guide to using Spring AI starter for adding LLM capabilities to your Java backend applications.",
    image: "/images/blog/spring-ai.jpg",
    url: "#",
  },
  {
    title: "Building Production Automation Pipelines with n8n",
    category: "Automation",
    date: "Jan 2026",
    excerpt: "How I built a scalable automation infrastructure using n8n, Docker, and Cloudflare Tunnel.",
    image: "/images/blog/n8n.jpg",
    url: "#",
  },
];

export const navPages: { id: string; label: string }[] = [
  { id: "about", label: "About" },
  { id: "resume", label: "Resume" },
  { id: "portfolio", label: "Portfolio" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

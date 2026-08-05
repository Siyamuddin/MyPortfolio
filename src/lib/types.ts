export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Skill {
  name: string;
  color: string;
  icon: string;
}

export interface Education {
  school: string;
  degree: string;
  period: string;
  description: string;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location: string;
  highlights: string[];
}

export interface Project {
  title: string
  category: "Web Development" | "Applications" | "Automation"
  image: string
  url: string
  description: string
  highlight?: string
  githubUrl?: string
}

export interface BlogPost {
  id?: string
  title: string
  category: string
  date: string
  dateTime: string
  excerpt: string
  image: string
  url: string
  slug: string
  body: string
  status: "draft" | "published"
}

export interface Faq {
  id?: string
  question: string
  answer: string
  sortOrder?: number
}

export interface BlogComment {
  id: string
  postId: string
  authorName: string
  authorEmail: string
  body: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export type NavPage = "about" | "resume" | "portfolio" | "blog" | "contact"

export interface Profile {
  name: string;
  title: string;
  email: string;
  location: string;
  bio: string[];
  bioHighlight: string;
  socials: {
    github: string;
    linkedin: string;
    googlescholar: string;
    facebook: string;
    youtube: string;
    twitter: string;
  };
  avatar: string;
  resumeUrl?: string;
}

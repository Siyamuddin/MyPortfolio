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
  title: string;
  category: "Web Development" | "Applications" | "Automation";
  image: string;
  url: string;
  description: string;
}

export interface BlogPost {
  title: string;
  category: string;
  date: string;
  dateTime: string;
  excerpt: string;
  image: string;
  url: string;
}

export type NavPage = "about" | "resume" | "portfolio" | "blog" | "contact";

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

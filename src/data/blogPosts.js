export const blogPosts = [
  {
    id: 1,
    title: "Building Scalable AI Applications with LangChain4j and Spring Boot",
    slug: "building-scalable-ai-applications-langchain4j-spring-boot",
    excerpt: "Learn how I built AiBuddy, an AI-powered student support application that improved response relevance by 30% using LangChain4j, Llama3, and Redis caching.",
    content: "Full article content here...",
    author: "Siyam Uddin",
    datePublished: "2024-12-01",
    dateModified: "2024-12-01",
    category: "Backend Development",
    tags: ["Java", "Spring Boot", "AI", "LangChain4j", "Redis"],
    image: "/aibuddy.png",
    readTime: "8 min read",
    featured: true
  },
  {
    id: 2,
    title: "Microservices Architecture: Lessons Learned from Production",
    slug: "microservices-architecture-lessons-learned",
    excerpt: "Key insights from building and deploying microservices in production, including challenges, solutions, and best practices.",
    content: "Full article content here...",
    author: "Siyam Uddin",
    datePublished: "2024-11-15",
    dateModified: "2024-11-15",
    category: "Architecture",
    tags: ["Microservices", "Spring Boot", "AWS", "Docker"],
    image: "/portfolio.png",
    readTime: "12 min read",
    featured: false
  },
  {
    id: 3,
    title: "Optimizing Spring Boot Applications: Performance Tips and Tricks",
    slug: "optimizing-spring-boot-applications-performance",
    excerpt: "Practical strategies for improving Spring Boot application performance, including caching, database optimization, and monitoring.",
    content: "Full article content here...",
    author: "Siyam Uddin",
    datePublished: "2024-11-01",
    dateModified: "2024-11-01",
    category: "Backend Development",
    tags: ["Spring Boot", "Performance", "Redis", "Optimization"],
    image: "/stm.png",
    readTime: "10 min read",
    featured: false
  }
];

export const getBlogPostBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getFeaturedPosts = () => {
  return blogPosts.filter(post => post.featured);
};

export const getPostsByCategory = (category) => {
  return blogPosts.filter(post => post.category === category);
};

export const getPostsByTag = (tag) => {
  return blogPosts.filter(post => post.tags.includes(tag));
};


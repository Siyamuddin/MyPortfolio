/**
 * SEO Utilities and Schema Generators
 * Generates structured data (JSON-LD) for various content types
 */

export const generatePersonSchema = (bio) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": bio.name,
  "jobTitle": bio.roles?.[0] || "Software Engineer",
  "url": "https://siyamuddin.xyz",
  "sameAs": [
    bio.github,
    bio.linkedin,
    bio.twitter,
    bio.insta,
    bio.facebook,
    bio.youtube
  ].filter(Boolean),
  "alumniOf": {
    "@type": "CollegeOrUniversity",
    "name": "Sejong University",
    "location": {
      "@type": "Place",
      "addressLocality": "Seoul",
      "addressCountry": "KR"
    }
  },
  "knowsAbout": [
    "Java",
    "Spring Boot",
    "Microservices",
    "DevOps",
    "AWS",
    "AI Applications",
    "Backend Development"
  ],
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Seoul",
    "addressCountry": "KR"
  }
});

export const generateProjectSchema = (project, index) => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": project.title,
  "description": project.description,
  "url": project.webapp || project.github,
  "applicationCategory": "WebApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "datePublished": project.date?.split(' - ')[0] || "2024",
  "author": {
    "@type": "Person",
    "name": "Siyam Uddin"
  },
  "programmingLanguage": project.tags?.filter(tag => 
    ["Java", "JavaScript", "Python", "React", "Spring Boot"].some(tech => 
      tag.includes(tech)
    )
  ) || [],
  "keywords": project.tags?.join(", ") || ""
});

export const generateBreadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Siyam Uddin - Portfolio",
  "url": "https://siyamuddin.xyz",
  "logo": "https://siyamuddin.xyz/HeroImage.webp",
  "sameAs": [
    "https://github.com/Siyamuddin",
    "https://www.linkedin.com/in/uddin-siyam-8953511ab/",
    "https://x.com/SiyamUddin12"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Professional",
    "email": "contact@siyamuddin.xyz"
  }
});

export const generateWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Siyam Uddin Portfolio",
  "url": "https://siyamuddin.xyz",
  "description": "Portfolio website of Siyam Uddin, a Java Backend Developer specializing in Spring Boot and AI applications",
  "author": {
    "@type": "Person",
    "name": "Siyam Uddin"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://siyamuddin.xyz/?search={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
});

export const generateArticleSchema = (article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "image": article.image,
  "datePublished": article.datePublished,
  "dateModified": article.dateModified || article.datePublished,
  "author": {
    "@type": "Person",
    "name": "Siyam Uddin",
    "url": "https://siyamuddin.xyz"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Siyam Uddin",
    "logo": {
      "@type": "ImageObject",
      "url": "https://siyamuddin.xyz/HeroImage.webp"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": article.url
  }
});

export const generateCourseSchema = (course) => ({
  "@context": "https://schema.org",
  "@type": "Course",
  "name": course.name,
  "description": course.description,
  "provider": {
    "@type": "Organization",
    "name": course.provider || "Online Learning Platform"
  },
  "courseCode": course.code,
  "educationalCredentialAwarded": course.credential
});


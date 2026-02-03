import { Helmet } from 'react-helmet-async';
import { 
  generatePersonSchema, 
  generateProjectSchema, 
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema
} from '../../utils/seo';
import { Bio, projects } from '../../data/constants';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface StructuredDataProps {
  currentPage?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQ[];
}

export const StructuredData = ({ currentPage, breadcrumbs, faqs }: StructuredDataProps) => {
  const baseUrl = 'https://siyamuddin.xyz';
  
  // Default breadcrumbs if not provided
  const defaultBreadcrumbs = breadcrumbs || [
    { name: 'Home', url: baseUrl },
    { name: currentPage || 'Portfolio', url: `${baseUrl}#${currentPage?.toLowerCase() || 'about'}` }
  ];

  return (
    <Helmet>
      {/* Person Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generatePersonSchema(Bio))}
      </script>

      {/* WebSite Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generateWebSiteSchema())}
      </script>

      {/* Organization Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generateOrganizationSchema())}
      </script>

      {/* Breadcrumb Schema */}
      <script type="application/ld+json">
        {JSON.stringify(generateBreadcrumbSchema(defaultBreadcrumbs))}
      </script>

      {/* Project Schemas */}
      {projects.map((project, index) => (
        <script key={project.id || index} type="application/ld+json">
          {JSON.stringify(generateProjectSchema(project, index))}
        </script>
      ))}

      {/* FAQ Schema */}
      {faqs && faqs.length > 0 && (
        <script type="application/ld+json">
          {JSON.stringify(generateFAQSchema(faqs))}
        </script>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="application-name" content="Siyam Uddin Portfolio" />
      <meta name="apple-mobile-web-app-title" content="Siyam Portfolio" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-TileColor" content="#854CE6" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Enhanced Open Graph */}
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
      {/* Enhanced Twitter Card */}
      <meta name="twitter:site" content="@SiyamUddin12" />
      <meta name="twitter:domain" content="siyamuddin.xyz" />
    </Helmet>
  );
};

export default StructuredData;

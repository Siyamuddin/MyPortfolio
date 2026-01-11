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

export const StructuredData = ({ currentPage, breadcrumbs, faqs }) => {
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
    </Helmet>
  );
};

export default StructuredData;


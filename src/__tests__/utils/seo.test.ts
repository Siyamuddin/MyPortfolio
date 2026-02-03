import {
  generatePersonSchema,
  generateProjectSchema,
  generateWebSiteSchema,
  generateOrganizationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from '../../utils/seo';
import { Bio, projects } from '../../data/constants';

describe('SEO Utilities', () => {
  describe('generatePersonSchema', () => {
    it('should generate valid person schema', () => {
      const schema = generatePersonSchema(Bio);
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Person');
      expect(schema.name).toBe(Bio.name);
      expect(schema.jobTitle).toBeDefined();
    });
  });

  describe('generateProjectSchema', () => {
    it('should generate valid project schema', () => {
      const project = projects[0];
      const schema = generateProjectSchema(project, 0);
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('SoftwareApplication');
      expect(schema.name).toBe(project.title);
      expect(schema.description).toBe(project.description);
    });
  });

  describe('generateWebSiteSchema', () => {
    it('should generate valid website schema', () => {
      const schema = generateWebSiteSchema();
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.url).toBe('https://siyamuddin.xyz');
    });
  });

  describe('generateOrganizationSchema', () => {
    it('should generate valid organization schema', () => {
      const schema = generateOrganizationSchema();
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBeDefined();
    });
  });

  describe('generateBreadcrumbSchema', () => {
    it('should generate valid breadcrumb schema', () => {
      const items = [
        { name: 'Home', url: 'https://siyamuddin.xyz' },
        { name: 'About', url: 'https://siyamuddin.xyz#about' },
      ];
      const schema = generateBreadcrumbSchema(items);
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(2);
    });
  });

  describe('generateFAQSchema', () => {
    it('should generate valid FAQ schema', () => {
      const faqs = [
        { question: 'Test Question?', answer: 'Test Answer' },
      ];
      const schema = generateFAQSchema(faqs);
      
      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(1);
    });
  });
});

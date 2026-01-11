const fs = require('fs');
const path = require('path');

const baseUrl = 'https://siyamuddin.xyz';
const currentDate = new Date().toISOString().split('T')[0];

// Import projects data (simplified for Node.js)
const projects = [
  { id: 0, title: 'Lecture2Notebook' },
  { id: 1, title: 'AiBuddy' },
  { id: 2, title: 'NoorMart' },
  { id: 3, title: 'ChatBees' },
  { id: 4, title: 'Smart Task-Manager' },
  { id: 5, title: 'Portfolio' }
];

const sections = [
  { url: '/', priority: '1.0', changefreq: 'weekly' },
  { url: '/#about', priority: '0.9', changefreq: 'monthly' },
  { url: '/#skills', priority: '0.8', changefreq: 'monthly' },
  { url: '/#experience', priority: '0.9', changefreq: 'monthly' },
  { url: '/#projects', priority: '1.0', changefreq: 'weekly' },
  { url: '/#social-proof', priority: '0.8', changefreq: 'weekly' },
  { url: '/#education', priority: '0.7', changefreq: 'yearly' },
  { url: '/#learning', priority: '0.8', changefreq: 'monthly' },
  { url: '/#faq', priority: '0.7', changefreq: 'monthly' },
  { url: '/#contact', priority: '0.8', changefreq: 'monthly' }
];

// Generate project URLs
const projectUrls = projects.map(project => ({
  url: `/#projects`,
  priority: '0.9',
  changefreq: 'monthly'
}));

const allUrls = [...sections, ...projectUrls];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls.map(item => `  <url>
    <loc>${baseUrl}${item.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const publicDir = path.join(__dirname, '..', 'public');
const sitemapPath = path.join(publicDir, 'sitemap.xml');

fs.writeFileSync(sitemapPath, sitemap, 'utf8');
console.log('✅ Sitemap generated successfully at:', sitemapPath);
console.log(`   Generated ${allUrls.length} URLs`);


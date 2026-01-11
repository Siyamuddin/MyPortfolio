/**
 * Google Analytics 4 (GA4) Event Tracking
 * Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
 */

export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize GA4
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID !== 'G-XXXXXXXXXX') {
    // Load gtag script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname + window.location.search,
      });
    `;
    document.head.appendChild(script2);
  }
};

// Track page views
export const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific interactions
export const trackProjectView = (projectTitle) => {
  trackEvent('view_project', 'Projects', projectTitle);
};

export const trackResumeDownload = () => {
  trackEvent('download_resume', 'Engagement', 'Resume Download');
};

export const trackContactFormSubmit = () => {
  trackEvent('submit_contact_form', 'Contact', 'Form Submission');
};

export const trackSocialShare = (platform, content) => {
  trackEvent('share', 'Social', platform, content);
};

export const trackSkillClick = (skillName) => {
  trackEvent('click_skill', 'Skills', skillName);
};

export const trackScrollDepth = (depth) => {
  trackEvent('scroll', 'Engagement', `Scroll Depth: ${depth}%`, depth);
};

export const trackTimeOnPage = (seconds) => {
  trackEvent('time_on_page', 'Engagement', 'Time Spent', seconds);
};

// Track conversions
export const trackConversion = (conversionName, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      event_category: 'Conversion',
      event_label: conversionName,
      value: value,
    });
  }
};


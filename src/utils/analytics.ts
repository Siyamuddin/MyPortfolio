/**
 * Google Analytics 4 (GA4) Event Tracking
 * Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// Initialize GA4
export const initGA = (): void => {
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
export const trackPageView = (path: string): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track specific interactions
export const trackProjectView = (projectTitle: string): void => {
  trackEvent('view_project', 'Projects', projectTitle);
};

export const trackResumeDownload = (): void => {
  trackEvent('download_resume', 'Engagement', 'Resume Download');
};

export const trackContactFormSubmit = (): void => {
  trackEvent('submit_contact_form', 'Contact', 'Form Submission');
};

export const trackSocialShare = (platform: string, content: string): void => {
  trackEvent('share', 'Social', platform, undefined);
};

export const trackSkillClick = (skillName: string): void => {
  trackEvent('click_skill', 'Skills', skillName);
};

export const trackScrollDepth = (depth: number): void => {
  trackEvent('scroll', 'Engagement', `Scroll Depth: ${depth}%`, depth);
};

export const trackTimeOnPage = (seconds: number): void => {
  trackEvent('time_on_page', 'Engagement', 'Time Spent', seconds);
};

// Track conversions
export const trackConversion = (conversionName: string, value: number): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_MEASUREMENT_ID,
      event_category: 'Conversion',
      event_label: conversionName,
      value: value,
    });
  }
};

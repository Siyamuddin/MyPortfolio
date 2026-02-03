/**
 * Core Web Vitals Optimization Utilities
 * Helps improve LCP, CLS, and FID scores
 */

// Optimize Largest Contentful Paint (LCP)
export const optimizeLCP = (): void => {
  // Preload critical resources
  const criticalResources = [
    '/HeroImage.webp',
    '/static/css/main.css'
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    link.as = resource.endsWith('.css') ? 'style' : 'image';
    document.head.appendChild(link);
  });
};

// Prevent Cumulative Layout Shift (CLS)
export const preventCLS = (): void => {
  // Add width and height to images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.width || !img.height) {
      img.addEventListener('load', () => {
        if (!img.style.width && !img.style.height) {
          img.style.width = img.naturalWidth + 'px';
          img.style.height = img.naturalHeight + 'px';
        }
      });
    }
  });

  // Reserve space for dynamic content
  const dynamicElements = document.querySelectorAll('[data-dynamic]');
  dynamicElements.forEach(el => {
    if (!el.style.minHeight) {
      el.style.minHeight = el.offsetHeight + 'px';
    }
  });
};

// Optimize First Input Delay (FID)
export const optimizeFID = (): void => {
  // Defer non-critical JavaScript
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach(script => {
    script.defer = true;
  });

  // Use requestIdleCallback for non-critical tasks
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      // Load non-critical resources
      const nonCriticalResources = document.querySelectorAll('[data-non-critical]');
      nonCriticalResources.forEach(resource => {
        if (resource.tagName === 'IMG') {
          (resource as HTMLImageElement).loading = 'lazy';
        }
      });
    });
  }
};

// Initialize all optimizations
export const initPerformanceOptimizations = (): void => {
  if (typeof window !== 'undefined') {
    optimizeLCP();
    preventCLS();
    optimizeFID();
  }
};

// Measure and report Core Web Vitals
export const measureWebVitals = (): void => {
  if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
    // Measure LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP measurement not supported');
    }

    // Measure CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean; value?: number };
          if (!layoutShiftEntry.hadRecentInput && layoutShiftEntry.value) {
            clsValue += layoutShiftEntry.value;
          }
        }
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS measurement not supported');
    }

    // Measure FID
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const fidEntry = entry as PerformanceEntry & { processingStart?: number; startTime?: number };
          if (fidEntry.processingStart && fidEntry.startTime) {
            console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
          }
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID measurement not supported');
    }
  }
};

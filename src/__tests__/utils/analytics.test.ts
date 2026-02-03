import { 
  initGA, 
  trackPageView, 
  trackEvent, 
  trackProjectView,
  trackResumeDownload,
  trackContactFormSubmit,
  trackScrollDepth,
  trackTimeOnPage
} from '../../utils/analytics';

describe('Analytics Utilities', () => {
  beforeEach(() => {
    // Clear any existing gtag mocks
    (window as any).gtag = undefined;
    (window as any).dataLayer = [];
    document.head.innerHTML = '';
  });

  describe('initGA', () => {
    it('should initialize GA when measurement ID is provided', () => {
      process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-TEST123';
      initGA();
      
      const scripts = document.head.querySelectorAll('script');
      expect(scripts.length).toBeGreaterThan(0);
    });

    it('should not initialize GA when measurement ID is default', () => {
      process.env.REACT_APP_GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';
      initGA();
      
      const scripts = document.head.querySelectorAll('script');
      expect(scripts.length).toBe(0);
    });
  });

  describe('trackPageView', () => {
    it('should track page view when gtag is available', () => {
      (window as any).gtag = jest.fn();
      trackPageView('/test-path');
      
      expect((window as any).gtag).toHaveBeenCalledWith('config', expect.any(String), {
        page_path: '/test-path',
      });
    });

    it('should not track when gtag is not available', () => {
      trackPageView('/test-path');
      // Should not throw error
      expect(true).toBe(true);
    });
  });

  describe('trackEvent', () => {
    it('should track event when gtag is available', () => {
      (window as any).gtag = jest.fn();
      trackEvent('click', 'button', 'submit', 1);
      
      expect((window as any).gtag).toHaveBeenCalledWith('event', 'click', {
        event_category: 'button',
        event_label: 'submit',
        value: 1,
      });
    });
  });

  describe('trackProjectView', () => {
    it('should track project view', () => {
      (window as any).gtag = jest.fn();
      trackProjectView('Test Project');
      
      expect((window as any).gtag).toHaveBeenCalled();
    });
  });

  describe('trackResumeDownload', () => {
    it('should track resume download', () => {
      (window as any).gtag = jest.fn();
      trackResumeDownload();
      
      expect((window as any).gtag).toHaveBeenCalled();
    });
  });

  describe('trackContactFormSubmit', () => {
    it('should track contact form submit', () => {
      (window as any).gtag = jest.fn();
      trackContactFormSubmit();
      
      expect((window as any).gtag).toHaveBeenCalled();
    });
  });

  describe('trackScrollDepth', () => {
    it('should track scroll depth', () => {
      (window as any).gtag = jest.fn();
      trackScrollDepth(50);
      
      expect((window as any).gtag).toHaveBeenCalled();
    });
  });

  describe('trackTimeOnPage', () => {
    it('should track time on page', () => {
      (window as any).gtag = jest.fn();
      trackTimeOnPage(60);
      
      expect((window as any).gtag).toHaveBeenCalled();
    });
  });
});

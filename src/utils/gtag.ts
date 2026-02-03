/**
 * Google Tag Manager / Analytics helper
 */

export const gtag = (...args: unknown[]): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

export default gtag;

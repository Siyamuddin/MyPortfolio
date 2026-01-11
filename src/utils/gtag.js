/**
 * Google Tag Manager / Analytics helper
 */

export const gtag = (...args) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
};

export default gtag;


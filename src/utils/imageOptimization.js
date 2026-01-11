/**
 * Image Optimization Utilities
 * Handles responsive images, WebP support, and lazy loading
 */

export const generateImageSrcSet = (basePath, sizes = [400, 800, 1200]) => {
  // If it's already a full URL, return as is
  if (basePath.startsWith('http')) {
    return basePath;
  }
  
  // Generate srcset for different sizes
  return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
};

export const getImageSrc = (imagePath, fallback = '/fallback-image.png') => {
  if (!imagePath) return fallback;
  
  // Check if WebP is supported
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  // If image is already optimized or external, return as is
  if (imagePath.startsWith('http') || imagePath.includes('.webp')) {
    return imagePath;
  }

  // Try to use WebP version if available
  if (supportsWebP()) {
    const webpPath = imagePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    return webpPath;
  }

  return imagePath;
};

export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

export const optimizeImageAttributes = (imagePath, alt, width, height) => {
  return {
    src: getImageSrc(imagePath),
    srcSet: generateImageSrcSet(imagePath),
    alt: alt || 'Image',
    width: width,
    height: height,
    loading: 'lazy',
    decoding: 'async',
    fetchpriority: width > 800 ? 'high' : 'low'
  };
};


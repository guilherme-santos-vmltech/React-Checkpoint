import { useEffect } from 'react';

export const usePreloadImage = (imageUrl: string) => {
useEffect(() => {
  // Create and add preload link
  const preloadLink = document.createElement('link');
  preloadLink.rel = 'preload';
  preloadLink.as = 'image';
  preloadLink.href = imageUrl;
  preloadLink.fetchPriority = 'high';
  document.head.appendChild(preloadLink);

  return () => {
    if (preloadLink && document.head.contains(preloadLink)) {
      document.head.removeChild(preloadLink);
    }
  };
}, [imageUrl]); 
};
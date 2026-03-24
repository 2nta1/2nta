declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const loadScript = async () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.error('Google Maps API key is not set in environment variables');
    throw new Error('Google Maps API key is missing');
  }

  // Remove any existing Google Maps script to prevent conflicts
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap&v=weekly`;
  script.async = true;
  script.defer = true;
  
  // Add error handling
  script.onerror = (error) => {
    console.error('Error loading Google Maps:', error);
    throw new Error('Failed to load Google Maps script');
  };

  // Add script to document
  document.head.appendChild(script);
  
  return new Promise((resolve, reject) => {
    script.onload = () => {
      if (typeof window.google === 'undefined') {
        reject(new Error('Google Maps failed to initialize'));
      } else {
        // Wait for the callback to be defined
        const checkInitMap = setInterval(() => {
          if (typeof window.initMap === 'function') {
            clearInterval(checkInitMap);
            resolve(true);
          }
        }, 100);
      }
    };
  });
};

let googleMapsPromise: Promise<void> | null = null;

const loadGoogleMapsAPI = (apiKey: string): Promise<void> => {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (typeof window.google !== 'undefined' && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&v=beta&loading=async&callback=initMapCallback`;
    script.async = true;
    script.defer = true;

    (window as any).initMapCallback = () => resolve();

    script.onerror = () => reject(new Error('Failed to load Google Maps API'));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

export const initGoogleMap = async (): Promise<void> => {
  const mapElement = document.getElementById('google-map');
  if (!mapElement) return;

  const apiKey = mapElement.getAttribute('data-api-key');
  if (!apiKey) return;

  const startMap = async () => {
    mapElement.setAttribute('role', 'region');
    mapElement.setAttribute('aria-label', 'Google Map showing Menjačnica Genes location');

    const fixIframeAccessibility = () => {
      const iframes = mapElement.querySelectorAll('iframe');
      iframes.forEach((iframe, index) => {
        if (!iframe.hasAttribute('title')) {
          iframe.setAttribute(
            'title',
            `Google Map - Menjačnica Genes${index > 0 ? ` ${index + 1}` : ''}`
          );
        }
        if (!iframe.hasAttribute('aria-label')) {
          iframe.setAttribute('aria-label', 'Interactive map showing business location');
        }
        if (!iframe.hasAttribute('loading')) {
          iframe.setAttribute('loading', 'lazy');
        }
      });
    };

    const fixAriaRoles = () => {
      const elements = mapElement.querySelectorAll('[role="button"], [role="link"]');
      elements.forEach((el) => {
        const tagName = el.tagName.toLowerCase();
        if (tagName !== 'button' && tagName !== 'a' && tagName !== 'input') {
          el.removeAttribute('role');
        }

        if (
          tagName.startsWith('gmp-') ||
          (tagName !== 'button' && tagName !== 'a' && tagName !== 'input')
        ) {
          if (el.hasAttribute('tabindex')) {
            el.removeAttribute('tabindex');
          }
        }
      });
    };

    const observer = new MutationObserver(() => {
      fixIframeAccessibility();
      fixAriaRoles();
    });

    observer.observe(mapElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['role'],
    });

    try {
      await loadGoogleMapsAPI(apiKey);

      const center = { lat: 45.258359263048064, lng: 19.823252542084486 };

      const mapOptions: google.maps.MapOptions = {
        center,
        zoom: 15,
        mapId: '68a115ad7d04103ce4117501',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true,
        colorScheme: 'DARK',
      };

      const map = new window.google!.maps.Map(mapElement, mapOptions);

      setTimeout(() => {
        fixIframeAccessibility();
        fixAriaRoles();
      }, 500);

      setTimeout(() => {
        fixIframeAccessibility();
        fixAriaRoles();
      }, 2000);

      const { AdvancedMarkerElement } = (await window.google!.maps.importLibrary(
        'marker'
      )) as google.maps.MarkerLibrary;

      const marker = new AdvancedMarkerElement({
        map,
        position: center,
        title: 'Menjačnica Genes',
      });

      const infoWindow = new window.google!.maps.InfoWindow({
        content: `
        <div style="max-width: 250px;">
          <h3 style="font-size: 16px; font-weight: 600;">Menjačnica Genes</h3>
          <p style="margin-top: 10px; font-size: 14px; color: #666;">
            Hajduk Veljkova 11, Novi Sad
          </p>
          <a href="https://maps.google.com/?q=Menjačnica+Genes" 
             target="_blank" 
             style="display: block; margin-top: 10px; color: #BFA14A; text-decoration: none; font-size: 14px;">
            Vidi na Google Maps
          </a>
        </div>
      `,
      });

      infoWindow.open(map, marker);

      marker.addListener('gmp-click', () => {
        infoWindow.open(map, marker);
      });
    } catch (error) {
      console.error('Google Maps error:', error);
    }
  };

  const intersectionObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startMap();
          observer.disconnect();
        }
      });
    },
    { rootMargin: '200px' }
  );

  intersectionObserver.observe(mapElement);
};

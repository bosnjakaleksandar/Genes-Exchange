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

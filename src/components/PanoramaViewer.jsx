import { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

export default function PanoramaViewer({ imageId, onImage }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !imageId) return;
    const viewer = new Viewer({
      container: ref.current,
      accessToken: import.meta.env.VITE_MAPILLARY_TOKEN,
      imageId,
    });
    
    viewer.on('image', ev => {
      const latLon = ev.image?.originalLatLon || ev.image?.latLon;
      onImage?.(latLon ? { lat: latLon.lat, lng: latLon.lon } : null);
    });
    return () => viewer.remove();
  }, [imageId, onImage]);
  return <div ref={ref} style={{ width:'100%', height:'100%' }} />;
}

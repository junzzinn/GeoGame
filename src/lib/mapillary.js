const TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;

export const REGIONS = {
  worldCities: [
    [-9.23, 38.69, -8.96, 38.84],
    [-0.51, 51.28, 0.33, 51.70],
    [139.55, 35.48, 139.91, 35.86],
    [-123.26,49.17,-123.02,49.32],
    [-46.81,-23.75,-46.34,-23.36],
  ],
  brazil: [[-74.1,-33.8,-34.8,5.4]],
  europe: [[-11,34,31,71]],
  japan: [[129,31,146,46]],
};

async function fetchImagesInBbox(bbox) {
  const url = new URL('https://graph.mapillary.com/images');
  url.searchParams.set('fields', 'id,computed_geometry');
  url.searchParams.set('bbox', bbox.join(','));
  url.searchParams.set('limit', '50');
  const res = await fetch(url.toString(), {
    headers: { Authorization: `OAuth ${TOKEN}` }
  });
  if (!res.ok) throw new Error(`Mapillary error: ${res.status}`);
  const data = await res.json(); // { data: [{id, computed_geometry:{type,coordinates:[lon,lat]}}] }
  return data?.data ?? [];
}

export async function getRandomImageFromRegions(regionKey = 'worldCities') {
  const list = REGIONS[regionKey] ?? REGIONS.worldCities;
  const shuffled = list.slice().sort(() => Math.random() - 0.5);
  for (const bbox of shuffled) {
    const images = await fetchImagesInBbox(bbox);
    if (images.length) {
      const chosen = images[Math.floor(Math.random() * images.length)];
      const coords = chosen?.computed_geometry?.coordinates;
      return {
        imageId: chosen.id,
        target: coords ? { lat: coords[1], lng: coords[0] } : null,
      };
    }
  }
  throw new Error('Nenhuma imagem encontrada nas regiões especificadas.');
}

export function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371, toRad = d => d * Math.PI / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
export function scoreByDistance_km(d) {
  const max = 5000, falloffKm = 2000;
  const s = Math.max(0, 1 - d / falloffKm);
  return Math.round(max * Math.pow(s, 2.2));
}

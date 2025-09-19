const PANOS = [
  { id: "1", src: "/panos/1.jpg", lat: 35.6595, lng: 139.7005 },

  { id: "2", src: "/panos/2.jpg", lat: 45.4380, lng: 12.3358 },

  { id: "3", src: "/panos/3.jpg", lat: -2.5106, lng: -54.9496 },

  { id: "4", src: "/panos/4.jpg", lat: 49.2827, lng: -123.1207 },

  { id: "5", src: "/panos/5.jpg", lat: 48.8566, lng: 2.3522 },
];

export async function getRandomOfflinePanorama() {
  const chosen = PANOS[Math.floor(Math.random() * PANOS.length)];
  return {
    panoId: chosen.id,
    src: chosen.src,
    target: { lat: chosen.lat, lng: chosen.lng },
  };
}

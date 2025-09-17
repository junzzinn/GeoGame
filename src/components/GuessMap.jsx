import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onGuess }) {
  useMapEvents({
    click(e) {
      onGuess({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function GuessMap({ guess, onGuess }) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ClickHandler onGuess={onGuess} />
      {guess && <Marker icon={markerIcon} position={[guess.lat, guess.lng]} />}
    </MapContainer>
  );
}

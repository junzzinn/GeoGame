import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import iconUrl from "leaflet/dist/images/marker-icon.png";
import icon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";
const DefaultIcon = L.icon({ iconUrl, iconRetinaUrl: icon2xUrl, shadowUrl, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function ClickToGuess({ onGuess }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onGuess?.({ lat, lng });
    },
  });
  return null;
}

function FitAfterSubmit({ guess, target, showAnswer }) {
  const map = useMap();
  useEffect(() => {
    if (!showAnswer || !guess || !target) return;
    const b = L.latLngBounds([guess.lat, guess.lng], [target.lat, target.lng]);
    map.fitBounds(b, { padding: [40, 40] });
  }, [map, guess, target, showAnswer]);
  return null;
}

export default function GuessMap({ guess, target, showAnswer, onGuess }) {
  const center = guess ? [guess.lat, guess.lng] : [20, 0];
  const zoom = guess ? 4 : 2;

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ width: "100%", height: "100%" }}
      worldCopyJump
      minZoom={2}
      maxZoom={18}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; OpenStreetMap'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ClickToGuess onGuess={onGuess} />
      <FitAfterSubmit guess={guess} target={target} showAnswer={showAnswer} />

      {guess && <Marker position={[guess.lat, guess.lng]} />}
      {showAnswer && target && (
        <>
          <Marker position={[target.lat, target.lng]} />
          {guess && <Polyline positions={[[guess.lat, guess.lng], [target.lat, target.lng]]} />}
        </>
      )}
    </MapContainer>
  );
}

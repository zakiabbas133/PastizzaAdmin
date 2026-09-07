import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

const markerIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/9131/9131546.png",
});

function MapController({
  latitude,
  longitude,
}: {
  latitude: number;
  longitude: number;
}) {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();

    // Only move the map if the coordinates are actually different.
    if (
      Math.abs(currentCenter.lat - latitude) > 0.000001 ||
      Math.abs(currentCenter.lng - longitude) > 0.000001
    ) {
      map.setView([latitude, longitude], map.getZoom());
    }
  }, [latitude, longitude, map]);

  return null;
}

function CenterChangeHandler({
  onChange,
}: {
  onChange: (latitude: number, longitude: number) => void;
}) {
  useMapEvents({
    moveend(event) {
      const center = event.target.getCenter();

      onChange(center.lat, center.lng);
    },
  });

  return null;
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const initialPosition: [number, number] = [
    latitude ?? 33.6844,
    longitude ?? 73.0479,
  ];

  const [center, setCenter] = useState<[number, number]>(initialPosition);

  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handleMapChange = (lat: number, lng: number) => {
    setCenter([lat, lng]);
    onChange(lat, lng);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-white">
            Choose Location
          </h3>

          <p className="mt-0.5 text-xs text-gray-500">
            Move the map to position the marker
          </p>
        </div>

        <div className="rounded-full bg-success-50 px-3 py-1 text-xs font-medium text-success-600 dark:bg-success-500/10">
          Location
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[350px] w-full">
        <MapContainer
          center={initialPosition}
          zoom={15}
          scrollWheelZoom
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Keep map centered on selected coordinates */}
          <MapController latitude={center[0]} longitude={center[1]} />

          {/* Detect map dragging */}
          <CenterChangeHandler onChange={handleMapChange} />
        </MapContainer>

        {/* FIXED CENTER MARKER */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[1000] -translate-x-1/2 -translate-y-full">
          <img
            src={markerIcon.options.iconUrl}
            alt="Location marker"
            className="h-[40px] w-[40px]"
          />
        </div>

        {/* Center crosshair */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-[999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/30" />

        {/* Instruction */}
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-[1000] -translate-x-1/2">
          <div className="whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-xs font-medium text-gray-700 shadow-lg backdrop-blur dark:bg-gray-900/95 dark:text-gray-200">
            📍 Move the map to choose a location
          </div>
        </div>
      </div>

      {/* Coordinates */}
      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Latitude
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white">
            {center[0].toFixed(6)}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Longitude
          </p>

          <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-white">
            {center[1].toFixed(6)}
          </p>
        </div>
      </div>
    </div>
  );
}

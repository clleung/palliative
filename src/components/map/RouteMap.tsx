import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { abbreviateName } from "@/lib/privacy";
import type { Visit } from "@/data/visits";

// Fix Leaflet default marker icon issue in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface RouteMapProps {
  stops: Visit[];
  className?: string;
}

export function RouteMap({ stops, className = "" }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || stops.length === 0) return;

    // Destroy existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
    });
    mapInstance.current = map;

    // Use OpenStreetMap tiles (free, no API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    const markers: L.LatLng[] = [];

    stops.forEach((stop, i) => {
      const latlng = L.latLng(stop.lat, stop.lng);
      markers.push(latlng);

      const isActive = stop.status === "current";
      const iconHtml = `<div style="
        width:28px;height:28px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:12px;font-weight:700;color:#fff;
        background:${isActive ? "hsl(270,40%,45%)" : "hsl(260,10%,45%)"};
        border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);
      ">${i + 1}</div>`;

      const icon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(latlng, { icon })
        .addTo(map)
        .bindPopup(
          `<strong>${abbreviateName(stop.patientFullName)}</strong><br/>
           ${stop.time} · ${stop.city}, ${stop.zip}<br/>
           <em>${stop.visitType}</em><br/>
           ~${stop.estimatedMinAtLocation} min visit`
        );
    });

    // Draw route line
    if (markers.length > 1) {
      L.polyline(markers, {
        color: "hsl(270,40%,45%)",
        weight: 3,
        opacity: 0.6,
        dashArray: "8,8",
      }).addTo(map);
    }

    // Fit bounds
    const bounds = L.latLngBounds(markers);
    map.fitBounds(bounds, { padding: [40, 40] });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [stops]);

  return <div ref={mapRef} className={`w-full h-full min-h-[300px] rounded-xl z-0 ${className}`} />;
}

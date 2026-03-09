import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface RobotLocation {
  id: string;
  name: string;
  robotId: string;
  status: string;
  batteryLevel: number;
  lat: number;
  lng: number;
  assignedPatient?: string;
}

interface RobotLocationMapProps {
  robots: RobotLocation[];
  className?: string;
}

const statusColors: Record<string, string> = {
  idle: "hsl(260,10%,55%)",
  charging: "hsl(40,80%,50%)",
  in_transit: "hsl(210,70%,50%)",
  on_task: "hsl(150,50%,40%)",
  maintenance: "hsl(25,80%,50%)",
  offline: "hsl(0,55%,55%)",
};

export function RobotLocationMap({ robots, className = "" }: RobotLocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || robots.length === 0) return;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(mapRef.current, { zoomControl: true, scrollWheelZoom: true });
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxZoom: 18,
    }).addTo(map);

    const latLngs: L.LatLng[] = [];

    robots.forEach((robot) => {
      const latlng = L.latLng(robot.lat, robot.lng);
      latLngs.push(latlng);

      const color = statusColors[robot.status] || "hsl(260,10%,55%)";
      const pulse = robot.status === "in_transit" || robot.status === "on_task"
        ? "animation: pulse 2s infinite;" : "";

      const iconHtml = `<div style="
        width:34px;height:34px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        font-size:11px;font-weight:700;color:#fff;
        background:${color};
        border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);
        ${pulse}
      ">🤖</div>`;

      const icon = L.divIcon({
        html: iconHtml,
        className: "",
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      L.marker(latlng, { icon })
        .addTo(map)
        .bindPopup(
          `<strong>${robot.name}</strong> (${robot.robotId})<br/>
           Status: <strong>${robot.status.replace("_", " ")}</strong><br/>
           Battery: ${robot.batteryLevel}%${robot.assignedPatient ? `<br/>Patient: ${robot.assignedPatient}` : ""}`
        );
    });

    const bounds = L.latLngBounds(latLngs);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [robots]);

  return <div ref={mapRef} className={`w-full h-full min-h-[350px] rounded-xl z-0 ${className}`} />;
}

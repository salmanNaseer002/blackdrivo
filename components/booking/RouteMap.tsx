"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google: any;
  }
}

interface RouteMapProps {
  pickup: { lat: number; lng: number; label: string; time?: string } | null;
  dropoff: { lat: number; lng: number; label: string; time?: string } | null;
}

function pinContent(label: string, time: string | undefined, color: string, title: string) {
  const div = document.createElement("div");
  div.style.cssText = "display:flex;align-items:center;gap:8px;padding:2px 2px;font-family:inherit;";
  div.innerHTML = `
    <div style="width:9px;height:9px;border-radius:9999px;background:${color};flex-shrink:0;"></div>
    <div style="min-width:0;">
      <p style="margin:0;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.03em;color:#9ca3af;">${title}</p>
      <p style="margin:0;font-size:12px;font-weight:500;color:#111827;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</p>
    </div>
    ${time ? `<span style="margin-left:4px;flex-shrink:0;border-radius:8px;background:${color};padding:3px 7px;font-size:10px;font-weight:700;color:#fff;">${time}</span>` : ""}
  `;
  return div;
}

export default function RouteMap({ pickup, dropoff }: RouteMapProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const polylineRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = setInterval(() => {
      if (typeof window !== "undefined" && window.google?.maps) {
        setReady(true);
        clearInterval(check);
      }
    }, 200);
    return () => clearInterval(check);
  }, []);

  // Hide the default InfoWindow close (×) button and arrow tail — we only
  // want it as a positioned label, not an interactive popup.
  useEffect(() => {
    if (document.getElementById("bd-map-iw-style")) return;
    const style = document.createElement("style");
    style.id = "bd-map-iw-style";
    style.textContent = `
      .gm-style-iw-t::after { display: none !important; }
      .gm-style-iw-c { padding: 6px 10px !important; border-radius: 12px !important; box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
      .gm-style-iw-d { overflow: hidden !important; }
      button.gm-ui-hover-effect { display: none !important; }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || !pickup) return;

    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: pickup.lat, lng: pickup.lng },
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "cooperative",
        styles: [
          { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
        ],
      });
    }

    const map = mapInstance.current;
    window.google.maps.event.trigger(map, "resize");

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];
    infoWindowsRef.current.forEach((iw) => iw.close());
    infoWindowsRef.current = [];
    if (polylineRef.current) { polylineRef.current.setMap(null); polylineRef.current = null; }

    const pickupMarker = new window.google.maps.Marker({
      position: { lat: pickup.lat, lng: pickup.lng },
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#0b66d1",
        fillOpacity: 1,
        strokeColor: "#fff",
        strokeWeight: 3,
      },
    });
    markersRef.current.push(pickupMarker);

    const pickupIw = new window.google.maps.InfoWindow({
      content: pinContent(pickup.label, pickup.time, "#0b66d1", "Pick up"),
      disableAutoPan: true,
      headerDisabled: true,
    });
    pickupIw.open({ map, anchor: pickupMarker });
    infoWindowsRef.current.push(pickupIw);

    if (dropoff) {
      const dropoffMarker = new window.google.maps.Marker({
        position: { lat: dropoff.lat, lng: dropoff.lng },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#111827",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 3,
        },
      });
      markersRef.current.push(dropoffMarker);

      const dropoffIw = new window.google.maps.InfoWindow({
        content: pinContent(dropoff.label, dropoff.time, "#111827", "Drop-off"),
        disableAutoPan: true,
        headerDisabled: true,
      });
      dropoffIw.open({ map, anchor: dropoffMarker });
      infoWindowsRef.current.push(dropoffIw);

      const service = new window.google.maps.DirectionsService();
      service.route(
        {
          origin: { lat: pickup.lat, lng: pickup.lng },
          destination: { lat: dropoff.lat, lng: dropoff.lng },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result: any, status: string) => {
          if (status === "OK") {
            polylineRef.current = new window.google.maps.Polyline({
              path: result.routes[0].overview_path,
              strokeColor: "#0b66d1",
              strokeWeight: 4,
              strokeOpacity: 0.85,
              map,
            });

            const bounds = new window.google.maps.LatLngBounds();
            result.routes[0].overview_path.forEach((p: any) => bounds.extend(p));

            const width = wrapperRef.current?.clientWidth || 400;
            const pad = width < 500 ? { top: 56, bottom: 24, left: 24, right: 24 } : { top: 24, bottom: 24, left: 24, right: 24 };
            window.google.maps.event.trigger(map, "resize");
            map.fitBounds(bounds, pad);
          }
        }
      );
    } else {
      window.google.maps.event.trigger(map, "resize");
      map.setCenter({ lat: pickup.lat, lng: pickup.lng });
      map.setZoom(13);
    }
  }, [ready, pickup, dropoff]);

  return (
    <div ref={wrapperRef} className="relative h-[280px] w-full overflow-hidden rounded-3xl bg-gray-100 sm:h-[360px] lg:h-[460px]">
      <div ref={mapRef} className="h-full w-full" />

      {!pickup && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-400">
          Enter a pickup location to preview your route
        </div>
      )}
    </div>
  );
}

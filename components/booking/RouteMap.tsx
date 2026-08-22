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

// ── Directions cache — a booking's pickup/dropoff never changes once set, so
// re-opening the same ride's route map shouldn't re-bill the Directions API every time.
const ROUTE_CACHE_PREFIX = "blackdrivo_route_cache_";
const ROUTE_CACHE_TTL_MS = 30 * 24 * 3600 * 1000; // 30 days

function routeCacheKey(points: { lat: number; lng: number }[]) {
  const r = (n: number) => n.toFixed(4);
  return ROUTE_CACHE_PREFIX + points.map((p) => `${r(p.lat)}_${r(p.lng)}`).join("_");
}

function readRouteCache(key: string): any[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.savedAt >= ROUTE_CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.result;
  } catch { return null; }
}

function writeRouteCache(key: string, result: any[]) {
  try { localStorage.setItem(key, JSON.stringify({ result, savedAt: Date.now() })); } catch {}
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

      const drawPath = (path: any[]) => {
        polylineRef.current = new window.google.maps.Polyline({
          path,
          strokeColor: "#0b66d1",
          strokeWeight: 4,
          strokeOpacity: 0.85,
          map,
        });

        const bounds = new window.google.maps.LatLngBounds();
        path.forEach((p: any) => bounds.extend(p));

        const width = wrapperRef.current?.clientWidth || 400;
        const pad = width < 500 ? { top: 56, bottom: 24, left: 24, right: 24 } : { top: 24, bottom: 24, left: 24, right: 24 };
        window.google.maps.event.trigger(map, "resize");
        map.fitBounds(bounds, pad);
      };

      const cacheKey = routeCacheKey([
        { lat: pickup.lat, lng: pickup.lng },
        { lat: dropoff.lat, lng: dropoff.lng },
      ]);
      const cachedPath = readRouteCache(cacheKey);
      if (cachedPath) {
        drawPath(cachedPath);
      } else {
        const service = new window.google.maps.DirectionsService();
        service.route(
          {
            origin: { lat: pickup.lat, lng: pickup.lng },
            destination: { lat: dropoff.lat, lng: dropoff.lng },
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result: any, status: string) => {
            if (status === "OK") {
              const path = result.routes[0].overview_path.map((p: any) => p.toJSON());
              drawPath(path);
              writeRouteCache(cacheKey, path);
            }
          }
        );
      }
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

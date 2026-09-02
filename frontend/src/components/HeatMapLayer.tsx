import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

type HeatPoint = [number, number, number?];

interface HeatMapLayerProps {
  points: HeatPoint[];
}

export default function HeatMapLayer({
  points,
}: HeatMapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    const heatLayer = (L as any).heatLayer(points, {
      radius: 25,
      blur: 20,
      maxZoom: 12,
      minOpacity: 0.35,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
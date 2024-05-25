import { LatLngTuple } from "leaflet";

export const TileUrls = [
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
];

export const DEFAULT_ZOOM = 16
export const DEFAULT_CENTER: LatLngTuple = [-6.175247, 106.8270488]
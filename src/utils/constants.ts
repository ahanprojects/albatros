import { LatLngTuple } from "leaflet";

export const TileUrls = [
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
];

export const DEFAULT_ZOOM = 16
export const DEFAULT_CENTER: LatLngTuple = [-6.175247, 106.8270488]
import { LatLngTuple } from "leaflet";

export interface Poi {
  name: string;
  address: string;
  latlng: LatLngTuple;
}
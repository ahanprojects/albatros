import { type ClassValue, clsx } from "clsx"
import { GeoJsonProperties } from "geojson";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateAddress(properties: GeoJsonProperties) {
  const { name, street, housenumber, district, state, country, postcode } = properties!;
  const fullStreet = housenumber ? `${street} ${housenumber}` : street
  return [name, fullStreet, housenumber, district, state, country, postcode].filter(v => v).join(', ')
}
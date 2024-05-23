"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useMemo } from "react";
import Spinner from "@/components/common/Spinner";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { LocateFixed, Minus, Plus } from "lucide-react";
import Image from "next/image";

interface MapComponentProps {
  posix?: LatLngExpression;
  zoom?: number;
}

const defaults = {
  zoom: 15,
  posix: [-6.176254706719461, -688933.172713317] as LatLngExpression,
};

export default function MapComponent(props: MapComponentProps) {
  const { zoom = defaults.zoom, posix = defaults.posix } = props;
  function MapEvents() {
    useMapEvents({
      // click: (e) => console.log(e.latlng),
    });
    return null;
  }

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapEvents />
      <FloatingButtons />
      <Marker position={posix}>
        <Popup>Hey ! I study here</Popup>
      </Marker>
    </MapContainer>
  );
}

function FloatingButtons() {
  const map = useMap();

  function myLocation() {
    map.locate({setView: true, maxZoom: 24})
  }

  function zoomIn() {
    map.setZoom(map.getZoom() + 1);
  }
  function zoomOut() {
    map.setZoom(map.getZoom() - 1);
  }

  return (
    <>
      <div className="absolute right-0 bottom-0 m-4 space-y-1 z-[999]">
        <Button
          onClick={myLocation}
          size="icon"
          className="rounded-full shadow-lg bg-white hover:bg-gray-200 w-14 h-14 p-3">
          <LocateFixed className="text-red-500 h-14 w-14" />
        </Button>
        <div className="bg-white shadow-lg flex flex-col items-center rounded-full w-fit m-auto p-0.5">
          <Button
            onClick={zoomIn}
            size="icon"
            className="rounded-full bg-white hover:bg-gray-200 w-12 h-12 p-2">
            <Plus className="text-slate-800 h-12 w-12" />
          </Button>
          <Button
            onClick={zoomOut}
            size="icon"
            className="rounded-full bg-white hover:bg-gray-200 w-12 h-12 p-2">
            <Minus className="text-slate-800 h-12 w-12" />
          </Button>
        </div>
      </div>
      {/* Logo */}
      <div className="absolute bottom-0 p-2  z-[999]">
        <Image src="/albatros.svg" alt="Albatros" width={100} height={20} />
      </div>
    </>
  );
}
// Hook for CSR
export function useClientMap() {
  return useMemo(
    () =>
      dynamic(() => import("@/app/Map"), {
        loading: () => <Spinner />,
        ssr: false,
      }),
    []
  );
}

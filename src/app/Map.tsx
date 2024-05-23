"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { Icon, LatLngExpression, LocationEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { Button } from "@/components/ui/button";
import { Layers2, LocateFixed, Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { myLocationIcon } from "@/components/common/Pin";

const defaults = {
  zoom: 15,
  posix: [-6.176254706719461, -688933.172713317] as LatLngExpression,
};

export default function MapComponent() {
  const { zoom, posix } = defaults;

  return (
    <MapContainer
      center={posix}
      zoom={zoom}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}>
      <FloatingButtons />
      <UserMarker />
    </MapContainer>
  );
}

function UserMarker() {
  const [position, setPosition] = useState<LatLngExpression>();
  const map = useMapEvents({
    locationfound: (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    },
  });
  useEffect(() => {
    map.locate();
  }, []);

  return (
    position && (
      <Marker icon={myLocationIcon} position={position}>
        <Popup>You are here.</Popup>
      </Marker>
    )
  );
}

const tileLayerUrls = [
  "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
  "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
];

function FloatingButtons() {
  const [tileId, setTileId] = useState(0);
  const map = useMapEvents({
    locationfound: handleLocate,
  });

  function handleLocate(e: LocationEvent) {
    const { lat, lng } = e.latlng;
    map.setView([lat, lng], 16);
  }

  function zoomIn() {
    map.setZoom(map.getZoom() + 1);
  }

  function zoomOut() {
    map.setZoom(map.getZoom() - 1);
  }

  function changeLayer() {
    setTileId((v) => (v + 1) % tileLayerUrls.length);
  }

  return (
    <>
      <TileLayer url={tileLayerUrls[tileId]} />
      <div className="absolute right-0 bottom-0 m-4 flex flex-col gap-2 z-[999]">
        <Button
          onClick={changeLayer}
          size="icon"
          className="rounded-full shadow-lg bg-white hover:bg-gray-200 w-14 h-14 p-3">
          <Layers2 className="text-slate-800 h-14 w-14" />
        </Button>
        <Button
          onClick={() => map.locate()}
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
        <Image
          src="/albatros.svg"
          alt="Albatros"
          className="w-24"
          width="0"
          height="0"
        />
      </div>
    </>
  );
}
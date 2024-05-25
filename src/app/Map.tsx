"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet-defaulticon-compatibility";
import { Button } from "@/components/ui/button";
import {
  Search,
  Layers2,
  LocateFixed,
  Minus,
  Plus,
  MapPin,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { userPin } from "@/components/common/Pin";
import L, { LatLngExpression, LocationEvent } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "./Map.css";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn, generateAddress } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import useDebounce from "@/hooks/useDebounce";
import { FeatureCollection } from "geojson";
import { CommandLoading } from "cmdk";
import Spinner from "@/components/common/Spinner";

export default function MapComponent() {
  return (
    <MapContainer
      center={[-6.176254706719461, -688933.172713317]}
      zoom={15}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}>
      <Sidebar />
      <FloatingButtons />
      <UserMarker />
      <RoutingMachine />
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
      <Marker icon={userPin} position={position}>
        <Popup>You are here.</Popup>
      </Marker>
    )
  );
}

const tileLayerUrls = [
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png",
  "https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.png",
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
];

function FloatingButtons() {
  const [tileId, setTileId] = useState(0);
  const map = useMapEvents({
    click: (e) => console.log([e.latlng.lat, e.latlng.lng]),
    locationfound: handleLocate,
  });

  function handleLocate(e: LocationEvent) {
    const { lat, lng } = e.latlng;
    map.setView([lat, lng], 20);
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
      <div className="absolute bottom-0 p-2 z-[999]">
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

function RoutingMachine() {
  const map = useMap();
  useEffect(() => {
    if (!map) return;

    const control = L.Routing.control({
      // waypoints: [
      //   L.latLng([-6.1712302684977205, 106.81512530730048]),
      //   L.latLng([-6.182539172652949, 106.81753423447329]),
      // ],
      routeWhileDragging: true,
      geocoder: (L.Control as any).Geocoder.photon(),
      lineOptions: {
        styles: [{ color: "#1d4ed8", weight: 5 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
    });
    // .addTo(map);

    return () => {
      if (map && control) map.removeControl(control);
    };
  }, []);

  return null;
}

interface Poi {
  name: string;
  address: string;
  latlng: [number, number];
}

function Sidebar() {
  const map = useMap();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const { data, isFetching } = useQuery({
    initialData: [],
    queryKey: ["search", debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch.length < 3) return [];

      const json: FeatureCollection = await fetch(
        `https://photon.komoot.io/api/?q=${debouncedSearch}&limit=5`
      ).then((res) => res.json());
      const features = json.features;
      return features;
    },
  });
  const [showSearch, setShowSearch] = useState(false);

  // Selected POI Data
  const [poi, setPoi] = useState<Poi | null>(null);

  function handleSearch(value: string) {
    setSearch(value);
    setShowSearch(value.length > 0);
  }

  function handleSelectPoi(i: number) {
    setShowSearch(false);

    // note: leflet uses latlng, geojson uses lnglat
    const [lng, lat] = (data[i].geometry as any).coordinates;
    setPoi({
      name: data[i].properties!.name,
      address: generateAddress(data[i].properties),
      latlng: [lat, lng],
    });
    map.setView([lat, lng], 16);
  }

  function clearSelectedPoi() {
    setPoi(null);
  }

  function handleCoordinateClick() {
    if (!poi) return
    map.setView(poi.latlng, 16)
  }

  return (
    <>
      {poi && (
        <Marker position={poi.latlng}>
          <Popup>{poi.name}</Popup>
        </Marker>
      )}
      <div className="absolute z-[1000]">
        <Command
          loop
          shouldFilter={false}
          className={cn(
            "border shadow-md  w-[32vw] h-fit m-4",
            showSearch ? "rounded-xl" : "rounded-full"
          )}>
          <div className="flex items-center pl-4 pr-2 w-full border-b">
            <Image
              src="/icon.png"
              alt="Albatros"
              width={24}
              height={24}
              className="mr-2 h-6 w-6"
            />
            <CommandInput
              placeholder="Where to go?"
              className="text-md"
              value={search}
              onValueChange={handleSearch}
            />
            <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
          </div>
          <CommandList>
            {showSearch && (
              <CommandEmpty>
                {isFetching && <Spinner />}
                {!isFetching &&
                  (debouncedSearch.length < 3
                    ? "Enter at least 3 characters to search."
                    : "No result found.")}
              </CommandEmpty>
            )}
            {showSearch && (
              <CommandGroup>
                {data?.map((v, i) => {
                  return (
                    <CommandItem
                      key={i}
                      value={i.toString()}
                      className="gap-2"
                      onSelect={() => {
                        handleSelectPoi(i);
                      }}>
                      <MapPin className="w-4 block" />
                      <span className="w-fit">
                        {generateAddress(v.properties)}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        {/* Detail POI */}
        {poi && (
          <div className="z-[10020] rounded-xl bg-white shadow-lg m-4 p-4  w-[32vw] ">
            <div className="flex">
              <h1 className="text-slate-800 text-xl font-semibold flex-1 mb-1">
                {poi.name}
              </h1>
              <Button
                variant="ghost"
                className="p-0 h-fit"
                onClick={clearSelectedPoi}>
                <X className="text-slate-500" />
              </Button>
            </div>
            <div className="text-slate-600 text-sm mb-4">{poi.address}</div>
            <Button className="rounded-full px-8 py-2 mb-4">Directions</Button>
            <div onClick={handleCoordinateClick} className="flex gap-2 items-center hover:bg-gray-100 rounded-md py-2 pl-0.5">
              <MapPin className="text-blue-600 w-4 h-4" />
              <span className="text-xs">{poi.latlng.join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

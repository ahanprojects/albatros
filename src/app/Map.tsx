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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Search,
  Layers2,
  LocateFixed,
  Minus,
  Plus,
  MapPin,
  X,
  InfoIcon,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { redPin, startPin, userPin } from "@/components/common/Pin";
import L, { LatLngExpression, LatLngTuple, LocationEvent } from "leaflet";
import "leaflet-routing-machine";
import "leaflet-control-geocoder";
import "./Map.css";
import {
  Command,
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
import { Spinner, LogoSpinner } from "@/components/common/Spinner";
import { DEFAULT_CENTER, DEFAULT_ZOOM, TileUrls } from "@/utils/constants";
import { Poi } from "@/utils/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default function MapComponent() {
  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      className="w-full h-full"
      zoomControl={false}
      attributionControl={false}>
      <Sidebar />
      <FloatingButtons />
      <UserMarker />
      <Info />
    </MapContainer>
  );
}

// Marker for user's current location
function UserMarker() {
  const [position, setPosition] = useState<LatLngExpression>();
  const map = useMap();
  useEffect(() => {
    map.locate();
    map.once("locationfound", (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    });
  }, []);

  return (
    position && (
      <Marker icon={userPin} position={position}>
        <Popup>You are here.</Popup>
      </Marker>
    )
  );
}

// Change layer, zoom, my location buttons
function FloatingButtons() {
  const [tileId, setTileId] = useState(0);
  const map = useMapEvents({
    locationfound: handleLocate,
  });

  function handleLocate(e: LocationEvent) {
    map.setView(e.latlng, DEFAULT_ZOOM);
  }

  function zoomIn() {
    map.setZoom(map.getZoom() + 1);
  }

  function zoomOut() {
    map.setZoom(map.getZoom() - 1);
  }

  function changeLayer() {
    setTileId((v) => (v + 1) % TileUrls.length);
  }

  return (
    <>
      {/* TileLayer */}
      <TileLayer url={TileUrls[tileId]} />
      {/* Buttons */}
      <div className="absolute right-0 bottom-0 m-4 flex flex-col gap-2 z-[701]">
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
      <div className="absolute bottom-0 p-2 z-[701]">
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

// Search POI Input and Routing Menu
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
  const [poi, setPoi] = useState<Poi | null>(null);
  const [endpoint, setEndpoint] = useState<LatLngTuple | null>(null);

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
    map.setView([lat, lng], DEFAULT_ZOOM);
  }

  function clearSelectedPoi() {
    setPoi(null);
  }

  function handleCoordinateClick() {
    if (!poi) return;
    map.setView(poi.latlng, DEFAULT_ZOOM);
  }

  function handleRouting() {
    if (!poi) return;
    setEndpoint(poi.latlng);
  }

  // Shows routing menu
  if (endpoint) {
    return (
      <>
        <Button
          variant="secondary"
          className="absolute z-[701] m-0 p-0 w-10 h-10 left-[31vw] top-1.5 bg-white shadow-md hover:bg-slate-200"
          onClick={() => setEndpoint(null)}>
          <X className="text-slate-700" />
        </Button>
        <RoutingMachine endpoint={endpoint} />
      </>
    );
  }

  // Show search POI
  return (
    <>
      {poi && (
        <Marker icon={redPin} position={poi.latlng}>
          <Popup>{poi.name}</Popup>
        </Marker>
      )}
      <div className="absolute m-4 z-[701]">
        <Command
          loop
          shouldFilter={false}
          className={cn(
            "border shadow-md mb-2 w-[32vw] h-fit",
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
          <div className="rounded-xl bg-white shadow-lg p-4 w-[32vw] ">
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
            <div className="text-slate-600 text-sm mb-3">{poi.address}</div>
            <Button
              onClick={handleRouting}
              className="rounded-full px-8 py-2 mb-4">
              Directions
            </Button>
            <div
              onClick={handleCoordinateClick}
              className="flex gap-2 items-center hover:cursor-pointer hover:bg-gray-100 rounded-md py-2 pl-0.5">
              <MapPin className="text-red-600 w-4 h-4" />
              <span className="text-xs">{poi.latlng.join(", ")}</span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * !BUG
 * The leaflet-routing-machine triggers the "routingstart" event
 * when zooming in the map after a route has already been calculated.
 * It does not trigger the "routesfound" or "routingerror" events afterwards.
 * As a result, if we set a loading state to true in the "routingstart" event,
 * the loading state will never be set to false because the
 * "routesfound" or "routingerror" events are not triggered.
 * Workaround: Add an isZooming state to check if "routingstart" is triggered because of zooming.
 */

function RoutingMachine({ endpoint }: { endpoint: LatLngTuple }) {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);
  const isZooming = useRef(false);
  const map = useMapEvents({
    zoomstart: () => {
      isZooming.current = true;
    },
    zoomend: () => {
      isZooming.current = false;
    },
  });

  useEffect(() => {
    if (!map) return;
    map.locate();

    const config: any = {
      waypoints: [null, L.latLng(endpoint)],
      routeWhileDragging: true,
      geocoder: (L.Control as any).Geocoder.photon(),
      lineOptions: {
        styles: [{ color: "#044ff5", weight: 8 }],
        extendToWaypoints: true,
        missingRouteTolerance: 10,
      },
      createMarker: (i: number, wp: any, nWps: number) => {
        if (i == 0) return L.marker(wp.latLng, { icon: startPin });
        return L.marker(wp.latLng, { icon: redPin });
      },
    };
    const control = L.Routing.control(config)
      .on("routingstart", (e) => {
        if (!isZooming.current) setLoading(true);
      })
      .on("routesfound", (e) => {
        setLoading(false);
      })
      .on("routingerror", (e) => {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Unable to calculate route. Please try again later.",
        });
      });
    control.addTo(map);

    return () => {
      if (map && control) map.removeControl(control);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="absolute w-screen h-screen bg-black/60 z-[1001] flex items-center justify-center">
      <div className="bg-white rounded-xl flex justify-center items-center p-4 gap-2">
        <LogoSpinner />
      </div>
    </div>
  );
}

// Attributions
function Info() {
  return (
    <Dialog>
      <DialogTrigger asChild className="absolute z-[702] right-0 m-4">
        <Button
          size="icon"
          className="rounded-full shadow-lg bg-white hover:bg-gray-200 w-8 h-8 p-1">
          <InfoIcon className="text-gray-500 h-full w-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Attributions</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start">
          <Link
            href="https://leafletjs.com/"
            className={buttonVariants({ variant: "link" })}>
            Leaflet
          </Link>
          <Link
            href="https://www.openstreetmap.org/copyright"
            className={buttonVariants({ variant: "link" })}>
            © OpenStreetMap contributors
          </Link>
          <Link
            href="https://www.liedman.net/leaflet-routing-machine/"
            className={buttonVariants({ variant: "link" })}>
            Leaflet Routing Machine by Per Liedman
          </Link>
          <Link
            href="https://photon.komoot.io/"
            className={buttonVariants({ variant: "link" })}>
            Photon Geocoder by Komoot
          </Link>
          <Link href="" className={buttonVariants({ variant: "link" })}>
            © Tiles Esri
          </Link>
          <Link
            href="https://www.flaticon.com/free-icons/albatross"
            className={buttonVariants({ variant: "link" })}>
            Albatross icons created by monkik - Flaticon
          </Link>
          <Link
            href="https://lucide.dev/license"
            className={buttonVariants({ variant: "link" })}>
            © 2024 Lucide Contributors
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

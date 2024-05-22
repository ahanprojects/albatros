"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocateFixed, Minus, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Map } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import View from "ol/View";
import { defaults } from "ol/control/defaults";
import { defaults as interactionDefaults } from "ol/interaction/defaults";
import { fromLonLat } from "ol/proj";
import { useToast } from "@/components/ui/use-toast";

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useRef<Map | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapRef.current) return;

    map.current = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          visible: true,
          source: new OSM(),
        }),
      ],
      view: new View({
        center: [11891834.611295423, -689017.8267312223],
        zoom: 2,
      }),
      controls: defaults({ attribution: false, zoom: false, rotate: false }),
      interactions: interactionDefaults({}),
    });

    return () => map.current?.setTarget();
  }, []);

  function myLocation() {

      if (!navigator.geolocation || !map.current) {
        toast({
          title: "Uh oh! Something went wrong",
          description: "Failed getting your location.",
          variant: "destructive",
        })      
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = fromLonLat([longitude, latitude]);
          const view = map.current!.getView();
          view.animate({ center: coordinates, zoom: 15 });
        },
        (_) => toast({
          title: "Uh oh! Something went wrong",
          description: "Failed getting your location.",
          variant: "destructive",
        })   
      );
  }

  function zoomIn() {
    if (!map.current) return;
    const view = map.current.getView();
    view.setZoom((view.getZoom() ?? 0) + 1);
  }

  function zoomOut() {
    if (!map.current) return;
    const view = map.current.getView();
    view.setZoom((view.getZoom() ?? 0) - 1);
  }

  return (
    <main className="min-h-screen relative">
      <div ref={mapRef} id="map" className="absolute h-full w-full"></div>
      <Sidebar />
      <FloatingButtons
        onMyLocation={myLocation}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
      />
    </main>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-white rounded-full min-w-96 m-4 px-5 py-1.5 shadow-lg flex items-center gap-2">
      <Image src="/icon.png" alt="Albatros" width={30} height={30} />
      <Input
        placeholder="Where to go?"
        className="text-md border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Search />
    </div>

    // <div className="absolute bg-white rounded-lg min-w-96 m-4 p-4 space-y-2 shadow-lg">
    //   <div className="flex gap-2 items-center">
    //     <MapPin />
    //     <Input placeholder="Starting point" />
    //   </div>
    //   <div className="flex gap-2 items-center">
    //     <MapPin />
    //     <Input />
    //   </div>
    //   <div className="flex gap-2 items-center">
    //     <MapPin />
    //     <Input placeholder="Destination point"  />
    //   </div>
    // </div>
  );
}

type FloatingButtonsProps = {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onMyLocation: () => void;
};

function FloatingButtons({
  onZoomIn,
  onZoomOut,
  onMyLocation,
}: FloatingButtonsProps) {
  return (
    <>
    <div className="absolute right-0 bottom-0 m-4 space-y-1">
      <Button
        onClick={onMyLocation}
        size="icon"
        className="rounded-full shadow-lg bg-white hover:bg-gray-200 w-14 h-14 p-3">
        <LocateFixed className="text-red-500 h-14 w-14" />
      </Button>
      <div className="bg-white shadow-lg flex flex-col items-center rounded-full w-fit m-auto p-0.5">
        <Button
          onClick={onZoomIn}
          size="icon"
          className="rounded-full bg-white hover:bg-gray-200 w-12 h-12 p-2">
          <Plus className="text-slate-800 h-12 w-12" />
        </Button>
        <Button
          onClick={onZoomOut}
          size="icon"
          className="rounded-full bg-white hover:bg-gray-200 w-12 h-12 p-2">
          <Minus className="text-slate-800 h-12 w-12" />
        </Button>
      </div>
    </div>
    {/* Logo */}
    <div className="absolute bottom-0 p-2">
      <Image src="/albatros.svg" alt="Albatros" width={100} height={20} />
    </div>
    </>
    
  );
}

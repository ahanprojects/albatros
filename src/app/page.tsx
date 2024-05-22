"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  LocateFixed,  Search  } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadMap() {
      try {
        const { map } = await import("@/components/map");
        const initMap = map;
        initMap.setTarget(mapRef.current || "");
  
        return () => initMap.setTarget();
      } catch (error) {
        console.error('Error loading map:', error);
      }
    }
  
    loadMap();
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="absolute h-full w-full">
        <div ref={mapRef} className="relative h-full w-full">
        </div>
      </div>
      <Sidebar />
      <FloatingButtons />
      <Logo />
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

function FloatingButtons() {
  return (
    <div className="absolute right-0 bottom-0 m-4">
      <Button
        size="icon"
        className="rounded-full shadow-lg bg-white hover:bg-gray-200 w-14 h-14 p-3">
        <LocateFixed className="text-red-500 h-14 w-14" />
      </Button>
    </div>
  );
}

function Logo() {
  return (
    <div className="absolute bottom-0 p-2">
      <Image src="/albatros.svg" alt="Albatros" width={120} height={20}/>
    </div>
  );
}

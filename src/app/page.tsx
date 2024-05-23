"use client";

import { Input } from "@/components/ui/input";
import {  Search } from "lucide-react";
import Image from "next/image";
import { useClientMap } from "./Map";

export default function Home() {
  const MapComponent = useClientMap()

  return (
    <main className="h-screen w-screen relative">
      <div className="absolute h-full w-full">
        <MapComponent />
      </div>
      <Sidebar />
    </main>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-white rounded-full min-w-96 m-4 px-5 py-1.5 shadow-lg flex items-center gap-2 z-[999]">
      <Image src="/icon.png" alt="Albatros" width={30} height={30} />
      <Input
        placeholder="Where to go?"
        className="text-md border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <Search />
    </div>
  );
}



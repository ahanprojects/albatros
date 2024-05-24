"use client";

import { Input } from "@/components/ui/input";
import {  Search } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/common/Spinner";

export default function Home() {
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("@/app/Map"), {
        loading: () => <Spinner />,
        ssr: false,
      }),
    []
  )
  // return (
  //   <div className="rounded-full relative flex justify-center items-center w-6 h-6">
  //     <div className="absolute w-7 h-7 bg-blue-200 rounded-full"></div>
  //     <div className="absolute w-5 h-5 bg-white rounded-full"></div>
  //     <div className="absolute w-3 h-3 bg-blue-400 rounded-full"></div>
  //   </div>
  // )
  return (
    <main className="h-screen w-screen relative">
      <div className="absolute h-full w-full">
        <MapComponent />
      </div>
      {/* <Sidebar /> */}
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



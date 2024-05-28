"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { LogoSpinner } from "@/components/common/Spinner";

export default function Home() {
  // Forces leaflet to load on the client
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("@/app/Map"), {
        loading: () => <LogoSpinner />,
        ssr: false,
      }),
    []
  );
  return (
    <main className="h-screen w-screen relative">
      <MapComponent />
    </main>
  );
}

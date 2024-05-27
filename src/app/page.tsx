"use client";

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
  );
  return (
    <main className="h-screen w-screen relative">
      <MapComponent />
    </main>
  );
}

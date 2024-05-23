import type { Metadata } from "next";
import { DM_Sans as Sans} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import 'leaflet/dist/leaflet.css';

const sans = Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Albatros - Location Intelligence",
  description: "Albatros - Location Intelligence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sans.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}

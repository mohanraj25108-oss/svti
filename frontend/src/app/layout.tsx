import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import TopGovernmentBanner from "@/components/layout/TopGovernmentBanner";
import TacticalNavbar from "@/components/layout/TacticalNavbar";
import Footer from "@/components/layout/Footer";
import { SosControl } from "@/features/sos/SosControl";

export const metadata: Metadata = {
  title: "EyeWitness | AI Forensic Composite Suite",
  description: "Official Law Enforcement Platform: Accelerating suspect face composites, crime scene diagrams, and video reconstructions from eyewitness testimony.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080B] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        <AppProvider>
          <div className="flex flex-col min-h-screen">
            <TopGovernmentBanner />
            <TacticalNavbar />
            <main className="flex-grow w-full relative">
              {children}
            </main>
            <Footer />
            <SosControl />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}


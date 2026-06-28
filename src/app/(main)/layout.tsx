"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { GlobalFeatures } from "@/components/features/global-features";
import { AnimatedBackground } from "@/components/layout/animated-background";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="flex-1 lg:ml-[240px] min-h-screen flex flex-col">
          <TopBar />
          <div className="flex-1">{children}</div>
        </main>
        <GlobalFeatures />
      </div>
    </>
  );
}

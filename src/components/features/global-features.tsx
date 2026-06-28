"use client";
import { useContentStore } from "@/hooks/use-content-store";
import { SpinWheel } from "./spin-wheel";
import { ChatWidget } from "./chat-widget";
import { SpotlightSearch } from "./spotlight-search";
import { AriseEasterEgg } from "./arise-easter-egg";
import { LoadingScreen } from "./loading-screen";

export function GlobalFeatures() {
  const { content, isLoaded } = useContentStore();

  // Spin wheel only picks from movies
  const movies = content.filter((i) => i.type === "movie");

  return (
    <>
      <LoadingScreen />
      {isLoaded && (
        <>
          <SpinWheel items={movies} />
          <ChatWidget />
          <SpotlightSearch />
          <AriseEasterEgg />
        </>
      )}
    </>
  );
}

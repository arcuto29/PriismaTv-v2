"use client";
import { useContentStore } from "@/hooks/use-content-store";
import { SpinWheel } from "./spin-wheel";
import { SpotlightSearch } from "./spotlight-search";
import { AriseEasterEgg } from "./arise-easter-egg";
import { KeyboardShortcuts } from "./keyboard-shortcuts";
import { PipPlayer } from "./pip-player";
import { WhatsNewPopup } from "./whats-new-popup";

export function GlobalFeatures() {
  const { content, isLoaded } = useContentStore();

  // Spin wheel only picks from movies
  const movies = content.filter((i) => i.type === "movie");

  return (
    <>
      {isLoaded && (
        <>
          <SpinWheel items={movies} />
          <SpotlightSearch />
          <AriseEasterEgg />
          <KeyboardShortcuts />
          <PipPlayer />
          <WhatsNewPopup />
        </>
      )}
    </>
  );
}

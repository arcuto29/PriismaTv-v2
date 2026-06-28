"use client";
import { useContentStore } from "@/hooks/use-content-store";
import { SpinWheel } from "./spin-wheel";
import { ChatWidget } from "./chat-widget";

export function GlobalFeatures() {
  const { content, isLoaded } = useContentStore();

  if (!isLoaded) return null;

  return (
    <>
      <SpinWheel items={content} />
      <ChatWidget />
    </>
  );
}

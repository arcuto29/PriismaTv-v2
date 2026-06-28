"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ContentItem } from "@/data/content";
import { ContentCard } from "./content-card";
import { cn } from "@/lib/utils";

interface ContentRowProps {
  title: string;
  icon?: React.ReactNode;
  items: ContentItem[];
  seeAllHref?: string;
  onFavorite?: (id: string) => void;
  onWatchlist?: (id: string) => void;
  favorites?: string[];
  watchlist?: string[];
}

export function ContentRow({
  title, icon, items, seeAllHref,
  onFavorite, onWatchlist, favorites = [], watchlist = [],
}: ContentRowProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (items.length === 0) return null;

  return (
    <section className="py-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 px-4 lg:px-8">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-lg lg:text-xl font-bold">{title}</h2>
        </div>
        {seeAllHref && (
          <a href={seeAllHref} className="text-sm text-primary hover:text-primary/80 font-medium transition-colors">
            See All
          </a>
        )}
      </div>

      {/* Carousel */}
      <div className="relative group/row">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 px-4 lg:px-8">
            {items.map((item, i) => (
              <div key={item.id} className="flex-none w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
                <ContentCard
                  item={item}
                  index={i}
                  onFavorite={onFavorite}
                  onWatchlist={onWatchlist}
                  isFavorite={favorites.includes(item.id)}
                  isInWatchlist={watchlist.includes(item.id)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {canScrollPrev && (
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/90 z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollNext && (
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 text-white opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/90 z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </section>
  );
}

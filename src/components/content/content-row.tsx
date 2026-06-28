"use client";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { ContentItem } from "@/data/content";
import { ContentCard } from "./content-card";

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
    slidesToScroll: 3,
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
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="py-6"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5 px-4 lg:px-12">
        <div className="flex items-center gap-3">
          {icon && <div className="p-2 rounded-lg bg-white/5 border border-white/10">{icon}</div>}
          <div>
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {seeAllHref && (
            <a href={seeAllHref} className="text-sm text-primary/80 hover:text-primary font-medium transition-colors hover:underline underline-offset-4">
              Explore All →
            </a>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group/row">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none lg:w-12" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none lg:w-12" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 lg:gap-4 px-4 lg:px-12">
            {items.map((item, i) => (
              <div key={item.id} className="flex-none w-[140px] sm:w-[155px] md:w-[175px] lg:w-[195px] xl:w-[210px]">
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
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-black hover:scale-110 hover:border-primary/50 z-20 shadow-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollNext && (
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 hover:bg-black hover:scale-110 hover:border-primary/50 z-20 shadow-xl"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.section>
  );
}

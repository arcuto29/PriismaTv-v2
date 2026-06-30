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
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="py-8"
    >
      {/* Section Header - Premium minimal */}
      <div className="flex items-center justify-between mb-6 px-4 lg:px-12">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              {icon}
            </div>
          )}
          <div className="flex items-center gap-3">
            <h2 className="text-xl lg:text-2xl font-bold tracking-tight text-white/90">{title}</h2>
            <div className="hidden sm:block h-[1px] w-12 bg-gradient-to-r from-primary/30 to-transparent" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {seeAllHref && (
            <a
              href={seeAllHref}
              className="group flex items-center gap-1.5 text-[12px] text-white/30 hover:text-primary/80 font-medium transition-colors duration-300 uppercase tracking-wider"
            >
              Explore
              <ChevronRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>

      {/* Carousel */}
      <div className="relative group/row">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#06060a] to-transparent z-10 pointer-events-none lg:w-12" />
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#06060a] to-transparent z-10 pointer-events-none lg:w-12" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3 lg:gap-4 px-4 lg:px-12">
            {items.map((item, i) => (
              <div key={item.id} className="flex-none w-[145px] sm:w-[160px] md:w-[180px] lg:w-[200px] xl:w-[215px]">
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

        {/* Navigation Arrows - Premium */}
        {canScrollPrev && (
          <button
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.08] text-white/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-400 hover:bg-black/90 hover:scale-105 hover:border-primary/20 hover:text-white z-20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canScrollNext && (
          <button
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 backdrop-blur-xl border border-white/[0.08] text-white/80 flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-400 hover:bg-black/90 hover:scale-105 hover:border-primary/20 hover:text-white z-20 shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.section>
  );
}

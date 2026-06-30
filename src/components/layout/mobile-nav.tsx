"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Film, Sword, Tv, Search, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/anime", icon: Sword, label: "Anime" },
  { href: "/tvshows", icon: Tv, label: "TV" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/watchlist", icon: Bookmark, label: "Saved" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-40 lg:hidden">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-around h-16 px-2 rounded-2xl bg-[#0a0a12]/90 backdrop-blur-2xl border border-white/[0.06] shadow-[0_10px_40px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)]"
      >
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/home" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all duration-300 dock-item",
                isActive ? "text-primary" : "text-white/30 active:text-white/60"
              )}
            >
              {/* Active background pill */}
              {isActive && (
                <motion.div
                  layoutId="mobile-tab-active"
                  className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <tab.icon className={cn(
                "w-5 h-5 relative z-10 transition-transform duration-200",
                isActive && "scale-110"
              )} />
              <span className={cn(
                "text-[9px] font-medium relative z-10 transition-all",
                isActive ? "text-primary" : ""
              )}>{tab.label}</span>
              {/* Active dot */}
              {isActive && (
                <motion.div
                  layoutId="mobile-dot"
                  className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary shadow-[0_0_6px_rgba(229,9,20,0.8)]"
                  transition={{ type: "spring", bounce: 0.3 }}
                />
              )}
            </Link>
          );
        })}
      </motion.div>
    </nav>
  );
}

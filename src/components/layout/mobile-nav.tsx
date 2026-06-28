"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== "/home" && pathname.startsWith(tab.href));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <tab.icon className={cn("w-5 h-5", isActive && "text-primary")} />
              <span className="text-[9px] font-medium">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

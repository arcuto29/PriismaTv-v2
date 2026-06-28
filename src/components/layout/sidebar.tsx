"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home, Film, Sword, Tv, Users, Video, MonitorPlay,
  Bookmark, Heart, UserPlus, Trophy, Calendar, History,
  Layers, Hand, PlusCircle, Settings, Menu, X, Play
} from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/anime", icon: Sword, label: "Anime" },
  { href: "/tvshows", icon: Tv, label: "TV Shows" },
  { href: "/watch-together", icon: Users, label: "Watch Together" },
  { href: "/youtube", icon: Video, label: "YouTube" },
  { href: "/twitch", icon: MonitorPlay, label: "Twitch" },
  { href: "/watchlist", icon: Bookmark, label: "Watchlist" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/friends", icon: UserPlus, label: "Friends" },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/history", icon: History, label: "History" },
  { href: "/collections", icon: Layers, label: "Collections" },
  { href: "/requests", icon: Hand, label: "Requests" },
  { href: "/admin", icon: PlusCircle, label: "Add Content" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg glass"
      >
        <Menu className="w-5 h-5 text-primary" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex flex-col",
          "bg-card/95 backdrop-blur-xl border-r border-border",
          "transition-all duration-300",
          collapsed ? "w-[72px]" : "w-[240px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
            <Play className="w-4 h-4 text-black fill-black" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-lg tracking-tight"
            >
              <span className="text-primary">Priisma</span>
              <span className="text-foreground">Tv</span>
            </motion.span>
          )}
          <button
            onClick={() => {
              setCollapsed(!collapsed);
              setMobileOpen(false);
            }}
            className="ml-auto p-1.5 rounded-md hover:bg-muted transition-colors lg:block hidden"
          >
            <Menu className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto p-1.5 rounded-md hover:bg-muted transition-colors lg:hidden"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full"
                  />
                )}
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                {!collapsed && (
                  <span className="text-sm font-medium truncate">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User avatar */}
        <div className="px-3 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              P
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium truncate">PriismaTv User</p>
                <p className="text-xs text-muted-foreground">Premium</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
}

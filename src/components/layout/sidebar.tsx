"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Home, Film, Sword, Tv, Users, Video, MonitorPlay,
  Bookmark, Heart, UserPlus, Trophy, Calendar, History,
  Layers, Hand, PlusCircle, Settings, Menu, X, Play,
  Smile, BarChart3, Award, Shield
} from "lucide-react";

const navItems = [
  { href: "/home", icon: Home, label: "Home" },
  { href: "/movies", icon: Film, label: "Movies" },
  { href: "/anime", icon: Sword, label: "Anime" },
  { href: "/tvshows", icon: Tv, label: "TV Shows" },
  { href: "/mood", icon: Smile, label: "Mood Picker" },
  { href: "/watch-together", icon: Users, label: "Watch Together" },
  { href: "/youtube", icon: Video, label: "YouTube" },
  { href: "/twitch", icon: MonitorPlay, label: "Twitch" },
  { href: "/watchlist", icon: Bookmark, label: "Watchlist" },
  { href: "/favorites", icon: Heart, label: "Favorites" },
  { href: "/friends", icon: UserPlus, label: "Friends" },
  { href: "/challenges", icon: Trophy, label: "Challenges" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/history", icon: History, label: "History" },
  { href: "/stats", icon: BarChart3, label: "Watch Stats" },
  { href: "/achievements", icon: Award, label: "Achievements" },
  { href: "/collections", icon: Layers, label: "Collections" },
  { href: "/requests", icon: Hand, label: "Requests" },
  { href: "/admin", icon: PlusCircle, label: "Add Content" },
  { href: "/admin-panel", icon: Shield, label: "Owner Panel" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("P");

  useEffect(() => {
    const name = sessionStorage.getItem("priismatv_user") || localStorage.getItem("priismatv_user") || "P";
    setUserName(name);
  }, []);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2.5 rounded-xl bg-black/70 backdrop-blur-xl border border-white/[0.06] magnetic-btn"
      >
        <Menu className="w-5 h-5 text-white/80" />
      </button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        className={cn(
          "fixed top-0 left-0 h-full z-50 flex flex-col",
          "bg-[#060609]/95 backdrop-blur-2xl",
          "border-r border-white/[0.03]",
          "transition-all duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          collapsed ? "w-[72px]" : "w-[260px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-[72px] border-b border-white/[0.03]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-red-700 flex items-center justify-center flex-shrink-0 shadow-[0_4px_15px_rgba(229,9,20,0.3)]">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="font-bold text-lg tracking-tight"
              >
                <span className="text-primary">Priisma</span>
                <span className="text-white/90">Tv</span>
              </motion.span>
            )}
          </AnimatePresence>
          <button onClick={() => setMobileOpen(false)} className="ml-auto p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors lg:hidden">
            <X className="w-4 h-4 text-white/40" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                  isActive ? "text-white" : "text-white/35 hover:text-white/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 rounded-xl bg-white/[0.06] border border-white/[0.06]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-5 bg-primary rounded-r-full shadow-[0_0_8px_rgba(229,9,20,0.6)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <item.icon className={cn("w-[18px] h-[18px] flex-shrink-0 relative z-10 transition-all duration-200", isActive && "text-primary")} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      transition={{ duration: 0.15 }}
                      className="text-[13px] font-medium truncate relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {/* Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-[#12121a] border border-white/[0.06] text-white/80 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-[100]">
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="px-3 py-4 border-t border-white/[0.03]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0 border border-primary/20">
              {userName[0]?.toUpperCase() || "P"}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                  <p className="text-sm font-medium text-white/80 truncate">{userName}</p>
                  <p className="text-[10px] text-primary/60 font-medium tracking-wide uppercase">Premium</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

"use client";
import { motion } from "framer-motion";
import { UserPlus, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/hooks/use-online-status";

export default function FriendsPage() {
  const { onlineUsers, fetchOnlineUsers } = useOnlineStatus();

  const online = onlineUsers.filter((u) => u.is_online);
  const offline = onlineUsers.filter((u) => !u.is_online);

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-6 h-6 text-green-400" />
          <h1 className="text-2xl font-bold">Friends</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 font-medium">
            {online.length} online
          </span>
        </div>
        <button onClick={fetchOnlineUsers} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Online */}
        <div>
          <h3 className="text-sm font-semibold text-green-400 mb-3 flex items-center gap-2">
            <Wifi className="w-4 h-4" /> Online Now ({online.length})
          </h3>
          <div className="space-y-2">
            {online.map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-green-500/20"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-card" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{user.name}</p>
                    {user.role === "owner" && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-500/20 text-yellow-400 uppercase">👑 Owner</span>
                    )}
                    {user.role === "mod" && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500/20 text-purple-400 uppercase">⚔️ Mod</span>
                    )}
                    {(!user.role || user.role === "member") && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/20 text-blue-400 uppercase">Member</span>
                    )}
                  </div>
                  <p className="text-[10px] text-green-400 font-mono">● Online now</p>
                </div>
              </motion.div>
            ))}
            {online.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">Nobody online right now</p>
            )}
          </div>
        </div>

        {/* Offline */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
            <WifiOff className="w-4 h-4" /> Offline ({offline.length})
          </h3>
          <div className="space-y-2">
            {offline.map((user, i) => (
              <motion.div
                key={user.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border opacity-60"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-bold text-white/60">
                    {user.name[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-gray-500 border-2 border-card" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-muted-foreground">{user.name}</p>
                    {user.role === "owner" && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-500/20 text-yellow-400 uppercase">👑 Owner</span>
                    )}
                    {user.role === "mod" && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-purple-500/20 text-purple-400 uppercase">⚔️ Mod</span>
                    )}
                    {(!user.role || user.role === "member") && (
                      <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-500/20 text-blue-400 uppercase">Member</span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    Last seen: {user.last_heartbeat ? new Date(user.last_heartbeat).toLocaleDateString() + " " + new Date(user.last_heartbeat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "Never"}
                  </p>
                </div>
              </motion.div>
            ))}
            {offline.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No offline users</p>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-xs text-muted-foreground">
            Online status updates every 30 seconds. Users appear offline after 60 seconds of no activity.
            Everyone who has logged into PriismaTv shows here.
          </p>
        </div>
      </div>
    </div>
  );
}

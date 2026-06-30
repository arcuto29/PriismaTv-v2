"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, Check, X, Clock, Wifi, WifiOff, UserMinus, RefreshCw, Users } from "lucide-react";
import { useFriends } from "@/hooks/use-friends";
import { cn } from "@/lib/utils";

export default function FriendsPage() {
  const {
    friends, incomingRequests, outgoingRequests, allUsers, loading, currentUser,
    sendRequest, acceptRequest, declineRequest, removeFriend, getFriendStatus, refresh,
  } = useFriends();
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState<"friends" | "add" | "requests">("friends");
  const [sending, setSending] = useState<string | null>(null);

  const filteredUsers = allUsers.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onlineFriends = friends.filter((f) => f.is_online);
  const offlineFriends = friends.filter((f) => !f.is_online);

  const handleSendRequest = async (name: string) => {
    setSending(name);
    await sendRequest(name);
    setSending(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">Friends</h1>
          {incomingRequests.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-bold animate-pulse">
              {incomingRequests.length} new
            </span>
          )}
        </div>
        <button onClick={refresh} className="p-2 rounded-lg hover:bg-muted transition-colors">
          <RefreshCw className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl bg-muted/50 max-w-md">
        {[
          { id: "friends" as const, label: "My Friends", count: friends.length },
          { id: "add" as const, label: "Add Friends", count: null },
          { id: "requests" as const, label: "Requests", count: incomingRequests.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all relative",
              tab === t.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
            {t.count !== null && t.count > 0 && (
              <span className={cn(
                "ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold",
                t.id === "requests" ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* MY FRIENDS TAB */}
        {tab === "friends" && (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm mb-2">No friends yet</p>
                <button
                  onClick={() => setTab("add")}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Add your first friend →
                </button>
              </div>
            ) : (
              <>
                {/* Online Friends */}
                {onlineFriends.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                      <Wifi className="w-3 h-3" /> Online ({onlineFriends.length})
                    </h3>
                    <div className="space-y-2">
                      {onlineFriends.map((friend, i) => (
                        <motion.div
                          key={friend.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-card border border-green-500/20"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-sm font-bold text-white">
                              {friend.name[0].toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold">{friend.name}</p>
                            <p className="text-[10px] text-green-400">● Online now</p>
                          </div>
                          <button
                            onClick={() => removeFriend(friend.name)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            title="Remove friend"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Offline Friends */}
                {offlineFriends.length > 0 && (
                  <div>
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-2 uppercase tracking-wider">
                      <WifiOff className="w-3 h-3" /> Offline ({offlineFriends.length})
                    </h3>
                    <div className="space-y-2">
                      {offlineFriends.map((friend, i) => (
                        <motion.div
                          key={friend.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border opacity-70"
                        >
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-bold text-white/60">
                              {friend.name[0].toUpperCase()}
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-gray-500 border-2 border-card" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-muted-foreground">{friend.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              Last seen: {friend.last_heartbeat
                                ? new Date(friend.last_heartbeat).toLocaleDateString() + " " + new Date(friend.last_heartbeat).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                                : "Unknown"}
                            </p>
                          </div>
                          <button
                            onClick={() => removeFriend(friend.name)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                            title="Remove friend"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ADD FRIENDS TAB */}
        {tab === "add" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* User List */}
            <div className="space-y-2">
              {filteredUsers.map((user, i) => {
                const status = getFriendStatus(user.name);
                return (
                  <motion.div
                    key={user.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <div className="relative">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white",
                        user.is_online ? "bg-gradient-to-br from-green-500 to-emerald-600" : "bg-gradient-to-br from-gray-600 to-gray-700"
                      )}>
                        {user.name[0].toUpperCase()}
                      </div>
                      {user.is_online && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold">{user.name}</p>
                        {user.role === "owner" && (
                          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-yellow-500/20 text-yellow-400">👑</span>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        {user.is_online ? "Online now" : "Offline"}
                      </p>
                    </div>
                    <div>
                      {status === "friend" && (
                        <span className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-400 text-[10px] font-bold">
                          ✓ Friends
                        </span>
                      )}
                      {status === "pending_sent" && (
                        <span className="px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 text-[10px] font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {status === "pending_received" && (
                        <button
                          onClick={() => {
                            const req = incomingRequests.find((r) => r.from_user === user.name);
                            if (req) acceptRequest(req.id);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-[10px] font-bold hover:bg-primary/30 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      {status === "none" && (
                        <button
                          onClick={() => handleSendRequest(user.name)}
                          disabled={sending === user.name}
                          className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          {sending === user.name ? (
                            <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <UserPlus className="w-3 h-3" />
                          )}
                          Add
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
              {filteredUsers.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {searchQuery ? "No users found" : "No other users yet"}
                </p>
              )}
            </div>
          </div>
        )}

        {/* REQUESTS TAB */}
        {tab === "requests" && (
          <div className="space-y-6">
            {/* Incoming */}
            <div>
              <h3 className="text-xs font-semibold text-primary mb-3 uppercase tracking-wider">
                Incoming Requests ({incomingRequests.length})
              </h3>
              {incomingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No pending requests</p>
              ) : (
                <div className="space-y-2">
                  {incomingRequests.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-primary/20"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 flex items-center justify-center text-sm font-bold text-white">
                        {req.from_user[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{req.from_user}</p>
                        <p className="text-[10px] text-muted-foreground">Wants to be your friend</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => acceptRequest(req.id)}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => declineRequest(req.id)}
                          className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Outgoing */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
                Sent Requests ({outgoingRequests.length})
              </h3>
              {outgoingRequests.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No sent requests</p>
              ) : (
                <div className="space-y-2">
                  {outgoingRequests.map((req, i) => (
                    <motion.div
                      key={req.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-sm font-bold text-white/60">
                        {req.to_user[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{req.to_user}</p>
                        <p className="text-[10px] text-yellow-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Waiting for response
                        </p>
                      </div>
                      <button
                        onClick={() => declineRequest(req.id)}
                        className="px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-[10px] font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="max-w-2xl mt-8 p-4 rounded-xl bg-muted/30 border border-border">
        <p className="text-[11px] text-muted-foreground">
          💡 To add friends, go to the &quot;Add Friends&quot; tab and search for users who have logged into PriismaTv. They&apos;ll need to accept your request before appearing in your friends list.
        </p>
      </div>
    </div>
  );
}

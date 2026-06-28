"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Array<{ name: string; is_online: boolean; last_heartbeat: string }>>([]);

  // Send heartbeat every 30 seconds to show we're online
  useEffect(() => {
    const username = sessionStorage.getItem("priismatv_user");
    if (!username) return;

    const sendHeartbeat = async () => {
      await supabase
        .from("visitors")
        .update({ is_online: true, last_heartbeat: new Date().toISOString() })
        .eq("name", username);
    };

    // Send immediately
    sendHeartbeat();

    // Then every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000);

    // Mark offline when leaving
    const handleBeforeUnload = () => {
      navigator.sendBeacon && supabase
        .from("visitors")
        .update({ is_online: false })
        .eq("name", username);
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Mark offline on unmount
      supabase.from("visitors").update({ is_online: false }).eq("name", username);
    };
  }, []);

  // Fetch online users every 10 seconds
  const fetchOnlineUsers = useCallback(async () => {
    const { data } = await supabase
      .from("visitors")
      .select("name, is_online, last_heartbeat")
      .order("last_heartbeat", { ascending: false });

    if (data) {
      // Mark users as offline if no heartbeat in last 60 seconds
      const now = Date.now();
      const processed = data.map((u) => ({
        ...u,
        is_online: u.is_online && u.last_heartbeat && (now - new Date(u.last_heartbeat).getTime() < 60000),
      }));
      setOnlineUsers(processed);
    }
  }, []);

  useEffect(() => {
    fetchOnlineUsers();
    const interval = setInterval(fetchOnlineUsers, 10000);
    return () => clearInterval(interval);
  }, [fetchOnlineUsers]);

  return { onlineUsers, fetchOnlineUsers };
}

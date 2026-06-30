"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface FriendRequest {
  id: string;
  from_user: string;
  to_user: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
}

export interface Friend {
  name: string;
  is_online: boolean;
  last_heartbeat: string | null;
  role?: string;
}

export function useFriends() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<FriendRequest[]>([]);
  const [allUsers, setAllUsers] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = typeof window !== "undefined"
    ? sessionStorage.getItem("priismatv_user") || localStorage.getItem("priismatv_user") || ""
    : "";

  // Fetch friends list (accepted requests)
  const fetchFriends = useCallback(async () => {
    if (!currentUser) return;

    const { data: requests } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("status", "accepted")
      .or(`from_user.eq.${currentUser},to_user.eq.${currentUser}`);

    if (requests) {
      const friendNames = requests.map((r) =>
        r.from_user === currentUser ? r.to_user : r.from_user
      );

      // Get online status for friends
      const { data: visitors } = await supabase
        .from("visitors")
        .select("name, is_online, last_heartbeat, role")
        .in("name", friendNames.length > 0 ? friendNames : ["__none__"]);

      if (visitors) {
        const now = Date.now();
        setFriends(
          visitors.map((v) => ({
            ...v,
            is_online: v.is_online && v.last_heartbeat && (now - new Date(v.last_heartbeat).getTime() < 60000),
          }))
        );
      }
    }
  }, [currentUser]);

  // Fetch pending requests
  const fetchRequests = useCallback(async () => {
    if (!currentUser) return;

    const { data: incoming } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("to_user", currentUser)
      .eq("status", "pending");

    const { data: outgoing } = await supabase
      .from("friend_requests")
      .select("*")
      .eq("from_user", currentUser)
      .eq("status", "pending");

    if (incoming) setIncomingRequests(incoming);
    if (outgoing) setOutgoingRequests(outgoing);
  }, [currentUser]);

  // Fetch all users (for searching who to add)
  const fetchAllUsers = useCallback(async () => {
    if (!currentUser) return;

    const { data } = await supabase
      .from("visitors")
      .select("name, is_online, last_heartbeat, role")
      .neq("name", currentUser)
      .order("last_heartbeat", { ascending: false });

    if (data) {
      const now = Date.now();
      setAllUsers(
        data.map((v) => ({
          ...v,
          is_online: v.is_online && v.last_heartbeat && (now - new Date(v.last_heartbeat).getTime() < 60000),
        }))
      );
    }
  }, [currentUser]);

  // Send friend request
  const sendRequest = useCallback(async (toUser: string) => {
    if (!currentUser) return false;

    // Check if request already exists
    const { data: existing } = await supabase
      .from("friend_requests")
      .select("*")
      .or(`and(from_user.eq.${currentUser},to_user.eq.${toUser}),and(from_user.eq.${toUser},to_user.eq.${currentUser})`)
      .single();

    if (existing) return false;

    const { error } = await supabase
      .from("friend_requests")
      .insert({ from_user: currentUser, to_user: toUser, status: "pending" });

    if (!error) {
      await fetchRequests();
      return true;
    }
    return false;
  }, [currentUser, fetchRequests]);

  // Accept friend request
  const acceptRequest = useCallback(async (requestId: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .update({ status: "accepted" })
      .eq("id", requestId);

    if (!error) {
      await fetchRequests();
      await fetchFriends();
    }
  }, [fetchRequests, fetchFriends]);

  // Decline friend request
  const declineRequest = useCallback(async (requestId: string) => {
    const { error } = await supabase
      .from("friend_requests")
      .delete()
      .eq("id", requestId);

    if (!error) {
      await fetchRequests();
    }
  }, [fetchRequests]);

  // Remove friend
  const removeFriend = useCallback(async (friendName: string) => {
    if (!currentUser) return;

    await supabase
      .from("friend_requests")
      .delete()
      .eq("status", "accepted")
      .or(`and(from_user.eq.${currentUser},to_user.eq.${friendName}),and(from_user.eq.${friendName},to_user.eq.${currentUser})`);

    await fetchFriends();
  }, [currentUser, fetchFriends]);

  // Check if user is already a friend or has pending request
  const getFriendStatus = useCallback((userName: string): "friend" | "pending_sent" | "pending_received" | "none" => {
    if (friends.some((f) => f.name === userName)) return "friend";
    if (outgoingRequests.some((r) => r.to_user === userName)) return "pending_sent";
    if (incomingRequests.some((r) => r.from_user === userName)) return "pending_received";
    return "none";
  }, [friends, outgoingRequests, incomingRequests]);

  // Initial fetch
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchFriends(), fetchRequests(), fetchAllUsers()]);
      setLoading(false);
    };
    init();

    // Refresh every 15 seconds
    const interval = setInterval(() => {
      fetchFriends();
      fetchRequests();
    }, 15000);

    return () => clearInterval(interval);
  }, [fetchFriends, fetchRequests, fetchAllUsers]);

  return {
    friends,
    incomingRequests,
    outgoingRequests,
    allUsers,
    loading,
    currentUser,
    sendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    getFriendStatus,
    refresh: () => { fetchFriends(); fetchRequests(); fetchAllUsers(); },
  };
}

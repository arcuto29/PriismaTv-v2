"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

// =================== INVITE CODES ===================
export function useInviteCodes() {
  const [codes, setCodes] = useState<Array<{ id: string; code: string; used_by: string | null; is_used: boolean; created_at: string }>>([]);

  const fetchCodes = useCallback(async () => {
    const { data } = await supabase.from("invite_codes").select("*").order("created_at", { ascending: false });
    if (data) setCodes(data);
  }, []);

  useEffect(() => { fetchCodes(); }, [fetchCodes]);

  const generateCode = useCallback(async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from("invite_codes").insert({ code, created_by: "owner" }).select();
    if (!error && data) {
      setCodes((prev) => [data[0], ...prev]);
      return code;
    }
    return null;
  }, []);

  const validateCode = useCallback(async (code: string, username: string) => {
    const { data } = await supabase.from("invite_codes").select("*").eq("code", code.toUpperCase()).eq("is_used", false).single();
    if (data) {
      await supabase.from("invite_codes").update({ is_used: true, used_by: username, used_at: new Date().toISOString() }).eq("id", data.id);
      return true;
    }
    return false;
  }, []);

  return { codes, generateCode, validateCode, fetchCodes };
}

// =================== REQUESTS ===================
export function useRequests() {
  const [requests, setRequests] = useState<Array<{ id: string; title: string; type: string; requested_by: string; status: string; created_at: string }>>([]);

  const fetchRequests = useCallback(async () => {
    const { data } = await supabase.from("requests").select("*").order("created_at", { ascending: false });
    if (data) setRequests(data);
  }, []);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const submitRequest = useCallback(async (title: string, type: string, requestedBy: string) => {
    const { error } = await supabase.from("requests").insert({ title, type, requested_by: requestedBy });
    if (!error) fetchRequests();
    return !error;
  }, [fetchRequests]);

  const updateRequestStatus = useCallback(async (id: string, status: string) => {
    const { error } = await supabase.from("requests").update({ status }).eq("id", id);
    if (!error) fetchRequests();
  }, [fetchRequests]);

  return { requests, submitRequest, updateRequestStatus, fetchRequests };
}

// =================== VISITORS ===================
export function useVisitors() {
  const [visitors, setVisitors] = useState<Array<{ id: string; name: string; invite_code: string; last_seen: string; first_seen: string; visit_count: number }>>([]);

  const fetchVisitors = useCallback(async () => {
    const { data } = await supabase.from("visitors").select("*").order("last_seen", { ascending: false });
    if (data) setVisitors(data);
  }, []);

  useEffect(() => { fetchVisitors(); }, [fetchVisitors]);

  const logVisit = useCallback(async (name: string, inviteCode?: string) => {
    // Check if visitor exists
    const { data: existing } = await supabase.from("visitors").select("*").eq("name", name).single();
    if (existing) {
      await supabase.from("visitors").update({ last_seen: new Date().toISOString(), visit_count: existing.visit_count + 1 }).eq("id", existing.id);
    } else {
      await supabase.from("visitors").insert({ name, invite_code: inviteCode || null });
    }
    fetchVisitors();
  }, [fetchVisitors]);

  return { visitors, logVisit, fetchVisitors };
}

// =================== CHAT ===================
export function useChat(roomId: string) {
  const [messages, setMessages] = useState<Array<{ id: string; username: string; message: string; created_at: string }>>([]);

  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
    const { data } = await supabase.from("messages").select("*").eq("room_id", roomId).order("created_at", { ascending: true }).limit(100);
    if (data) setMessages(data);
  }, [roomId]);

  useEffect(() => {
    fetchMessages();
    // Real-time subscription
    const channel = supabase.channel(`room-${roomId}`).on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages", filter: `room_id=eq.${roomId}` },
      (payload) => {
        setMessages((prev) => [...prev, payload.new as typeof messages[0]]);
      }
    ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [roomId, fetchMessages]);

  const sendMessage = useCallback(async (username: string, message: string) => {
    if (!roomId || !message.trim()) return;
    await supabase.from("messages").insert({ room_id: roomId, username, message: message.trim() });
  }, [roomId]);

  return { messages, sendMessage };
}

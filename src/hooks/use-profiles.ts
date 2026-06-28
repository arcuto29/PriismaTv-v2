"use client";
import { useState, useEffect, useCallback } from "react";

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  color: string;
}

const AVATARS = ["🐉", "⚔️", "🎬", "🔥", "💀", "🌙", "🎮", "👑", "🦊", "🐺", "🦁", "🎭"];
const COLORS = ["from-cyan-500 to-blue-600", "from-purple-500 to-pink-600", "from-red-500 to-orange-600", "from-green-500 to-teal-600", "from-yellow-500 to-amber-600", "from-indigo-500 to-purple-600"];

const DEFAULT_PROFILES: UserProfile[] = [
  { id: "default", name: "PriismaTv User", avatar: "⚔️", color: "from-cyan-500 to-blue-600" },
];

export function useProfiles() {
  const [profiles, setProfiles] = useState<UserProfile[]>(DEFAULT_PROFILES);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(DEFAULT_PROFILES[0]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("priismatv_profiles");
    const activeId = localStorage.getItem("priismatv_active_profile");
    if (stored) {
      const parsed = JSON.parse(stored);
      setProfiles(parsed);
      const active = parsed.find((p: UserProfile) => p.id === activeId) || parsed[0];
      setActiveProfile(active);
    }
    setIsLoaded(true);
  }, []);

  const saveProfiles = (updated: UserProfile[]) => {
    setProfiles(updated);
    localStorage.setItem("priismatv_profiles", JSON.stringify(updated));
  };

  const addProfile = useCallback((name: string, avatar: string, color: string) => {
    const newProfile: UserProfile = { id: Date.now().toString(), name, avatar, color };
    const updated = [...profiles, newProfile];
    saveProfiles(updated);
    return newProfile;
  }, [profiles]);

  const removeProfile = useCallback((id: string) => {
    if (id === "default") return;
    const updated = profiles.filter((p) => p.id !== id);
    saveProfiles(updated);
    if (activeProfile.id === id) switchProfile(updated[0]);
  }, [profiles, activeProfile]);

  const switchProfile = useCallback((profile: UserProfile) => {
    setActiveProfile(profile);
    localStorage.setItem("priismatv_active_profile", profile.id);
  }, []);

  const updateProfile = useCallback((id: string, data: Partial<UserProfile>) => {
    const updated = profiles.map((p) => (p.id === id ? { ...p, ...data } : p));
    saveProfiles(updated);
    if (activeProfile.id === id) setActiveProfile({ ...activeProfile, ...data });
  }, [profiles, activeProfile]);

  return { profiles, activeProfile, addProfile, removeProfile, switchProfile, updateProfile, isLoaded, AVATARS, COLORS };
}

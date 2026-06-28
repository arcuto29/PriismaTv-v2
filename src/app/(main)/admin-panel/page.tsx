"use client";
import { useState, useEffect } from "react";
import { Shield, Key, Users, Copy, RefreshCw, Trash2 } from "lucide-react";
import { useInviteCodes, useVisitors } from "@/hooks/use-supabase";
import { OWNER_PASSWORD } from "@/data/content";

export default function AdminPanelPage() {
  const [isOwner, setIsOwner] = useState(false);
  const [ownerInput, setOwnerInput] = useState("");
  const { codes, generateCode, fetchCodes } = useInviteCodes();
  const { visitors, fetchVisitors } = useVisitors();
  const [newCode, setNewCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("priismatv_owner") === "true") setIsOwner(true);
  }, []);

  if (!isOwner) {
    return (
      <div className="px-4 lg:px-8 py-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-sm w-full">
          <Shield className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-1">Owner Panel</h2>
          <p className="text-sm text-muted-foreground mb-6">Manage invite codes & see visitors.</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (ownerInput === OWNER_PASSWORD) {
              setIsOwner(true);
              sessionStorage.setItem("priismatv_owner", "true");
            }
          }} className="space-y-3">
            <input type="password" value={ownerInput} onChange={(e) => setOwnerInput(e.target.value)}
              placeholder="Owner password..."
              className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <button type="submit" className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm">UNLOCK</button>
          </form>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    const code = await generateCode();
    if (code) {
      setNewCode(code);
      setCopied(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(newCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-4 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Owner Panel</h1>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Generate Invite Codes */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Key className="w-4 h-4 text-primary" /> Invite Codes</h3>
          <p className="text-sm text-muted-foreground mb-4">Generate one-time codes to give friends access. Each code can only be used once.</p>

          <button onClick={handleGenerate} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all mb-4">
            Generate New Code
          </button>

          {newCode && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted border border-primary/20 mb-4">
              <span className="font-mono text-lg font-bold text-primary tracking-wider">{newCode}</span>
              <button onClick={copyCode} className="ml-auto px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-xs font-medium hover:bg-primary/30 flex items-center gap-1">
                <Copy className="w-3 h-3" /> {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          )}

          {/* All codes */}
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium">All Codes</h4>
            <button onClick={fetchCodes} className="p-1.5 rounded hover:bg-muted"><RefreshCw className="w-3.5 h-3.5 text-muted-foreground" /></button>
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {codes.map((c) => (
              <div key={c.id} className={`flex items-center justify-between p-2.5 rounded-lg text-sm ${c.is_used ? "bg-muted/50 opacity-60" : "bg-muted"}`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-xs">{c.code}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${c.is_used ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}>
                    {c.is_used ? "Used" : "Active"}
                  </span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {c.is_used ? `Used by: ${c.used_by}` : "Available"}
                </div>
              </div>
            ))}
            {codes.length === 0 && <p className="text-xs text-muted-foreground">No codes generated yet.</p>}
          </div>
        </div>

        {/* Visitors */}
        <div className="p-6 rounded-xl bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-green-400" /> Visitors</h3>
            <button onClick={fetchVisitors} className="p-1.5 rounded hover:bg-muted"><RefreshCw className="w-3.5 h-3.5 text-muted-foreground" /></button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">People who have accessed PriismaTv.</p>

          <div className="space-y-2">
            {visitors.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 rounded-lg bg-muted">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {v.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{v.name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Code: {v.invite_code || "master"} • Visits: {v.visit_count}
                    </p>
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground text-right">
                  <p>Last: {new Date(v.last_seen).toLocaleDateString()}</p>
                  <p>{new Date(v.last_seen).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {visitors.length === 0 && <p className="text-xs text-muted-foreground">No visitors yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

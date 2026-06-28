"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { useChat } from "@/hooks/use-supabase";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get username from session - check repeatedly until found
  useEffect(() => {
    const user = sessionStorage.getItem("priismatv_user");
    if (user) {
      setUsername(user);
      return;
    }
    // Poll for it (in case it's set after mount)
    const interval = setInterval(() => {
      const u = sessionStorage.getItem("priismatv_user");
      if (u) {
        setUsername(u);
        clearInterval(interval);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const { messages, sendMessage } = useChat(joined ? roomCode : "");

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const joinRoom = () => {
    if (username.trim() && roomCode.trim()) {
      setJoined(true);
    }
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(username, message);
    setMessage("");
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-24 z-40 w-12 h-12 rounded-full bg-card border border-border text-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        title="Chat"
      >
        <MessageCircle className="w-5 h-5" />
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 right-6 z-50 w-80 h-[420px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h4 className="font-semibold text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary" /> Live Chat
                {joined && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">Connected</span>}
              </h4>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {!joined ? (
              /* Join Form */
              <div className="flex-1 flex flex-col justify-center p-4 gap-3">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Your name..."
                  className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  placeholder="Room code..."
                  className="px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={joinRoom}
                  className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
                >
                  Join Chat
                </button>
                <p className="text-xs text-muted-foreground text-center">Share the same room code with friends to chat together! Messages sync in real-time.</p>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {messages.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">No messages yet. Say something!</p>
                  )}
                  {messages.map((msg) => (
                    <div key={msg.id} className="text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className={`font-semibold ${msg.username === username ? "text-primary" : "text-purple-400"}`}>{msg.username}</span>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p className="mt-0.5 text-foreground">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-border">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      placeholder="Type a message..."
                      className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button onClick={handleSend} className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

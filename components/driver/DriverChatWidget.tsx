"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2, ChevronDown, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { fmtShort } from "@/lib/driver/theme";

const COMPLAINT_TYPES = [
  { key: "payment_issue",     label: "Payment Issue"         },
  { key: "ride_dispute",      label: "Ride / Trip Dispute"   },
  { key: "app_problem",       label: "App / Technical Issue" },
  { key: "account_issue",     label: "Account Problem"       },
  { key: "document_query",    label: "Document Query"        },
  { key: "general",           label: "General Inquiry"       },
];

export default function DriverChatWidget() {
  const [open,       setOpen]       = useState(false);
  const [step,       setStep]       = useState<"type" | "chat">("type");
  const [subject,    setSubject]    = useState("");
  const [msgs,       setMsgs]       = useState<any[]>([]);
  const [chatId,     setChatId]     = useState<string | null>(null);
  const [driver,     setDriver]     = useState<any>(null);
  const [authUser,   setAuthUser]   = useState<any>(null);
  const [msg,        setMsg]        = useState("");
  const [sending,    setSending]    = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [unread,     setUnread]     = useState(0);
  const endRef = useRef<HTMLDivElement>(null);

  // Load driver info once
  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      setAuthUser(session.user);
      const { data: drv } = await (supabase as any)
        .from("drivers").select("id,full_name,email").eq("user_id", session.user.id).maybeSingle();
      if (drv) setDriver(drv);

      // Check existing chat
      const { data: chat } = await (supabase as any)
        .from("support_chats").select("id,subject").eq("driver_id", drv?.id).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (chat) {
        setChatId(chat.id);
        setSubject(chat.subject || "");
        const { data: messages } = await (supabase as any)
          .from("support_messages").select("*").eq("chat_id", chat.id).order("created_at", { ascending: true });
        setMsgs(messages || []);
        const unreadCount = (messages || []).filter((m: any) => m.sender_type !== "driver").length;
        setUnread(unreadCount);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (open) {
      setUnread(0);
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [open, msgs]);

  const startChat = async () => {
    if (!subject) return;
    setLoading(true);
    try {
      const supabase = createClient();
      const subjectLabel = COMPLAINT_TYPES.find(c => c.key === subject)?.label || subject;
      const { data: chat } = await (supabase as any).from("support_chats").insert({
        driver_id:  driver.id,
        subject:    subjectLabel,
        status:     "open",
        chat_type:  "driver",
      }).select().single();
      setChatId((chat as any).id);
      setStep("chat");
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  const sendMessage = async () => {
    if (!msg.trim() || !chatId) return;
    setSending(true);
    try {
      const supabase = createClient();
      const { data: newMsg } = await (supabase as any).from("support_messages").insert({
        chat_id:     chatId,
        sender_id:   authUser.id,
        sender_name: driver?.full_name || "Driver",
        sender_type: "driver",
        content:     msg.trim(),
      }).select().single();
      setMsgs(prev => [...prev, newMsg]);
      setMsg("");
      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { /* ignore */ }
    finally { setSending(false); }
  };

  return (
    <>
      {/* Widget */}
      {open && (
        <div className="fixed bottom-20 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col"
          style={{ height: "480px" }}>

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0b66d1] text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-bold">Support Chat</p>
                <p className="text-[10px] text-white/70">BlackDrivo Support Team</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/20 transition">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Step 1 — Select complaint type */}
          {step === "type" && !chatId && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="rounded-xl bg-blue-50 px-3 py-2.5 text-xs text-blue-700">
                <p className="font-semibold mb-0.5">How can we help?</p>
                <p className="text-blue-600">Select a topic and we'll connect you with our support team.</p>
              </div>

              <div className="space-y-2">
                {COMPLAINT_TYPES.map(c => (
                  <button key={c.key} onClick={() => setSubject(c.key)}
                    className={`w-full flex items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition
                      ${subject === c.key
                        ? "border-[#0b66d1] bg-blue-50 text-[#0b66d1]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      }`}>
                    {c.label}
                    {subject === c.key && <div className="h-2 w-2 rounded-full bg-[#0b66d1]" />}
                  </button>
                ))}
              </div>

              <button onClick={startChat} disabled={!subject || loading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white hover:bg-[#0952a8] disabled:opacity-50 transition">
                {loading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <><Send className="h-4 w-4" /> Start Chat</>
                }
              </button>
            </div>
          )}

          {/* Step 1 (existing chat) — show subject + option to new */}
          {step === "type" && chatId && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3">
                <p className="text-xs font-semibold text-emerald-700 mb-1">Active Conversation</p>
                <p className="text-sm font-medium text-gray-900">{subject}</p>
              </div>
              <button onClick={() => setStep("chat")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#0b66d1] py-3 text-sm font-semibold text-white hover:bg-[#0952a8] transition">
                Continue Chat
              </button>
              <button onClick={() => { setChatId(null); setMsgs([]); setSubject(""); }}
                className="w-full rounded-xl border border-gray-200 py-2.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition">
                Start New Conversation
              </button>
            </div>
          )}

          {/* Step 2 — Chat */}
          {step === "chat" && (
            <>
              {/* Subject bar */}
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-100 shrink-0">
                <AlertCircle className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-xs font-medium text-gray-600 truncate">{subject}</p>
                <button onClick={() => setStep("type")} className="ml-auto shrink-0 text-[10px] text-gray-400 hover:text-gray-700">
                  Back
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {msgs.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <MessageCircle className="h-8 w-8 text-gray-200 mb-2" />
                    <p className="text-xs text-gray-400 font-medium">No messages yet</p>
                    <p className="text-[10px] text-gray-300 mt-0.5">We'll respond within a few hours</p>
                  </div>
                )}
                {msgs.map(m => {
                  const isMe = m.sender_type === "driver";
                  return (
                    <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm
                        ${isMe ? "bg-[#0b66d1] text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"}`}>
                        <p className="leading-relaxed text-[13px]">{m.content}</p>
                        <p className={`mt-0.5 text-[10px] ${isMe ? "text-white/60" : "text-gray-400"}`}>{fmtShort(m.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={endRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-100 p-3 shrink-0">
                <div className="flex items-center gap-2">
                  <input value={msg} onChange={e => setMsg(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-[#0b66d1] focus:bg-white transition" />
                  <button onClick={sendMessage} disabled={sending || !msg.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0b66d1] text-white hover:bg-[#0952a8] disabled:opacity-50 transition">
                    {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* FAB Button */}
      <button onClick={() => { setOpen(!open); if (!open) setStep(chatId ? "type" : "type"); }}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0b66d1] text-white shadow-lg hover:bg-[#0952a8] transition-all hover:scale-105 active:scale-95">
        {open
          ? <ChevronDown className="h-5 w-5" />
          : <MessageCircle className="h-5 w-5" />
        }
        {!open && unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}

import LiveChatWidget from "@/components/Chat/LiveChatWidget";
import { Search, MessageSquare } from "lucide-react";

const contacts = [
  { initial: "S", name: "Sarah Jenkins", preview: "Hello team, I have uploaded the venue setup layout...", time: "11m ago", unread: 1, online: true, active: true, color: "linear-gradient(135deg,#7c3aed,#4f46e5)" },
  { initial: "T", name: "Thomas K. (Florals)", preview: "The orchids are loaded. Ready for transit!", time: "2h ago", unread: 0, online: false, active: false, color: "linear-gradient(135deg,#2563eb,#0ea5e9)" },
  { initial: "A", name: "Alex Mercer (AV)", preview: "Confirming sound system checklist coordinates.", time: "Yesterday", unread: 0, online: false, active: false, color: "linear-gradient(135deg,#ec4899,#f43f5e)" },
  { initial: "R", name: "Rahim (Catering)", preview: "Menu confirmed. Allergen sheet attached.", time: "2d ago", unread: 0, online: true, active: false, color: "linear-gradient(135deg,#10b981,#059669)" },
];

export default function MessagesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          boxShadow: "0 10px 40px rgba(124,58,237,0.3)",
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.05)", transform: "translate(40%,-40%)" }} />
        <div className="relative z-10">
          <h1 className="text-2xl font-black tracking-tight text-white">Communication Hub</h1>
          <p className="text-sm text-purple-200 mt-1 font-medium">Interact with clients, event admins, and vendors in real-time.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Inbox */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.9)",
            border: "1px solid rgba(124,58,237,0.1)",
            boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
          }}
        >
          {/* Inbox Header */}
          <div className="p-4 space-y-3" style={{ borderBottom: "1px solid rgba(124,58,237,0.08)" }}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare size={14} style={{ color: "#7c3aed" }} /> Inbox
              </h3>
              <span
                className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}
              >
                1 Unread
              </span>
            </div>
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-1.5"
              style={{ background: "rgba(124,58,237,0.05)", border: "1px solid rgba(124,58,237,0.1)" }}
            >
              <Search size={13} className="text-purple-400 shrink-0" />
              <input
                type="text"
                placeholder="Search chats..."
                className="bg-transparent text-[11px] placeholder-purple-300 outline-none w-full font-medium text-gray-700"
              />
            </div>
          </div>

          {/* Contact List */}
          <div className="divide-y" style={{ borderColor: "rgba(124,58,237,0.06)" }}>
            {contacts.map((c, i) => (
              <div
                key={i}
                className="p-3.5 flex items-start gap-3 cursor-pointer transition-all"
                style={
                  c.active
                    ? {
                        background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(37,99,235,0.04))",
                        borderLeft: "3px solid #7c3aed",
                      }
                    : { borderLeft: "3px solid transparent" }
                }
              >
                <div className="relative shrink-0">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                    style={{ background: c.color }}
                  >
                    {c.initial}
                  </div>
                  {c.online && (
                    <span
                      className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
                      style={{ background: "#10b981", border: "2px solid white" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className={`text-xs font-bold truncate ${c.active ? "text-gray-900" : "text-gray-700"}`}>{c.name}</h4>
                    <span className="text-[9px] font-semibold text-gray-400 shrink-0">{c.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5 font-medium">{c.preview}</p>
                </div>
                {c.unread > 0 && (
                  <span
                    className="w-4 h-4 rounded-full text-[8px] font-black text-white flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)" }}
                  >
                    {c.unread}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          <LiveChatWidget />
        </div>
      </div>
    </div>
  );
}

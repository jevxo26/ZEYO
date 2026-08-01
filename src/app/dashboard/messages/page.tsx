"use client";

import { useState, useRef, useEffect } from "react";
import {
  Search,
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Phone,
  MoreVertical,
  CheckCheck,
  X,
  UserPlus,
  ArrowLeft,
  Trash2,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

interface Message {
  id: number;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  fileUrl?: string;
}

interface Contact {
  id: string;
  initial: string;
  name: string;
  role: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  color: string;
  messages: Message[];
}

// Avatar palette tuned to the site's blue-violet gradient identity.
const AVATAR_COLORS = [
  "bg-[#4F46E5]", // indigo
  "bg-[#7C3AED]", // violet
  "bg-[#C026D3]", // fuchsia
  "bg-[#2563EB]", // blue
  "bg-[#9333EA]", // purple
  "bg-[#DB2777]", // pink
];

const initialContacts: Contact[] = [
  {
    id: "1",
    initial: "E",
    name: "EVENTO Lead Coordinator",
    role: "Managed Event OS • #BKG-2026-001",
    preview: "Your wedding timeline & catering menu are locked in. Let us know if you need add-ons!",
    time: "10:27 AM",
    unread: 1,
    online: true,
    color: "bg-[#4F46E5]",
    messages: [
      {
        id: 1,
        sender: "EVENTO Lead Coordinator",
        text: "Hello! We have confirmed the Gulshan Club venue and catering menu for your Royal Wedding Ceremony.",
        time: "10:24 AM",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Thank you! Everything looks perfect on my event checklist.",
        time: "10:26 AM",
        isMe: true,
      },
      {
        id: 3,
        sender: "EVENTO Lead Coordinator",
        text: "Your wedding timeline & catering menu are locked in. Let us know if you need add-ons!",
        time: "10:27 AM",
        isMe: false,
      },
    ],
  },
  {
    id: "2",
    initial: "D",
    name: "EVENTO Dispatch Desk",
    role: "Partner Coordination • Internal",
    preview: "Stage sound check at Radisson Blu is scheduled for 2:00 PM.",
    time: "2h ago",
    unread: 0,
    online: true,
    color: "bg-[#2563EB]",
    messages: [
      {
        id: 1,
        sender: "You",
        text: "Hi Dispatch Desk, what time is the sound check at Radisson Blu?",
        time: "8:00 AM",
        isMe: true,
      },
      {
        id: 2,
        sender: "EVENTO Dispatch Desk",
        text: "Stage sound check at Radisson Blu is scheduled for 2:00 PM.",
        time: "8:15 AM",
        isMe: false,
      },
    ],
  },
  {
    id: "3",
    initial: "F",
    name: "EVENTO Finance & Escrow Desk",
    role: "Payment & BDT Payout Support",
    preview: "Advance payment of ৳ 100,000 has been verified. Receipt attached.",
    time: "Yesterday",
    unread: 0,
    online: false,
    color: "bg-[#9333EA]",
    messages: [
      {
        id: 1,
        sender: "EVENTO Finance & Escrow Desk",
        text: "Advance payment of ৳ 100,000 has been verified. Receipt attached.",
        time: "Yesterday 4:30 PM",
        isMe: false,
      },
      {
        id: 2,
        sender: "You",
        text: "Received, thank you! Escrow status updated.",
        time: "Yesterday 4:35 PM",
        isMe: true,
      },
    ],
  },
  {
    id: "4",
    initial: "V",
    name: "EVENTO VIP Support Desk",
    role: "24/7 Bangladesh Concierge",
    preview: "Welcome to EVENTO Bangladesh! Let us know how we can assist your celebration.",
    time: "2d ago",
    unread: 0,
    online: true,
    color: "bg-[#0EA5E9]",
    messages: [
      {
        id: 1,
        sender: "EVENTO VIP Support Desk",
        text: "Welcome to EVENTO Bangladesh! Let us know how we can assist your celebration.",
        time: "2d ago",
        isMe: false,
      },
    ],
  },
  {
    id: "5",
    initial: "P",
    name: "Dhaka Royal Photography Studio",
    role: "Assigned Vendor Partner • #BKG-2026-001",
    preview: "Our Senior Photographers will arrive at Gulshan Club at 4:00 PM.",
    time: "3h ago",
    unread: 1,
    online: true,
    color: "bg-[#9333EA]",
    messages: [
      {
        id: 1,
        sender: "Dhaka Royal Photography Studio",
        text: "Assigned to booking #BKG-2026-001. Our Senior Photographers will arrive at Gulshan Club at 4:00 PM.",
        time: "3h ago",
        isMe: false,
      },
    ],
  },
  {
    id: "6",
    initial: "S",
    name: "Chattogram Stage & Sound Systems",
    role: "Assigned Vendor Partner • #BKG-2026-002",
    preview: "Sound equipment delivery confirmed for 2:00 PM.",
    time: "5h ago",
    unread: 0,
    online: true,
    color: "bg-[#BE185D]",
    messages: [
      {
        id: 1,
        sender: "Chattogram Stage & Sound Systems",
        text: "Sound equipment delivery confirmed for 2:00 PM.",
        time: "5h ago",
        isMe: false,
      },
    ],
  },
];

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// A hairline gradient "thread" — the one recurring signature motif that
// stitches every panel together, echoing the site's blue → violet identity.
function GradientThread({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-px w-full bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent ${className}`}
    />
  );
}

// Soft corner flourish for the hero banner — abstract concentric arcs
// in the accent hue, kept intentionally quiet (low opacity, single tone).
function CornerMotif() {
  return (
    <svg
      className="absolute -right-6 -top-10 w-56 h-56 text-[#A855F7]/10 pointer-events-none"
      viewBox="0 0 200 200"
      fill="none"
    >
      <circle cx="180" cy="20" r="40" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="20" r="70" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="20" r="100" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="180" cy="20" r="130" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isMounted, setIsMounted] = useState(false);

  const [activeContactId, setActiveContactId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  // Emoji picker modal
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // New Chat Modal
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatName, setNewChatName] = useState("");
  const [newChatRole, setNewChatRole] = useState("Vendor Coordinator");
  const [newChatInitialMsg, setNewChatInitialMsg] = useState("");

  // Mobile: toggle between the inbox list and the active thread
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [showChatOptions, setShowChatOptions] = useState(false);
  const [pendingDeleteContactId, setPendingDeleteContactId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load from localStorage after component mounts on client
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard_messages_v3");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const existingIds = new Set(parsed.map((c: any) => c.id));
            const missing = initialContacts.filter((c) => !existingIds.has(c.id));
            const merged = [...parsed, ...missing];
            setContacts(merged);
            return;
          }
        } catch (e) {
          console.error("Failed to parse saved messages", e);
        }
      }
    }
    setContacts(initialContacts);
  }, []);

  // Sync contacts state with localStorage
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("dashboard_messages_v3", JSON.stringify(contacts));
    }
  }, [contacts, isMounted]);

  // Auto scroll on active thread change or message update
  useEffect(() => {
    scrollToBottom();
  }, [contacts, activeContactId]);

  const activeContact =
    contacts.find((c) => c.id === activeContactId) || contacts[0] || null;

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setMobileShowThread(true);
    setShowChatOptions(false);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const handleDeleteChat = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
    if (activeContactId === id) {
      setMobileShowThread(false);
    }
    setPendingDeleteContactId(null);
    setShowChatOptions(false);
    toast.success("Conversation deleted.");
  };

  const handleDownloadFile = (fileName: string, fileUrl?: string) => {
    try {
      const link = document.createElement("a");
      if (fileUrl) {
        link.href = fileUrl;
      } else {
        const ext = fileName.split(".").pop()?.toLowerCase();
        if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext || "")) {
          link.href =
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        } else {
          const blob = new Blob([`Content of ${fileName}`], {
            type: "text/plain",
          });
          link.href = URL.createObjectURL(blob);
        }
      }
      link.download = fileName || "attachment.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Started download for ${fileName}`);
    } catch (err) {
      console.error(err);
      toast.error("Download failed");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(`"${file.name}" is over the 10 MB attachment limit.`);
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const attachmentMsg: Message = {
        id: Date.now(),
        sender: "You",
        text: `📎 Attached file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: true,
        fileUrl: dataUrl,
      };

      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeContactId) {
            return {
              ...c,
              preview: `📎 ${file.name}`,
              time: "Just Now",
              messages: [...c.messages, attachmentMsg],
            };
          }
          return c;
        })
      );

      toast.success(`Attached ${file.name}!`);
    };

    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeContact) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "You",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    const updatedText = inputMessage.trim();
    setInputMessage("");
    setShowEmojiPicker(false);

    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === activeContactId) {
          return {
            ...c,
            preview: updatedText,
            time: "Just Now",
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    // Dynamic Intelligent Auto-Reply
    setTimeout(() => {
      const replies = [
        "Got it! EVENTO Operations team will process this right away.",
        "Thank you! Your event details & schedule are locked in.",
        "Understood. We have notified our vendor leads.",
        "Awesome! I've updated the status in Managed Event OS.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const autoReply: Message = {
        id: Date.now() + 1,
        sender: activeContact.name,
        text: randomReply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
      };

      setContacts((prev) =>
        prev.map((c) => {
          if (c.id === activeContactId) {
            return {
              ...c,
              preview: randomReply,
              time: "Just Now",
              messages: [...c.messages, autoReply],
            };
          }
          return c;
        })
      );

      toast.info(`New message from ${activeContact.name}`);
    }, 1200);
  };

  const handleCreateNewChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatName.trim()) return;

    const randomColor =
      AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    const newId = String(Date.now());

    const newContact: Contact = {
      id: newId,
      initial: newChatName.trim()[0].toUpperCase(),
      name: newChatName.trim(),
      role: newChatRole,
      preview: newChatInitialMsg || "Conversation started.",
      time: "Just Now",
      unread: 0,
      online: true,
      color: randomColor,
      messages: [
        {
          id: 1,
          sender: newChatName.trim(),
          text: newChatInitialMsg || `Hello! Dedicated channel for ${newChatName.trim()} is open.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isMe: false,
        },
      ],
    };

    setContacts((prev) => [newContact, ...prev]);
    setActiveContactId(newId);
    setMobileShowThread(true);
    setNewChatName("");
    setNewChatInitialMsg("");
    setShowNewChatModal(false);
    toast.success(`Started new chat with ${newChatName.trim()}`);
  };

  const insertEmoji = (emoji: string) => {
    setInputMessage((prev) => prev + emoji);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  const vendorThreadCount = contacts.filter((c) => c.role.toLowerCase().includes("vendor")).length;
  const onlineCount = contacts.filter((c) => c.online).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans-evento text-[#171532]">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap");
        .font-sans-evento {
          font-family: "Inter", ui-sans-serif, system-ui, sans-serif;
        }
        .font-display-evento {
          font-family: "Sora", ui-sans-serif, system-ui, sans-serif;
        }
      `}</style>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[28px] p-6 sm:p-9 text-white shadow-lg border border-[#A855F7]/25 bg-gradient-to-br from-[#1E3A8A] via-[#4F46E5] to-[#7C3AED]">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C084FC] to-transparent" />
        <CornerMotif />
        <div className="absolute -left-20 bottom-0 w-52 h-52 rounded-full bg-[#DB2777]/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] text-[#DDD6FE] border border-[#A855F7]/40 bg-[#A855F7]/10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C084FC]" />
              EVENTO Real-Time Desk
            </span>
            <h1 className="font-display-evento text-2xl sm:text-[32px] font-semibold mt-3 tracking-tight text-[#F7F5FF]">
              Communication &amp; Dispatch Hub
            </h1>
            <p className="text-xs sm:text-sm text-[#D6D3FA]/75 mt-2 max-w-2xl leading-relaxed">
              Direct thread coordination with customers, lead planners, vendor teams, and the finance escrow desk.
            </p>
          </div>
          <div className="flex items-center gap-3 relative z-10 shrink-0">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-5 py-2.5 bg-white text-[#4338CA] hover:bg-[#F5F3FF] text-xs font-bold uppercase tracking-wide rounded-full shadow-md transition-colors flex items-center gap-2 shrink-0"
            >
              <UserPlus className="w-4 h-4" /> Start New Conversation
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-[#E4E1FA] shadow-sm p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C7A99]">Active Threads</p>
          <p className="font-display-evento text-[28px] font-semibold text-[#4F46E5] mt-1">{contacts.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E4E1FA] shadow-sm p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C7A99]">Unread</p>
          <p className="font-display-evento text-[28px] font-semibold text-[#4F46E5] mt-1">{totalUnread}</p>
          {totalUnread > 0 && <p className="text-[10px] text-[#DB2777] font-bold mt-0.5">needs a reply</p>}
        </div>
        <div className="bg-white rounded-2xl border border-[#E4E1FA] shadow-sm p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C7A99]">Online Now</p>
          <p className="font-display-evento text-[28px] font-semibold text-[#4F46E5] mt-1">{onlineCount}</p>
          <p className="text-[10px] text-[#1F7A55] font-bold mt-0.5">of {contacts.length} contacts</p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E4E1FA] shadow-sm p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#7C7A99]">Vendor Threads</p>
          <p className="font-display-evento text-[28px] font-semibold text-[#4F46E5] mt-1">{vendorThreadCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Contact List / Inbox */}
        <div
          className={`bg-white rounded-2xl border border-[#E4E1FA] shadow-sm overflow-hidden flex-col h-[620px] ${
            mobileShowThread ? "hidden lg:flex" : "flex"
          }`}
        >
          {/* Search Header */}
          <div className="p-4 border-b border-[#EDEBFB] space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="font-display-evento text-sm font-semibold text-[#4F46E5] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#4F46E5]" /> Active Inbox
              </h2>
              {totalUnread > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DB2777]/10 text-[#DB2777]">
                  {totalUnread} New
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-[#9C99C2] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats by name or role..."
                className="w-full pl-9 pr-3 py-2 bg-[#F7F5FF] border border-[#E4E1FA] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#A855F7] focus:bg-white text-[#171532] transition-all font-medium"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="divide-y divide-[#EDEBFB] overflow-y-auto flex-1">
            {filteredContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-16 px-6">
                <div className="p-3 rounded-xl bg-[#F7F5FF] text-[#C9C6E8] mb-3">
                  <Inbox className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-[#211E3D]">
                  {contacts.length === 0 ? "No conversations yet" : "No matches"}
                </p>
                <p className="text-[11px] text-[#7C7A99] mt-1 max-w-[220px]">
                  {contacts.length === 0
                    ? "Start a new conversation to reach customers, vendors, or the finance desk."
                    : `Nothing matches "${searchQuery}".`}
                </p>
              </div>
            )}
            {filteredContacts.map((c) => {
              const isActive = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectContact(c.id)}
                  className={`group p-4 flex items-start gap-3 cursor-pointer transition-all ${
                    isActive
                      ? "bg-[#EDE9FE] border-l-4 border-[#A855F7]"
                      : "hover:bg-[#F7F5FF] border-l-4 border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${c.color} text-white font-bold text-sm flex items-center justify-center shadow-sm font-display-evento`}
                    >
                      {c.initial}
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#1F7A55] border-2 border-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`text-xs font-bold truncate ${isActive ? "text-[#4F46E5]" : "text-[#211E3D]"}`}
                      >
                        {c.name}
                      </h3>
                      <span className="text-[10px] text-[#9C99C2] font-medium shrink-0">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#6B6890] truncate mt-0.5 font-medium">
                      {c.preview}
                    </p>
                  </div>

                  {c.unread > 0 && (
                    <span className="w-4 h-4 rounded-full text-[9px] font-bold text-white bg-[#DB2777] flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPendingDeleteContactId(c.id);
                    }}
                    title="Delete conversation"
                    className="shrink-0 p-1 rounded text-[#C9C6E8] opacity-0 group-hover:opacity-100 hover:text-[#DB2777] hover:bg-[#DB2777]/10 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Conversation Panel */}
        <div
          className={`lg:col-span-2 bg-white rounded-2xl border border-[#E4E1FA] shadow-sm flex-col h-[620px] overflow-hidden ${
            mobileShowThread ? "flex" : "hidden lg:flex"
          }`}
        >
          {!activeContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="p-3 rounded-xl bg-[#F7F5FF] text-[#C9C6E8] mb-3">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#211E3D]">No conversation selected</p>
              <p className="text-[11px] text-[#7C7A99] mt-1 max-w-[220px]">
                Start a new conversation from the inbox to see it here.
              </p>
            </div>
          ) : (
            <>
          {/* Chat Header */}
          <div className="p-4 border-b border-[#EDEBFB] flex justify-between items-center shrink-0 bg-white relative">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileShowThread(false)}
                className="lg:hidden shrink-0 p-1.5 -ml-1.5 text-[#6B6890] hover:text-[#4F46E5] hover:bg-[#F7F5FF] rounded-lg transition-colors"
                title="Back to inbox"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div
                className={`w-10 h-10 rounded-xl ${activeContact.color} text-white font-bold text-sm flex items-center justify-center shadow-sm shrink-0 font-display-evento`}
              >
                {activeContact.initial}
              </div>
              <div className="min-w-0">
                <h2 className="font-display-evento text-sm font-semibold text-[#4F46E5] truncate">
                  {activeContact.name}
                </h2>
                <p className="text-[10px] font-semibold text-[#6B6890] flex items-center gap-1.5 mt-0.5 truncate">
                  {activeContact.online ? (
                    <span className="text-[#1F7A55] font-bold flex items-center gap-1 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#1F7A55] inline-block animate-pulse" />{" "}
                      Online
                    </span>
                  ) : (
                    <span className="text-[#9C99C2] shrink-0">Offline</span>
                  )}{" "}
                  <span className="truncate">• {activeContact.role}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => toast.info(`Initiating secure audio call with ${activeContact.name}...`)}
                className="p-2 text-[#6B6890] hover:text-[#4F46E5] hover:bg-[#F7F5FF] rounded-lg transition-colors"
                title="Call Desk"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowChatOptions((v) => !v)}
                className="p-2 text-[#6B6890] hover:text-[#4F46E5] hover:bg-[#F7F5FF] rounded-lg transition-colors"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {showChatOptions && (
                <>
                  <div
                    className="fixed inset-0 z-[5]"
                    onClick={() => setShowChatOptions(false)}
                  />
                  <div className="absolute right-4 top-14 z-10 bg-white border border-[#E4E1FA] rounded-xl shadow-lg py-1.5 w-44 text-xs">
                    <button
                      onClick={() => {
                        setShowChatOptions(false);
                        setPendingDeleteContactId(activeContact.id);
                      }}
                      className="w-full text-left px-3.5 py-2 text-[#DB2777] hover:bg-[#DB2777]/5 font-semibold flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete conversation
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F7F5FF]/60">
            {activeContact.messages.map((msg) => {
              const isAttachment = msg.text.startsWith("📎 Attached file:");
              let fileName = "";
              let fileSize = "";
              if (isAttachment) {
                const match = msg.text.match(
                  /📎 Attached file:\s*(.*?)\s*\((.*?)\)/
                );
                if (match) {
                  fileName = match[1];
                  fileSize = match[2];
                }
              }

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col max-w-[80%] ${
                    msg.isMe ? "ml-auto items-end" : "mr-auto items-start"
                  }`}
                >
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.isMe
                        ? "bg-[#4F46E5] text-[#F7F5FF] rounded-br-none"
                        : "bg-white text-[#171532] border border-[#E4E1FA] rounded-bl-none"
                    }`}
                  >
                    {isAttachment ? (
                      <div className="space-y-2">
                        {msg.fileUrl &&
                          (fileName.endsWith(".png") ||
                            fileName.endsWith(".jpg") ||
                            fileName.endsWith(".jpeg") ||
                            fileName.endsWith(".webp") ||
                            fileName.endsWith(".gif")) && (
                            <div className="rounded-xl overflow-hidden max-h-48 border border-[#A855F7]/20 bg-black/40">
                              <img
                                src={msg.fileUrl}
                                alt={fileName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        <div className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-[#A855F7]/20">
                          <div className="p-2.5 bg-white/10 text-[#DDD6FE] rounded-lg shrink-0">
                            <Paperclip className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs truncate text-[#F7F5FF]">
                              {fileName || "Attachment"}
                            </p>
                            <p className="text-[10px] text-[#D6D3FA]/70 font-medium">
                              {fileSize || "File Attachment"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadFile(fileName, msg.fileUrl)
                            }
                            className="px-2.5 py-1 bg-[#A855F7] hover:bg-[#C084FC] text-[#4F46E5] rounded-md text-[10px] font-bold transition-colors shrink-0"
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1">
                    <span className="text-[9px] text-[#9C99C2] font-medium">
                      {msg.time}
                    </span>
                    {msg.isMe && (
                      <CheckCheck className="w-3 h-3 text-[#9C99C2]" />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Quick Picker Popup */}
          {showEmojiPicker && (
            <div className="p-2 bg-white border-t border-[#EDEBFB] flex items-center gap-2 justify-center shadow-inner">
              {["👍", "😊", "🎉", "📅", "৳", "✅", "❤️", "📍"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1.5 hover:bg-[#F7F5FF] rounded-lg text-base transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-[#EDEBFB] bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-[#9C99C2] hover:text-[#4F46E5] hover:bg-[#F7F5FF] rounded-lg transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2.5 bg-[#F7F5FF] border border-[#E4E1FA] rounded-xl text-xs text-[#171532] outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#A855F7] focus:bg-white transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-[#9C99C2] hover:text-[#4F46E5] hover:bg-[#F7F5FF] rounded-lg transition-colors"
              title="Emoji Quick Picker"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-4 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-[#C9C6E8] disabled:cursor-not-allowed text-[#F7F5FF] text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
            </>
          )}
        </div>
      </div>

      {/* Start New Conversation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181441]/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-[#E4E1FA]">
            <GradientThread />
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EDEBFB]">
              <h3 className="font-display-evento text-base font-semibold text-[#4F46E5]">Start New Conversation</h3>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-[#9C99C2] hover:text-[#211E3D] hover:bg-[#F7F5FF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewChat} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#211E3D]">Contact / Channel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Photography Lead"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#D5D0F5] rounded-lg text-sm text-[#171532] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#A855F7] font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#211E3D]">Role / Context</label>
                <select
                  value={newChatRole}
                  onChange={(e) => setNewChatRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#D5D0F5] rounded-lg text-xs font-semibold text-[#171532] outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#A855F7]"
                >
                  <option value="Vendor Coordinator">Vendor Coordinator</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Finance & Escrow Desk">Finance &amp; Escrow Desk</option>
                  <option value="Event Lead Planner">Event Lead Planner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#211E3D]">Initial Message</label>
                <textarea
                  rows={3}
                  placeholder="Type initial message to open channel..."
                  value={newChatInitialMsg}
                  onChange={(e) => setNewChatInitialMsg(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-[#D5D0F5] rounded-lg text-xs text-[#171532] focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/30 focus:border-[#A855F7] leading-relaxed font-medium"
                />
              </div>

              <div className="pt-3 border-t border-[#EDEBFB] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B6890] hover:text-[#4F46E5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#4F46E5] hover:bg-[#4338CA] text-[#F7F5FF] text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Conversation Confirmation Modal */}
      {pendingDeleteContactId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181441]/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-[#E4E1FA] overflow-hidden">
            <GradientThread />
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#DB2777]/10 text-[#DB2777] shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display-evento text-sm font-semibold text-[#4F46E5]">Delete this conversation?</h3>
                  <p className="text-xs text-[#6B6890] mt-0.5">
                    All messages in this thread will be removed from your inbox. This can&rsquo;t be undone.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-[#EDEBFB]">
                <button
                  onClick={() => setPendingDeleteContactId(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B6890] hover:text-[#4F46E5]"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteChat(pendingDeleteContactId)}
                  className="px-4 py-2 bg-[#DB2777] hover:bg-[#BE185D] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
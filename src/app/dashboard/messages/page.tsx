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
  PlusCircle,
  X,
  UserPlus,
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
    color: "bg-purple-600",
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
    color: "bg-indigo-600",
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
    color: "bg-emerald-600",
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
    color: "bg-blue-600",
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
    color: "bg-amber-600",
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
    color: "bg-rose-600",
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
    contacts.find((c) => c.id === activeContactId) || contacts[0];

  const handleSelectContact = (id: string) => {
    setActiveContactId(id);
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
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
    if (!inputMessage.trim()) return;

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

    const colors = ["bg-purple-600", "bg-emerald-600", "bg-blue-600", "bg-indigo-600", "bg-rose-600"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-200 border border-purple-400/20">
            EVENTO Real-Time Desk
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">
            Communication &amp; Dispatch Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Direct thread coordination with customers, lead planners, vendor teams, and finance escrow desk.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewChatModal(true)}
            className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0"
          >
            <UserPlus className="w-4 h-4 text-purple-700" /> Start New Conversation
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Contact List / Inbox */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[620px]">
          {/* Search Header */}
          <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-700" /> Active Inbox
              </h2>
              {totalUnread > 0 && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {totalUnread} New
                </span>
              )}
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats by name or role..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all font-medium"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="divide-y divide-slate-100 overflow-y-auto flex-1">
            {filteredContacts.map((c) => {
              const isActive = c.id === activeContactId;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectContact(c.id)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-all ${
                    isActive
                      ? "bg-slate-100/90 border-l-4 border-slate-900"
                      : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div
                      className={`w-10 h-10 rounded-xl ${c.color} text-white font-bold text-sm flex items-center justify-center shadow-sm`}
                    >
                      {c.initial}
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <h3
                        className={`text-xs font-bold truncate ${isActive ? "text-slate-900" : "text-slate-700"}`}
                      >
                        {c.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {c.time}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">
                      {c.preview}
                    </p>
                  </div>

                  {c.unread > 0 && (
                    <span className="w-4 h-4 rounded-full text-[9px] font-bold text-white bg-purple-600 flex items-center justify-center shrink-0">
                      {c.unread}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Chat Conversation Panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[620px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl ${activeContact.color} text-white font-bold text-sm flex items-center justify-center shadow-sm`}
              >
                {activeContact.initial}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  {activeContact.name}
                </h2>
                <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                  {activeContact.online ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />{" "}
                      Online
                    </span>
                  ) : (
                    <span className="text-slate-400">Offline</span>
                  )}{" "}
                  • {activeContact.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => toast.info(`Initiating secure audio call with ${activeContact.name}...`)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Call Desk"
              >
                <Phone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
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
                        ? "bg-slate-900 text-white rounded-br-none"
                        : "bg-white text-slate-900 border border-slate-200 rounded-bl-none"
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
                            <div className="rounded-xl overflow-hidden max-h-48 border border-slate-700/50 bg-black/40">
                              <img
                                src={msg.fileUrl}
                                alt={fileName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                          <div className="p-2.5 bg-slate-700 text-purple-300 rounded-lg shrink-0">
                            <Paperclip className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs truncate text-slate-100">
                              {fileName || "Attachment"}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {fileSize || "File Attachment"}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleDownloadFile(fileName, msg.fileUrl)
                            }
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-[10px] font-bold transition-colors shrink-0"
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
                    <span className="text-[9px] text-slate-400 font-medium">
                      {msg.time}
                    </span>
                    {msg.isMe && (
                      <CheckCheck className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Emoji Quick Picker Popup */}
          {showEmojiPicker && (
            <div className="p-2 bg-white border-t border-slate-200 flex items-center gap-2 justify-center shadow-inner">
              {["👍", "😊", "🎉", "📅", "৳", "✅", "❤️", "📍"].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-1.5 hover:bg-slate-100 rounded-lg text-base transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0"
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
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all font-medium"
            />
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Emoji Quick Picker"
            >
              <Smile className="w-4 h-4" />
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              Send <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Start New Conversation Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Start New Conversation</h3>
              <button
                type="button"
                onClick={() => setShowNewChatModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewChat} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Contact / Channel Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dhaka Photography Lead"
                  value={newChatName}
                  onChange={(e) => setNewChatName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Role / Context</label>
                <select
                  value={newChatRole}
                  onChange={(e) => setNewChatRole(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-900 outline-none"
                >
                  <option value="Vendor Coordinator">Vendor Coordinator</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Finance & Escrow Desk">Finance &amp; Escrow Desk</option>
                  <option value="Event Lead Planner">Event Lead Planner</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Initial Message</label>
                <textarea
                  rows={3}
                  placeholder="Type initial message to open channel..."
                  value={newChatInitialMsg}
                  onChange={(e) => setNewChatInitialMsg(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 leading-relaxed font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewChatModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Start Conversation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

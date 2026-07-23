"use client";

import { useState, useRef, useEffect } from "react";
import { Search, MessageSquare, Send, Paperclip, Smile, Phone, MoreVertical, CheckCheck } from "lucide-react";
import { toast } from "sonner";

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
    initial: "S",
    name: "Sarah Jenkins",
    role: "Client • Annual Gala",
    preview: "Perfect! Can you update the timeline on the dashboard?",
    time: "10:27 AM",
    unread: 1,
    online: true,
    color: "bg-purple-600",
    messages: [
      { id: 1, sender: "Sarah Jenkins", text: "Hey! Just wanted to check if the floral team is confirmed for the Corporate Gala?", time: "10:24 AM", isMe: false },
      { id: 2, sender: "You", text: "Hi Sarah! Yes, the premium orchid layout has been locked in and paid.", time: "10:26 AM", isMe: true },
      { id: 3, sender: "Sarah Jenkins", text: "Perfect! Can you update the timeline on the dashboard?", time: "10:27 AM", isMe: false },
    ],
  },
  {
    id: "2",
    initial: "T",
    name: "Thomas K.",
    role: "Florals Partner",
    preview: "The orchids are loaded. Ready for transit!",
    time: "2h ago",
    unread: 0,
    online: false,
    color: "bg-blue-600",
    messages: [
      { id: 1, sender: "You", text: "Hi Thomas, are the floral centerpieces ready for dispatch?", time: "8:00 AM", isMe: true },
      { id: 2, sender: "Thomas K.", text: "The orchids are loaded. Ready for transit!", time: "8:15 AM", isMe: false },
    ],
  },
  {
    id: "3",
    initial: "A",
    name: "Alex Mercer",
    role: "Audio/Visual Tech",
    preview: "Confirming sound system checklist coordinates.",
    time: "Yesterday",
    unread: 0,
    online: false,
    color: "bg-pink-600",
    messages: [
      { id: 1, sender: "Alex Mercer", text: "Confirming sound system checklist coordinates.", time: "Yesterday 4:30 PM", isMe: false },
      { id: 2, sender: "You", text: "Received, thanks Alex! Everything is set on venue floor B.", time: "Yesterday 4:35 PM", isMe: true },
    ],
  },
  {
    id: "4",
    initial: "R",
    name: "Rahim",
    role: "Catering Lead",
    preview: "Menu confirmed. Allergen sheet attached.",
    time: "2d ago",
    unread: 0,
    online: true,
    color: "bg-emerald-600",
    messages: [
      { id: 1, sender: "Rahim", text: "Menu confirmed. Allergen sheet attached.", time: "2d ago", isMe: false },
    ],
  },
];

export default function MessagesPage() {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [isMounted, setIsMounted] = useState(false);

  const [activeContactId, setActiveContactId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load from localStorage after component mounts on client to avoid SSR hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("dashboard_messages_v2");
      if (saved) {
        try {
          setContacts(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved messages", e);
        }
      }
    }
  }, []);

  // Sync contacts state with localStorage whenever contacts change (only after initial mount)
  useEffect(() => {
    if (isMounted && typeof window !== "undefined") {
      localStorage.setItem("dashboard_messages_v2", JSON.stringify(contacts));
    }
  }, [contacts, isMounted]);

  // Optionally fetch conversations from API if available
  useEffect(() => {
    const syncWithAPI = async () => {
      try {
        const response = await apiClient.get("/communications/conversations");
        if (response.data?.success && Array.isArray(response.data?.data) && response.data.data.length > 0) {
          // If server returns real conversation threads, map them into contacts state
        }
      } catch (err) {
        // Silently fallback to persistent state
      }
    };
    syncWithAPI();
  }, []);

  const activeContact = contacts.find((c) => c.id === activeContactId) || contacts[0];

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
          // Valid 1x1 transparent PNG Data URL to prevent image viewer corruption errors
          link.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        } else {
          const blob = new Blob([`Content of ${fileName}`], { type: "text/plain" });
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
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

    try {
      await apiClient.post("/communications/messages", {
        conversationId: activeContactId,
        message: `📎 Attached file: ${file.name}`,
        messageType: "ATTACHMENT",
      });
    } catch (err) {
      // Handled via persistent local fallback
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: Date.now(),
      sender: "You",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    const updatedText = inputMessage.trim();
    setInputMessage("");

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

    // Call API endpoint
    try {
      await apiClient.post("/communications/messages", {
        conversationId: activeContactId,
        message: updatedText,
        messageType: "TEXT",
      });
    } catch (err) {
      // Handled via persistent local fallback
    }

    // Auto-reply
    setTimeout(() => {
      const replies = [
        "Got it! I will process this immediately.",
        "Thanks for the update, team!",
        "Understood. Will confirm once completed.",
        "Awesome! I have noted this down.",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const autoReply: Message = {
        id: Date.now() + 1,
        sender: activeContact.name,
        text: randomReply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    }, 1500);
  };

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = contacts.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Communication Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Interact with clients, event admins, and vendors in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 font-semibold text-xs rounded-full border border-slate-200">
            {totalUnread} Unread Messages
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Contact List / Inbox */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px]">
          {/* Search Header */}
          <div className="p-4 border-b border-slate-100 space-y-3 shrink-0">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-700" /> Inbox
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
                placeholder="Search chats..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white text-slate-900 transition-all"
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
                    isActive ? "bg-slate-100/80 border-l-4 border-slate-900" : "hover:bg-slate-50 border-l-4 border-transparent"
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className={`w-10 h-10 rounded-full ${c.color} text-white font-bold text-sm flex items-center justify-center shadow-sm`}>
                      {c.initial}
                    </div>
                    {c.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className={`text-xs font-bold truncate ${isActive ? "text-slate-900" : "text-slate-700"}`}>
                        {c.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">{c.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5 font-medium">{c.preview}</p>
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
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex justify-between items-center shrink-0 bg-white">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${activeContact.color} text-white font-bold text-sm flex items-center justify-center shadow-sm`}>
                {activeContact.initial}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{activeContact.name}</h2>
                <p className="text-[10px] font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                  {activeContact.online ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> Online
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
                onClick={() => toast.info(`Calling ${activeContact.name}...`)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
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
                const match = msg.text.match(/📎 Attached file:\s*(.*?)\s*\((.*?)\)/);
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
                        {/* Inline Image Preview if available */}
                        {msg.fileUrl && (fileName.endsWith(".png") || fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".webp") || fileName.endsWith(".gif")) && (
                          <div className="rounded-xl overflow-hidden max-h-48 border border-slate-700/50 bg-black/40">
                            <img src={msg.fileUrl} alt={fileName} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-3 p-2 bg-slate-800/60 rounded-xl border border-slate-700/50">
                          <div className="p-2.5 bg-slate-700 text-purple-300 rounded-lg shrink-0">
                            <Paperclip className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-bold text-xs truncate text-slate-100">{fileName || "Attachment"}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{fileSize || "File Attachment"}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDownloadFile(fileName, msg.fileUrl)}
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
                    <span className="text-[9px] text-slate-400 font-medium">{msg.time}</span>
                    {msg.isMe && <CheckCheck className="w-3 h-3 text-slate-400" />}
                  </div>
                </div>
              );
            })}
          </div>

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
              onClick={() => toast.info("Emoji picker ready!")}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
    </div>
  );
}

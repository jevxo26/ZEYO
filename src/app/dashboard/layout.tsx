"use client";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import {
  Bell,
  Mail,
  Search,
  ShieldCheck,
  Briefcase,
  User as UserIcon,
  MessageSquare,
} from "lucide-react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/store/store";
import { useRouter } from "next/navigation";
import Modals from "@/components/dashboard/Modals";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
// ─── Static notification data ────────────────────────────────────────────────
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    icon: "📦",
    title: "Booking Confirmed",
    desc: "Your Royal Wedding Ceremony booking #BKG-2026-001 has been confirmed.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    icon: "💬",
    title: "New Message",
    desc: "EVENTO Lead Coordinator sent you a message about your event timeline.",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    icon: "💳",
    title: "Payment Received",
    desc: "Advance payment of ৳100,000 verified and added to escrow.",
    time: "1 hr ago",
    read: true,
  },
  {
    id: 4,
    icon: "⚠️",
    title: "Vendor Assigned",
    desc: "Dhaka Royal Photography Studio has been assigned to your event.",
    time: "3 hrs ago",
    read: true,
  },
];

// ─── Static inbox previews ───────────────────────────────────────────────────
const INBOX_PREVIEWS = [
  {
    id: "1",
    initial: "E",
    color: "bg-purple-600",
    name: "EVENTO Lead Coordinator",
    preview: "Your wedding timeline & catering menu are locked in!",
    time: "10:27 AM",
    unread: 1,
    online: true,
  },
  {
    id: "2",
    initial: "D",
    color: "bg-indigo-600",
    name: "EVENTO Dispatch Desk",
    preview: "Stage sound check at Radisson Blu is at 2:00 PM.",
    time: "2h ago",
    unread: 0,
    online: true,
  },
  {
    id: "3",
    initial: "F",
    color: "bg-emerald-600",
    name: "Finance & Escrow Desk",
    preview: "Advance ৳100,000 verified. Receipt attached.",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: "5",
    initial: "P",
    color: "bg-amber-600",
    name: "Dhaka Royal Photography",
    preview: "Photographers will arrive at 4:00 PM.",
    time: "3h ago",
    unread: 1,
    online: true,
  },
];

// ─── Global search data ──────────────────────────────────────────────────────
const SEARCH_DATA = [
  // Bookings
  { type: 'booking', label: 'Royal Wedding Ceremony', sub: '#BKG-2026-001 • Gulshan Club', href: '/dashboard/bookings/BKG-2026-001', icon: '📦' },
  { type: 'booking', label: 'Gaye Holud Night Celebration', sub: '#BKG-2026-002 • Banani Convention Hall', href: '/dashboard/bookings/BKG-2026-002', icon: '📦' },
  { type: 'booking', label: 'Corporate Annual Summit', sub: '#BKG-2026-003 • Radisson Blu', href: '/dashboard/bookings/BKG-2026-003', icon: '📦' },
  // Pages
  { type: 'page', label: 'My Bookings', sub: 'View all your event bookings', href: '/dashboard/bookings', icon: '🗂️' },
  { type: 'page', label: 'Messages', sub: 'Open messaging hub', href: '/dashboard/messages', icon: '💬' },
  { type: 'page', label: 'My Events', sub: 'View all your events', href: '/dashboard/my-events', icon: '📅' },
  { type: 'page', label: 'Settings', sub: 'Account & notification settings', href: '/dashboard/settings', icon: '⚙️' },
  { type: 'page', label: 'Task Board', sub: 'Vendor task execution workspace', href: '/dashboard/tasks', icon: '✅' },
  { type: 'page', label: 'Earnings', sub: 'View payout & escrow history', href: '/dashboard/earnings', icon: '💰' },
  // Actions
  { type: 'action', label: 'Smart Calculator', sub: 'Estimate event budget by zone', href: '/calculator', icon: '🧮' },
  { type: 'action', label: 'Browse Packages', sub: 'Explore ready-made event packages', href: '/packages', icon: '🎁' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // ── Bell state ───────────────────────────────────────────────────────────────
  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  // ── Mail state ───────────────────────────────────────────────────────────────
  const [showMail, setShowMail] = useState(false);
  const [inbox, setInbox] = useState<any[]>([]);
  const mailRef = useRef<HTMLDivElement>(null);

  // ── Search state ─────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searchResults = searchQuery.trim().length > 0
    ? SEARCH_DATA.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.sub.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearchNavigate = useCallback((href: string) => {
    router.push(href);
    setSearchQuery('');
    setSearchOpen(false);
    setHighlightedIndex(-1);
  }, [router]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: '#7c3aed', fontWeight: 700 }}>{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchOpen) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, searchResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
        handleSearchNavigate(searchResults[highlightedIndex].href);
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false);
      setHighlightedIndex(-1);
    }
  };

  const typeBadgeStyle: Record<string, React.CSSProperties> = {
    booking: { background: '#ede9fe', color: '#6d28d9', border: '1px solid #c4b5fd', fontWeight: 700, fontSize: 9, padding: '1px 7px', borderRadius: 999 },
    page:    { background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', fontWeight: 700, fontSize: 9, padding: '1px 7px', borderRadius: 999 },
    action:  { background: '#e0e7ff', color: '#3730a3', border: '1px solid #a5b4fc', fontWeight: 700, fontSize: 9, padding: '1px 7px', borderRadius: 999 },
  };

  // ── Close on outside click ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotif(false);
      }
      if (mailRef.current && !mailRef.current.contains(e.target as Node)) {
        setShowMail(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Global Ctrl+K / Cmd+K shortcut ───────────────────────────────────────────
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleGlobalKey);
    return () => document.removeEventListener('keydown', handleGlobalKey);
  }, []);

  // ── Auth guard ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token && !isAuthenticated && !user) {
      router.push("/login");
    }
  }, [isAuthenticated, user, router]);



  // ── Real-time polling for notifications and messages ──────────────────────────
  useEffect(() => {
    if (!isAuthenticated && !user) return;
    
    const fetchRealTimeData = async () => {
      try {
        const [notifRes, msgRes] = await Promise.all([
          apiClient.get('/notifications/in-app'),
          apiClient.get('/communications/conversations')
        ]);
        
        if (notifRes.data?.success) {
          const raw = notifRes.data.data || [];
          setNotifications(raw.map((n: any) => ({
            id: n.id,
            icon: n.notification?.notificationType === 'booking' ? "📦" : "🔔",
            title: n.notification?.title || "Notification",
            desc: n.notification?.message || "",
            time: new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: n.isRead,
          })));
        }
        
        if (msgRes.data?.success) {
          const raw = msgRes.data.data || [];
          setInbox(raw.map((c: any) => {
            const latestMessage = c.messages?.[0];
            const otherParticipant = c.admin || { firstName: 'System', lastName: '' };
            return {
              id: c.id,
              initial: otherParticipant?.firstName?.[0] || 'U',
              color: "bg-indigo-600",
              name: `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || "User",
              preview: latestMessage ? latestMessage.message : "No messages yet",
              time: latestMessage ? new Date(latestMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
              unread: c._count?.messages || 0,
              online: true,
            };
          }));
        }
      } catch (error) {
        console.error("Error fetching real-time data:", error);
      }
    };

    fetchRealTimeData();
    const interval = setInterval(fetchRealTimeData, 15000); // poll every 15s
    return () => clearInterval(interval);
  }, [isAuthenticated, user]);

  // ── Derived counts ───────────────────────────────────────────────────────────
  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const unreadMailCount = inbox.reduce((s, c) => s + c.unread, 0);

  const markAllNotifRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markNotifRead = async (id: number) => {
    try {
      await apiClient.put(`/notifications/in-app/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleHeaderBadge = () => {
    if (!user) return null;
    const r = (user.role || "").toLowerCase();
    if (r === "admin") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
          <ShieldCheck className="w-3.5 h-3.5" /> Admin Operations Center
        </span>
      );
    }
    if (r === "vendor" || r === "partner") {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Briefcase className="w-3.5 h-3.5" /> Background Vendor Partner
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
        <UserIcon className="w-3.5 h-3.5" /> Customer Portal
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar />

      <div className="flex flex-1 min-h-0">
        <Modals />
        <Sidebar />

        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Sub-header bar ─────────────────────────────────────────────── */}
          <header className="sticky top-0 z-30 px-6 py-3 flex justify-between items-center gap-4 shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur-md">


            {/* Search */}
            <div className="relative hidden sm:block" ref={searchRef} style={{ width: 340 }}>

              <div
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 focus-within:bg-white transition-all"
              >
                <Search size={15} className="text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(e.target.value.trim().length > 0);
                    setHighlightedIndex(-1);
                  }}
                  onFocus={() => { if (searchQuery.trim().length > 0) setSearchOpen(true); }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search bookings, events, tasks..."
                  className="bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none w-full font-semibold"
                />
                {searchQuery.length === 0 && (
                  <span style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 6, padding: '1px 6px', fontWeight: 600 }}>⌘K</span>
                )}
                {searchQuery.length > 0 && (
                  <button
                    onClick={() => { setSearchQuery(''); setSearchOpen(false); setHighlightedIndex(-1); }}
                    style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    aria-label="Clear search"
                  >✕</button>
                )}
              </div>

              {/* Dropdown */}
              {searchOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: 8,
                    width: '100%',
                    minWidth: 400,
                    background: '#fff',
                    borderRadius: 16,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.13)',
                    border: '1px solid #e2e8f0',
                    zIndex: 50,
                    maxHeight: 320,
                    overflowY: 'auto',
                  }}
                >
                  {searchResults.length === 0 ? (
                    <div style={{ padding: '24px 20px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>
                      <span style={{ fontSize: 22 }}>🔍</span>
                      <p style={{ marginTop: 6, fontWeight: 600 }}>No results found</p>
                      <p style={{ fontSize: 11, marginTop: 2 }}>Try a different keyword</p>
                    </div>
                  ) : (
                    <>
                      <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                      </div>
                      {searchResults.map((item, idx) => (
                        <button
                          key={item.href}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          onClick={() => handleSearchNavigate(item.href)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: '100%',
                            textAlign: 'left',
                            padding: '9px 14px',
                            background: highlightedIndex === idx ? '#f5f3ff' : 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderBottom: idx < searchResults.length - 1 ? '1px solid #f1f5f9' : 'none',
                            transition: 'background 0.12s',
                          }}
                        >
                          <span style={{ fontSize: 18, lineHeight: 1, flexShrink: 0 }}>{item.icon}</span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {highlightMatch(item.label, searchQuery)}
                            </p>
                            <p style={{ fontSize: 10, color: '#94a3b8', margin: '1px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.sub}
                            </p>
                          </div>
                          <span style={typeBadgeStyle[item.type] ?? typeBadgeStyle.page}>
                            {item.type}
                          </span>
                        </button>
                      ))}
                      <div style={{ padding: '6px 14px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12, fontSize: 10, color: '#94a3b8' }}>
                        <span>↑↓ navigate</span>
                        <span>↵ select</span>
                        <span>Esc close</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              {getRoleHeaderBadge()}

              {/* ── 🔔 Notification Bell ─────────────────────────────────── */}
              <div className="relative" ref={notifRef}>
                <button
                  id="notif-bell-btn"
                  onClick={() => {
                    setShowNotif((p) => !p);
                    setShowMail(false);
                  }}
                  className="relative rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                  title="Notifications"
                >
                  <Bell size={17} />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 min-w-[16px] h-4 px-1 rounded-full bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {showNotif && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-bold text-slate-900">Notifications</span>
                        {unreadNotifCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                            {unreadNotifCount} New
                          </span>
                        )}
                      </div>
                      <button
                        onClick={markAllNotifRead}
                        className="text-[10px] font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        Mark all read
                      </button>
                    </div>

                    {/* Notification items */}
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markNotifRead(n.id)}
                          className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors hover:bg-slate-50 ${
                            !n.read ? "bg-purple-50/60" : ""
                          }`}
                        >
                          <span className="text-lg leading-none mt-0.5 shrink-0">{n.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold truncate ${!n.read ? "text-slate-900" : "text-slate-600"}`}>
                                {n.title}
                              </p>
                              <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 line-clamp-2">
                              {n.desc}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50 text-center">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowNotif(false)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition-colors"
                      >
                        View all activity →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* ── ✉️ Messages Mail ─────────────────────────────────────── */}
              <div className="relative" ref={mailRef}>
                <button
                  id="mail-inbox-btn"
                  onClick={() => {
                    setShowMail((p) => !p);
                    setShowNotif(false);
                  }}
                  className="relative rounded-xl bg-slate-100 p-2 text-slate-600 transition hover:bg-slate-200"
                  title="Messages"
                >
                  <Mail size={17} />
                  {unreadMailCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 min-w-[16px] h-4 px-1 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadMailCount}
                    </span>
                  )}
                </button>

                {showMail && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    {/* Panel header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-bold text-slate-900">Messages</span>
                        {unreadMailCount > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                            {unreadMailCount} Unread
                          </span>
                        )}
                      </div>
                      <Link
                        href="/dashboard/messages"
                        onClick={() => setShowMail(false)}
                        className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Open inbox
                      </Link>
                    </div>

                    {/* Inbox preview list */}
                    <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                      {inbox.map((c) => (
                        <Link
                          key={c.id}
                          href="/dashboard/messages"
                          onClick={() => {
                            setInbox((prev) =>
                              prev.map((m) =>
                                m.id === c.id ? { ...m, unread: 0 } : m
                              )
                            );
                            setShowMail(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                            c.unread > 0 ? "bg-indigo-50/50" : ""
                          }`}
                        >
                          {/* Avatar with online dot */}
                          <div className="relative shrink-0">
                            <div
                              className={`w-9 h-9 rounded-xl ${c.color} text-white text-xs font-bold flex items-center justify-center`}
                            >
                              {c.initial}
                            </div>
                            {c.online && (
                              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-xs font-bold truncate ${c.unread > 0 ? "text-slate-900" : "text-slate-600"}`}>
                                {c.name}
                              </p>
                              <span className="text-[9px] text-slate-400 shrink-0">{c.time}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {c.preview}
                            </p>
                          </div>

                          {c.unread > 0 && (
                            <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                              {c.unread}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-slate-100 px-4 py-2.5 bg-slate-50 text-center">
                      <Link
                        href="/dashboard/messages"
                        onClick={() => setShowMail(false)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
                      >
                        Go to full messaging hub →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

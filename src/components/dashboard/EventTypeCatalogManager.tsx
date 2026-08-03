"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Circle,
  X,
  Layers,
  Calendar,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  Tag,
  Eye,
  EyeOff,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { createNotification } from "@/lib/notifications";

export interface EventTypeItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  banner: string;
  icon: string;
  displayOrder: number;
  guestLimit: number;
  status: "Published" | "Unpublished";
  themes: string[];
  schedules: string[];
  faqs: { q: string; a: string }[];
  policies: string[];
  features: string[];
}

const DEFAULT_EVENT_TYPES: EventTypeItem[] = [
  {
    id: "evt-type-wedding",
    name: "Wedding",
    slug: "wedding",
    category: "Social Celebration",
    description: "Full royal wedding event planning with photography, stage decor & lighting.",
    banner: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    icon: "💍",
    displayOrder: 1,
    guestLimit: 500,
    status: "Published",
    themes: ["Royal Gold & Ruby", "Enchanted Floral Garden", "Modern Emerald Luxury"],
    schedules: ["Morning Stage Setup (08:00 AM)", "Guest Arrival & Welcome (04:00 PM)", "Ceremony & Reception (07:00 PM)"],
    faqs: [
      { q: "Can we customize the stage lighting?", a: "Yes, our EVENTO lighting team customizes RGB palettes." },
      { q: "Are drone cameras included?", a: "Drone coverage is included in Premium packages." },
    ],
    policies: ["30-day cancellation escrow protection", "50% advance booking deposit requirement"],
    features: ["Dedicated EVENTO Lead Coordinator", "Multi-angle 4K Cinematography", "Managed Escrow Security"],
  },
  {
    id: "evt-type-holud",
    name: "Gaye Holud",
    slug: "gaye-holud",
    category: "Traditional Bengali",
    description: "Vibrant Gaye Holud stage, floral jhula, and traditional dholak entertainment.",
    banner: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
    icon: "🌼",
    displayOrder: 2,
    guestLimit: 300,
    status: "Published",
    themes: ["Yellow Marigold & Jasmine", "Rustic Bengali Heritage", "Neon Mehndi Chic"],
    schedules: ["Floral Stage Decor (01:00 PM)", "Bride & Groom Seating (05:30 PM)", "Holud Rituals (07:00 PM)"],
    faqs: [
      { q: "Do you provide fresh floral jewelry?", a: "Yes, fresh floral jewelry sets can be added in services." },
    ],
    policies: ["14-day reschedule notice required", "Standard 15% platform management fee"],
    features: ["Traditional Floral Jhula Swing", "Warm Amber & Marigold Stage Lighting"],
  },
  {
    id: "evt-type-corporate",
    name: "Corporate Summit",
    slug: "corporate-summit",
    category: "Corporate Event",
    description: "Professional executive conferences, LED walls, podiums & live streaming.",
    banner: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    icon: "👔",
    displayOrder: 3,
    guestLimit: 1000,
    status: "Published",
    themes: ["Corporate Blue & Clean White", "Tech Summit Minimalist"],
    schedules: ["AV & Sound Check (07:00 AM)", "Keynote Speech (10:00 AM)", "Networking Buffet (01:00 PM)"],
    faqs: [
      { q: "Can we display our corporate sponsor logos?", a: "Yes, our LED wall console supports multi-sponsor looping." },
    ],
    policies: ["Corporate VAT invoice generation included", "Net-14 payment settlement options"],
    features: ["16-Channel Wireless Audio Console", "Full HD Multi-Camera Live Broadcast"],
  },
];

export default function EventTypeCatalogManager() {
  const [eventTypes, setEventTypes] = useState<EventTypeItem[]>(DEFAULT_EVENT_TYPES);
  const [categories, setCategories] = useState<string[]>([
    "Social Celebration",
    "Traditional Bengali",
    "Corporate Event",
    "Birthday & Anniversary",
    "Conference & Seminar",
  ]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EventTypeItem | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Social Celebration");
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🎉");
  const [guestLimit, setGuestLimit] = useState(300);
  const [status, setStatus] = useState<"Published" | "Unpublished">("Published");
  const [themes, setThemes] = useState<string[]>([]);
  const [newTheme, setNewTheme] = useState("");
  const [schedules, setSchedules] = useState<string[]>([]);
  const [newSchedule, setNewSchedule] = useState("");
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");
  const [policies, setPolicies] = useState<string[]>([]);
  const [newPolicy, setNewPolicy] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");

  const loadData = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customEventTypes");
        if (stored) {
          const parsed = JSON.parse(stored);
          setEventTypes(parsed);
        } else {
          setEventTypes(DEFAULT_EVENT_TYPES);
        }

        const storedCats = localStorage.getItem("customEventCategories");
        if (storedCats) {
          setCategories(JSON.parse(storedCats));
        }
      } catch (e) {}
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const saveToLocalStorage = (updatedList: EventTypeItem[], updatedCats?: string[]) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("customEventTypes", JSON.stringify(updatedList));
        if (updatedCats) {
          localStorage.setItem("customEventCategories", JSON.stringify(updatedCats));
        }
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
      } catch (e) {}
    }
  };

  const handleOpenModal = (item?: EventTypeItem) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setSlug(item.slug);
      setCategory(item.category);
      setDescription(item.description);
      setIcon(item.icon);
      setGuestLimit(item.guestLimit);
      setStatus(item.status);
      setThemes([...item.themes]);
      setSchedules([...item.schedules]);
      setFaqs([...item.faqs]);
      setPolicies([...item.policies]);
      setFeatures([...item.features]);
    } else {
      setEditingItem(null);
      setName("");
      setSlug("");
      setCategory(categories[0] || "Social Celebration");
      setDescription("");
      setIcon("🎉");
      setGuestLimit(300);
      setStatus("Published");
      setThemes(["Standard Stage Lighting", "Floral Welcome Entrance"]);
      setSchedules(["Morning Decor Setup (09:00 AM)", "Event Commencement (06:00 PM)"]);
      setFaqs([{ q: "Can we reschedule the date?", a: "Yes, up to 14 days prior without penalty." }]);
      setPolicies(["Escrow protected payment terms", "Standard EVENTO platform policies"]);
      setFeatures(["Dedicated Lead Coordinator", "Vetted Partner Team Coverage"]);
    }
    setIsModalOpen(true);
  };

  const handleAddCategory = () => {
    if (!newCategoryInput.trim()) return;
    const catName = newCategoryInput.trim();
    if (!categories.includes(catName)) {
      const updatedCats = [...categories, catName];
      setCategories(updatedCats);
      setCategory(catName);
      saveToLocalStorage(eventTypes, updatedCats);
      toast.success(`✓ Category "${catName}" added!`);
    } else {
      setCategory(catName);
    }
    setNewCategoryInput("");
  };

  const handleTogglePublish = (id: string) => {
    const updated: EventTypeItem[] = eventTypes.map((t) => {
      if (t.id === id) {
        const nextStatus: "Published" | "Unpublished" =
          t.status === "Published" ? "Unpublished" : "Published";
        return { ...t, status: nextStatus };
      }
      return t;
    });
    setEventTypes(updated);
    saveToLocalStorage(updated);

    const targeted = eventTypes.find((t) => t.id === id);
    if (targeted) {
      const newSt = targeted.status === "Published" ? "Unpublished" : "Published";
      toast.success(`✓ Event '${targeted.name}' is now ${newSt}!`);
      createNotification(
        `Event Type ${newSt}`,
        `Admin changed '${targeted.name}' status to ${newSt} in the Managed OS catalog.`,
        "⚡"
      );
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this Event Type?")) return;
    const updated = eventTypes.filter((t) => t.id !== id);
    setEventTypes(updated);
    saveToLocalStorage(updated);
    toast.success("✓ Event Type deleted from catalog.");
  };

  const handleSaveEventType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Event name is required");
      return;
    }

    const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const itemData: EventTypeItem = {
      id: editingItem ? editingItem.id : `evt-type-${Date.now()}`,
      name: name.trim(),
      slug: generatedSlug,
      category,
      description: description.trim() || "Managed event celebration package.",
      banner: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      icon: icon || "🎉",
      displayOrder: editingItem ? editingItem.displayOrder : eventTypes.length + 1,
      guestLimit: Number(guestLimit) || 300,
      status,
      themes,
      schedules,
      faqs,
      policies,
      features,
    };

    let updated: EventTypeItem[];
    if (editingItem) {
      updated = eventTypes.map((t) => (t.id === editingItem.id ? itemData : t));
      toast.success(`✓ Event Type "${itemData.name}" updated successfully!`);
    } else {
      updated = [...eventTypes, itemData];
      toast.success(`✓ Created new Event Type "${itemData.name}" with full catalog rules!`);
    }

    setEventTypes(updated);
    saveToLocalStorage(updated);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wider">
            Phase 1 Platform Builder
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 mt-1">
            Event Types &amp; Platform Catalog Architecture
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Create and configure Event Types, Categories, Themes, Schedules, FAQs, Policies, and Features for customers.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Create New Event Type
        </button>
      </div>

      {/* Category Filter & Creator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase">Categories:</span>
          {categories.map((cat, idx) => (
            <span
              key={`cat-${idx}`}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200"
            >
              {cat}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="New category..."
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={handleAddCategory}
            className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            + Add Category
          </button>
        </div>
      </div>

      {/* Event Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {eventTypes.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center text-2xl shrink-0">
                    {t.icon || "🎉"}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{t.name}</h3>
                    <p className="text-xs text-slate-400 font-mono">/{t.slug}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTogglePublish(t.id)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                    t.status === "Published"
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                  title="Click to Publish/Unpublish"
                >
                  {t.status === "Published" ? (
                    <>
                      <Eye className="w-3 h-3" /> Published
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3" /> Unpublished
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  {t.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 flex items-center gap-1">
                  <Users className="w-3 h-3" /> Max {t.guestLimit} Guests
                </span>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {t.description}
              </p>

              {/* Sub-item Counts Badge Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" /> {t.themes.length} Themes
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" /> {t.schedules.length} Schedules
                </div>
                <div className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> {t.faqs.length} FAQs
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {t.policies.length} Policies
                </div>
                <div className="flex items-center gap-1 col-span-2 sm:col-span-1">
                  <Layers className="w-3.5 h-3.5 text-blue-600" /> {t.features.length} Features
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => handleOpenModal(t)}
                className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Edit2 className="w-3.5 h-3.5" /> Edit Event
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Event Type"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Event Type Builder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {editingItem ? `Edit "${editingItem.name}"` : "Create New Event Type"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure all Managed Event OS parameters for this event category.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEventType} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700">Event Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Wedding"
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Slug (URL)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. wedding"
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    {categories.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Icon Emoji</label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="💍"
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Guest Limit</label>
                  <input
                    type="number"
                    value={guestLimit}
                    onChange={(e) => setGuestLimit(Number(e.target.value))}
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="Published">Published (Active)</option>
                    <option value="Unpublished">Unpublished (Draft)</option>
                  </select>
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-bold text-slate-700">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short description of this event type..."
                    className="mt-1 w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                </div>
              </div>

              {/* Themes Builder */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-600" /> Event Themes ({themes.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add theme..."
                      value={newTheme}
                      onChange={(e) => setNewTheme(e.target.value)}
                      className="px-3 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newTheme.trim() && !themes.includes(newTheme.trim())) {
                          setThemes([...themes, newTheme.trim()]);
                          setNewTheme("");
                        }
                      }}
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add Theme
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {themes.map((thm, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-medium flex items-center gap-2"
                    >
                      {thm}
                      <button
                        type="button"
                        onClick={() => setThemes(themes.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Schedules Builder */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" /> Event Schedules ({schedules.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add schedule item..."
                      value={newSchedule}
                      onChange={(e) => setNewSchedule(e.target.value)}
                      className="px-3 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newSchedule.trim()) {
                          setSchedules([...schedules, newSchedule.trim()]);
                          setNewSchedule("");
                        }
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add Schedule
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {schedules.map((sch, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-lg text-xs font-medium flex items-center gap-2"
                    >
                      {sch}
                      <button
                        type="button"
                        onClick={() => setSchedules(schedules.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* FAQs Builder */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-amber-600" /> Event FAQs ({faqs.length})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="FAQ Question..."
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="FAQ Answer..."
                      value={newFaqA}
                      onChange={(e) => setNewFaqA(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFaqQ.trim() && newFaqA.trim()) {
                          setFaqs([...faqs, { q: newFaqQ.trim(), a: newFaqA.trim() }]);
                          setNewFaqQ("");
                          setNewFaqA("");
                        }
                      }}
                      className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add FAQ
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {faqs.map((faq, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white border border-amber-200 rounded-xl text-xs flex items-center justify-between gap-2"
                    >
                      <div>
                        <p className="font-bold text-slate-900">Q: {faq.q}</p>
                        <p className="text-slate-600">A: {faq.a}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies Builder */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Event Policies ({policies.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add policy rule..."
                      value={newPolicy}
                      onChange={(e) => setNewPolicy(e.target.value)}
                      className="px-3 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newPolicy.trim()) {
                          setPolicies([...policies, newPolicy.trim()]);
                          setNewPolicy("");
                        }
                      }}
                      className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add Policy
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {policies.map((pol, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium flex items-center gap-2"
                    >
                      {pol}
                      <button
                        type="button"
                        onClick={() => setPolicies(policies.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Features Builder */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-600" /> Event Features ({features.length})
                  </h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add feature item..."
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="px-3 py-1 text-xs bg-white border border-slate-300 rounded-lg text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newFeature.trim()) {
                          setFeatures([...features, newFeature.trim()]);
                          setNewFeature("");
                        }
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold"
                    >
                      + Add Feature
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {features.map((feat, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-white border border-blue-200 text-blue-800 rounded-lg text-xs font-medium flex items-center gap-2"
                    >
                      {feat}
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, idx) => idx !== i))}
                        className="text-slate-400 hover:text-rose-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
                >
                  Save Event Type
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

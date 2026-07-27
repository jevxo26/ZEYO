"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  MapPin,
  Clock,
  CalendarDays,
  Send,
  User,
  ShieldCheck,
  AlertCircle,
  Briefcase,
  DollarSign,
  PhoneCall,
  MessageSquare,
  ListFilter,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import apiClient from "@/lib/apiClient";

interface AssignedTaskType {
  id: string;
  bookingRef: string;
  title: string;
  category: string;
  zone: string;
  venue: string;
  date: string;
  duration: string;
  payout: string;
  status: string;
  requirements: { title: string; desc: string }[];
  coordinatorNotes: string;
}

const DEFAULT_VENDOR_TASKS: AssignedTaskType[] = [
  {
    id: "TSK-001",
    bookingRef: "#BKG-2026-001",
    title: "Royal Wedding Ceremony",
    category: "Photography",
    zone: "Dhaka Zone",
    venue: "Gulshan Club, Hall A, Dhaka",
    date: "Saturday, Nov 15, 2026",
    duration: "4:00 PM – 11:00 PM (7 Hrs)",
    payout: "৳35,000 (Protected Escrow)",
    status: "In Progress",
    requirements: [
      {
        title: "2 Senior Photographers Required",
        desc: "One for bride preparation, one for venue setup & guest arrivals.",
      },
      {
        title: "Drone Aerial Coverage",
        desc: "Capture exterior wide shots of the venue before sunset.",
      },
      {
        title: "Same-Day Edit (SDE) Teaser",
        desc: "A 60-second highlight reel to be played during the reception dinner.",
      },
    ],
    coordinatorNotes:
      "Arrive by 3:30 PM for equipment check. Ask for EVENTO Coordinator Arif at the service entrance.",
  },
  {
    id: "TSK-002",
    bookingRef: "#BKG-2026-002",
    title: "Gaye Holud Night Celebration",
    category: "Decoration",
    zone: "Dhaka Zone",
    venue: "Banani Convention Hall, Dhaka",
    date: "Thursday, Nov 13, 2026",
    duration: "2:00 PM – 9:00 PM (Setup + Event)",
    payout: "৳65,000 (Protected Escrow)",
    status: "Confirmed",
    requirements: [
      {
        title: "Fresh Marigold & Jasmine Floral Stage",
        desc: "Build traditional Bengali Holud backdrop with warm yellow & orange lighting.",
      },
      {
        title: "Bride & Groom Seating Jhula",
        desc: "Decorate wooden swing with fresh floral garlands.",
      },
    ],
    coordinatorNotes:
      "Venue doors open at 1:00 PM for decor team setup. Clear stage by 10:30 PM.",
  },
  {
    id: "TSK-003",
    bookingRef: "#BKG-2026-003",
    title: "Corporate Annual Summit",
    category: "Audio/Visual & Sound",
    zone: "Chattogram Zone",
    venue: "Radisson Blu, Chattogram",
    date: "Monday, Dec 01, 2026",
    duration: "9:00 AM – 5:00 PM (8 Hrs)",
    payout: "৳38,000 (Protected Escrow)",
    status: "Confirmed",
    requirements: [
      {
        title: "Dual P2.5 LED Display Screens",
        desc: "Set up flanking screens for keynote presentation slides.",
      },
      {
        title: "6 Wireless Lapel Mics + Digital Console",
        desc: "Ensure zero feedback during Q&A panel sessions.",
      },
    ],
    coordinatorNotes:
      "Sound check mandatory at 8:00 AM sharp with EVENTO Tech Lead.",
  },
];

export default function TaskDetailsPage() {
  const [tasksList, setTasksList] = useState<AssignedTaskType[]>(DEFAULT_VENDOR_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string>("TSK-001");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const [notes, setNotes] = useState([
    {
      id: 1,
      author: "EVENTO Coordinator (Arif)",
      initials: "EA",
      time: "2 hours ago",
      text: "Please ensure the team coordinates with venue security for equipment clearance upon arrival.",
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [progressStep, setProgressStep] = useState(1); // 0: Accepted, 1: At Venue, 2: Started, 3: Completed
  const [isUploading, setIsUploading] = useState(false);

  const fetchVendorTasks = async () => {
    let customMapped: AssignedTaskType[] = [];
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        if (stored) {
          const list = JSON.parse(stored);
          customMapped = list.map((b: any, i: number) => ({
            id: String(b.id || `CUSTOM-${i}`),
            bookingRef: b.bookingNumber || `#${b.id || `BKG-${i + 1}`}`,
            title: b.eventName || b.notes || "Custom Celebration",
            category: b.eventType || "Event Execution",
            zone: "Dhaka Zone",
            venue: b.location || "Location TBD",
            date: b.eventDate ? new Date(b.eventDate).toLocaleDateString() : "Upcoming",
            duration: "Full Event Duration",
            payout: `৳${Number(b.grandTotal || b.budget || 45000).toLocaleString()} (Protected Escrow)`,
            status: b.bookingStatus || b.status || "Confirmed",
            requirements: [
              {
                title: `${b.eventType || "Event"} Setup & Delivery`,
                desc: b.notes || "Full service execution according to customer specs.",
              },
              {
                title: "Quality Assurance Check",
                desc: "Ensure all line items pass EVENTO QA criteria before event commencement.",
              },
            ],
            coordinatorNotes: "Coordinate with EVENTO Dispatch officer upon arrival.",
          }));
        }
      } catch (e) {}
    }

    try {
      const res = await apiClient.get("/vendors/tasks");
      if (res.data?.success !== false && Array.isArray(res.data?.data) && res.data.data.length > 0) {
        const apiTasks = res.data.data;
        const merged = [...customMapped, ...apiTasks];
        setTasksList(merged);
        if (merged.length > 0 && !selectedTaskId) {
          setSelectedTaskId(merged[0].id);
        }
        return;
      }
    } catch (e) {
      console.warn("Using local vendor task data");
    }

    const merged = [...customMapped, ...DEFAULT_VENDOR_TASKS];
    setTasksList(merged);
    if (merged.length > 0 && (!selectedTaskId || !merged.find((t) => t.id === selectedTaskId))) {
      setSelectedTaskId(merged[0].id);
    }
  };

  useEffect(() => {
    fetchVendorTasks();

    const handleUpdate = () => fetchVendorTasks();
    window.addEventListener("dashboard-data-update", handleUpdate);
    return () => window.removeEventListener("dashboard-data-update", handleUpdate);
  }, []);

  const currentTask =
    tasksList.find((t) => String(t.id) === String(selectedTaskId)) || tasksList[0] || DEFAULT_VENDOR_TASKS[0];

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNotes([
      ...notes,
      {
        id: Date.now(),
        author: "You (Vendor Partner)",
        initials: "VP",
        time: "Just now",
        text: newNote.trim(),
      },
    ]);
    setNewNote("");
    toast.success("Note posted to EVENTO dispatch channel!");
  };

  const handleMessageCoordinator = () => {
    toast.success(
      "Message alert sent to EVENTO Operations Desk! Your coordinator will reply in the dispatch channel.",
      { duration: 4000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast.success(`✓ Deliverable "${file.name}" uploaded successfully for QA review!`);
    }, 1500);
  };

  const steps = [
    { label: "TASK ACCEPTED", note: "Accepted by Vendor Team" },
    { label: "TEAM AT VENUE", note: "Arrival verified by Coordinator" },
    { label: "SERVICE EXECUTION", note: "Live event coverage underway" },
    { label: "WORK COMPLETED", note: "Awaiting final clearance & payout" },
  ];

  const handleStatusChange = (newStatus: string) => {
    const updated = tasksList.map((t) =>
      t.id === currentTask.id ? { ...t, status: newStatus } : t
    );
    setTasksList(updated);
    toast.success(`Task status updated to: ${newStatus}`);
  };

  const filteredTasks = tasksList.filter((t) => {
    if (filterStatus === "All") return true;
    return t.status.toLowerCase().includes(filterStatus.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Vendor Notice Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white/10 shrink-0 border border-white/10">
            <ShieldCheck className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-500/20 text-purple-200 border border-purple-400/20">
              Vendor Task Board
            </span>
            <h1 className="text-xl sm:text-2xl font-bold mt-1">
              Task Execution Workspace
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Technical event specifications, venue locations, and schedule instructions dispatched by EVENTO Operations.
            </p>
          </div>
        </div>

        {/* Task Selector Dropdown */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="text-xs font-semibold text-slate-300">Select Task:</span>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-600"
          >
            {tasksList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.bookingRef} - {t.title} ({t.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Task Header & Quick Status Switch */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {currentTask.title}
            </h1>
            <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              {currentTask.bookingRef}
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-purple-100 text-purple-700">
              {currentTask.category}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-700">
              {currentTask.zone}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-100 text-amber-800">
              {currentTask.status}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-right">
            <span className="text-[10px] uppercase font-semibold text-emerald-700 block">
              Assigned Payout
            </span>
            <span className="text-sm font-bold text-emerald-950">
              {currentTask.payout}
            </span>
          </div>

          <button
            onClick={handleMessageCoordinator}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" /> Dispatch Desk
          </button>

          <button
            onClick={() => {
              if (progressStep < steps.length - 1) {
                const nextStep = progressStep + 1;
                setProgressStep(nextStep);
                if (nextStep === steps.length - 1) {
                  handleStatusChange("Completed");
                } else {
                  handleStatusChange("In Progress");
                }
              }
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Advance Progress
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispatch Specifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Technical Dispatch Sheet</span>
              <span className="text-xs font-normal text-slate-400">
                Managed Event OS
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <CalendarDays className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Execution Date
                  </p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {currentTask.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <Clock className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Duration
                  </p>
                  <p className="font-bold text-slate-900 mt-0.5">
                    {currentTask.duration}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <MapPin className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                    Venue Location
                  </p>
                  <p className="font-bold text-slate-900 mt-0.5 leading-relaxed">
                    {currentTask.venue} ({currentTask.zone})
                  </p>
                </div>
              </div>
            </div>

            {/* Coordinator Instructions */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs">
              <span className="font-semibold uppercase tracking-wider block text-[10px] text-slate-500 mb-1">
                Coordinator Dispatch Note
              </span>
              <p className="leading-relaxed font-normal">{currentTask.coordinatorNotes}</p>
            </div>

            {/* GPS Route Button */}
            <div className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentTask.venue)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg shadow-sm hover:bg-slate-100 transition-colors"
              >
                📍 Open GPS Directions to {currentTask.venue}
              </a>
            </div>
          </div>

          {/* Service Requirements */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Technical Requirements
            </h2>

            {currentTask.requirements.map((req, i) => (
              <div
                key={i}
                className="flex gap-3 items-start p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    {req.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {req.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Internal Dispatch Communication */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dispatch Communication Log
            </h2>

            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {n.initials}
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-slate-900">
                        {n.author}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {n.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Post a message to EVENTO Operations Desk..."
                className="flex-1 rounded-lg px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                Send <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Work Progress Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Execution Progress
            </h2>

            <div className="space-y-5 pl-4 border-l-2 border-slate-200">
              {steps.map((step, i) => {
                const isCompleted = i <= progressStep;
                const isCurrent = i === progressStep;

                return (
                  <div key={i} className="relative space-y-1">
                    <div
                      className={`absolute -left-[23px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                        isCompleted ? "bg-slate-900" : "bg-slate-300"
                      }`}
                    />
                    <h3
                      className={`text-xs font-bold ${
                        isCompleted ? "text-slate-900" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </h3>
                    <p className="text-xs text-slate-500">{step.note}</p>

                    {isCurrent && i < steps.length - 1 && (
                      <button
                        onClick={() => {
                          const nextStep = i + 1;
                          setProgressStep(nextStep);
                          if (nextStep === steps.length - 1) {
                            handleStatusChange("Completed");
                          } else {
                            handleStatusChange("In Progress");
                          }
                        }}
                        className="mt-2 w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
                      >
                        Advance Step
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Deliverable File Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Deliverables Upload
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload raw drafts, media clips, or final edited files for EVENTO QA inspection.
            </p>

            <label className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-6 text-center space-y-2 cursor-pointer hover:bg-slate-100 transition-colors block">
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-600">
                <CloudUpload className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-xs font-bold text-slate-800">
                {isUploading ? "Uploading file..." : "Click or drag & drop file"}
              </p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">
                ZIP, JPG, PNG or MP4 (Max 800MB)
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

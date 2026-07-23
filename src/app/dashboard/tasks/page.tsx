"use client";

import { useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  MapPin,
  Clock,
  CalendarDays,
  Send,
  User,
  Check,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TaskDetailsPage() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      author: "Event Admin",
      initials: "EA",
      time: "2 hours ago",
      text: "Please ensure the drone operator coordinates with hotel security for airspace clearance upon arrival.",
    },
  ]);
  const [newNote, setNewNote] = useState("");
  const [progressStep, setProgressStep] = useState(1); // 0: Accepted, 1: At Venue, 2: Started, 3: Completed

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setNotes([
      ...notes,
      {
        id: Date.now(),
        author: "You",
        initials: "ME",
        time: "Just now",
        text: newNote.trim(),
      },
    ]);
    setNewNote("");
    toast.success("Internal note added!");
  };

  const steps = [
    { label: "TASK ACCEPTED", note: "Accepted by Sarah Jenkins" },
    { label: "TEAM AT VENUE", note: "Arrival verified" },
    { label: "PHOTOGRAPHY STARTED", note: "Main coverage underway" },
    { label: "WORK COMPLETED", note: "Awaiting final review" },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Wedding Premium Coverage
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              #EVT-4921
            </span>
          </div>
          <div className="flex gap-2 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-100 text-purple-700">
              Photography
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-700">
              In Progress
            </span>
          </div>
        </div>

        <div className="flex gap-3 shrink-0">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Contact Client
          </button>
          <button
            onClick={() => {
              if (progressStep < steps.length - 1) {
                setProgressStep(progressStep + 1);
                toast.success(`Status updated to: ${steps[progressStep + 1].label}`);
              }
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm"
          >
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Details */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3">
              Event Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</p>
                  <p className="font-semibold text-slate-900 mt-0.5">Saturday, Oct 24, 2024</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Duration</p>
                  <p className="font-semibold text-slate-900 mt-0.5">4:00 PM – 11:00 PM (7 Hrs)</p>
                </div>
              </div>

              <div className="sm:col-span-2 flex items-start gap-3 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-600 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Venue Location</p>
                  <p className="font-semibold text-slate-900 mt-0.5 leading-relaxed">
                    The Grand Hotel Ballroom, 123 Luxury Ave, City Center
                  </p>
                </div>
              </div>
            </div>

            {/* GPS Link Button */}
            <div className="w-full h-32 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center p-4 text-center">
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                📍 Click to view GPS route & directions
              </a>
            </div>
          </div>

          {/* Customer Requirements */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Customer Requirements
            </h2>

            {[
              {
                title: "2 Senior Photographers Required",
                desc: "One for bride preparation, one for venue setup & guest arrivals.",
              },
              {
                title: "Drone Aerial Coverage",
                desc: "Capture exterior wide shots of the hotel venue before sunset.",
              },
              {
                title: "Same-Day Edit (SDE) Teaser",
                desc: "A 60-second highlight reel to be played during the reception dinner.",
              },
            ].map((req, i) => (
              <div key={i} className="flex gap-3 items-start p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-700 mt-0.5 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{req.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Internal Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Internal Notes
            </h2>

            <div className="space-y-3">
              {notes.map((n) => (
                <div key={n.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {n.initials}
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="text-xs font-bold text-slate-900">{n.author}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{n.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePostNote} className="flex gap-2 pt-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add an internal note..."
                className="flex-1 rounded-lg px-4 py-2 text-xs bg-slate-50 border border-slate-200 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                Post <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Progress Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Work Progress Status
            </h2>

            <div className="space-y-6 pl-4 border-l-2 border-slate-200">
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
                    <h3 className={`text-xs font-bold ${isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                      {step.label}
                    </h3>
                    <p className="text-xs text-slate-500">{step.note}</p>

                    {isCurrent && i < steps.length - 1 && (
                      <button
                        onClick={() => {
                          setProgressStep(i + 1);
                          toast.success(`Progress updated to: ${steps[i + 1].label}`);
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

          {/* Deliverables */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Deliverables
            </h2>
            <p className="text-xs text-slate-500">Upload raw drafts, clips, or final edited files here.</p>

            <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl p-6 text-center space-y-2 cursor-pointer hover:bg-slate-100 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center mx-auto text-slate-600">
                <CloudUpload className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800">Click or drag & drop</p>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">PNG, JPG or ZIP (max 800MB)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

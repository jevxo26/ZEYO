import {
  ArrowLeft,
  CheckCircle2,
  CloudUpload,
  MapPin,
  Clock,
  CalendarDays,
  Send,
} from "lucide-react";
import Link from "next/link";

export default function TaskDetailsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div
        className="relative rounded-3xl p-7 overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #2563eb 100%)",
          boxShadow: "0 10px 40px rgba(124,58,237,0.3)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: "rgba(255,255,255,0.05)",
            transform: "translate(40%,-40%)",
          }}
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold mb-3 opacity-75 hover:opacity-100 transition-opacity"
              style={{ color: "#e9d5ff" }}
            >
              <ArrowLeft size={13} /> Back to Dashboard
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-black tracking-tight text-white">
                Wedding Premium Coverage
              </h1>
              <span
                className="text-[10px] font-bold px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  color: "#e9d5ff",
                }}
              >
                #EVT-4921
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <span
                className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#ddd6fe",
                }}
              >
                Photography
              </span>
              <span
                className="text-[9px] font-bold px-2.5 py-1 rounded-full"
                style={{
                  background: "rgba(245,158,11,0.25)",
                  color: "#fde68a",
                }}
              >
                In Progress
              </span>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              className="text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.15)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              Contact Client
            </button>
            <button
              className="text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer text-purple-700"
              style={{
                background: "rgba(255,255,255,0.95)",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
              }}
            >
              Update Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Event Details */}
          <div
            className="rounded-2xl p-6 space-y-5"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <h3
              className="text-xs font-bold text-gray-900 uppercase tracking-wider pb-3"
              style={{ borderBottom: "1px solid rgba(124,58,237,0.08)" }}
            >
              Event Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              {[
                {
                  icon: CalendarDays,
                  label: "Date",
                  val: "Saturday, Oct 24, 2024",
                },
                {
                  icon: Clock,
                  label: "Duration",
                  val: "4:00 PM – 11:00 PM (7 Hrs)",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl shrink-0"
                    style={{
                      background: "rgba(124,58,237,0.08)",
                      color: "#7c3aed",
                    }}
                  >
                    <item.icon size={16} />
                  </div>
                  <div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p className="font-bold text-gray-800 mt-0.5">{item.val}</p>
                  </div>
                </div>
              ))}
              <div className="col-span-1 sm:col-span-2 flex items-start gap-3 pt-2">
                <div
                  className="p-2.5 rounded-xl shrink-0"
                  style={{
                    background: "rgba(37,99,235,0.08)",
                    color: "#2563eb",
                  }}
                >
                  <MapPin size={16} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                    Venue Location
                  </p>
                  <p className="font-bold text-gray-800 mt-0.5 leading-relaxed">
                    The Grand Hotel Ballroom, 123 Luxury Ave, City Center
                  </p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div
              className="w-full h-36 rounded-2xl overflow-hidden relative"
              style={{ border: "1px solid rgba(124,58,237,0.1)" }}
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600')`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.4), transparent)",
                }}
              />
              <div
                className="absolute bottom-3 left-3 text-[9px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#374151",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                }}
              >
                📍 Click to view GPS route
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Customer Requirements
            </h3>
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
              <div
                key={i}
                className="flex gap-3 items-start p-3.5 rounded-xl"
                style={{
                  background: "rgba(124,58,237,0.04)",
                  border: "1px solid rgba(124,58,237,0.08)",
                }}
              >
                <div
                  className="p-1 rounded-full mt-0.5 shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  }}
                >
                  <CheckCircle2 size={13} className="text-white" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">
                    {req.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-1 leading-relaxed">
                    {req.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Internal Notes
            </h3>
            <div
              className="p-4 rounded-xl flex gap-3 items-start"
              style={{
                background: "rgba(124,58,237,0.04)",
                border: "1px solid rgba(124,58,237,0.08)",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[9px] text-white shrink-0"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                }}
              >
                EA
              </div>
              <div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-gray-900">
                    Event Admin
                  </span>
                  <span className="text-[9px] text-gray-400">2 hours ago</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mt-1 font-medium">
                  Please ensure the drone operator coordinates with hotel
                  security for airspace clearance upon arrival.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add an internal note..."
                className="flex-1 rounded-xl px-4 py-2.5 text-xs outline-none font-medium text-gray-700"
                style={{
                  background: "rgba(124,58,237,0.05)",
                  border: "1px solid rgba(124,58,237,0.12)",
                }}
              />
              <button
                className="text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  boxShadow: "0 3px 10px rgba(124,58,237,0.2)",
                }}
              >
                Post <Send size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-5">
          {/* Progress Timeline */}
          <div
            className="rounded-2xl p-6 space-y-5 relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, #1e0a3c 0%, #0f172a 100%)",
              boxShadow: "0 10px 40px rgba(124,58,237,0.2)",
            }}
          >
            <div
              className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)",
                transform: "translate(30%,-30%)",
              }}
            />
            <h3
              className="text-xs font-bold uppercase tracking-wider relative z-10"
              style={{ color: "#a78bfa" }}
            >
              Work Progress Status
            </h3>

            <div
              className="space-y-5 pl-5 relative z-10"
              style={{ borderLeft: "2px solid rgba(124,58,237,0.2)" }}
            >
              {[
                {
                  label: "TASK ACCEPTED",
                  note: "Accepted by Sarah Jenkins",
                  done: true,
                  color: "#a78bfa",
                },
                {
                  label: "TEAM AT VENUE",
                  note: null,
                  active: true,
                  color: "#7c3aed",
                },
                {
                  label: "PHOTOGRAPHY STARTED",
                  note: null,
                  done: false,
                  color: "#4b5563",
                },
              ].map((step, i) => (
                <div key={i} className="relative space-y-1.5">
                  <span
                    className="absolute -left-[26px] top-1 h-3 w-3 rounded-full"
                    style={{
                      background:
                        step.done || step.active
                          ? step.color
                          : "rgba(75,85,99,0.3)",
                      boxShadow: "0 0 0 4px #0f172a",
                    }}
                  />
                  <h4
                    className="text-[10px] font-black uppercase tracking-wider"
                    style={{
                      color: step.done || step.active ? step.color : "#4b5563",
                    }}
                  >
                    {step.label}
                  </h4>
                  {step.note && (
                    <p className="text-[10px] text-gray-500 font-medium">
                      {step.note}
                    </p>
                  )}
                  {step.active && (
                    <button
                      className="w-full text-white font-bold text-[10px] py-2 rounded-xl cursor-pointer mt-1"
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                        boxShadow: "0 3px 10px rgba(124,58,237,0.25)",
                      }}
                    >
                      Mark as Reached
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables */}
          <div
            className="rounded-2xl p-5 space-y-4"
            style={{
              background: "rgba(255,255,255,0.9)",
              border: "1px solid rgba(124,58,237,0.1)",
              boxShadow: "0 4px 20px rgba(124,58,237,0.06)",
            }}
          >
            <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
              Deliverables
            </h3>
            <p className="text-[10px] text-gray-400 font-medium">
              Upload raw drafts, clips, or final edited files here.
            </p>
            <div
              className="rounded-xl p-6 text-center space-y-2.5 cursor-pointer group transition-all"
              style={{
                border: "2px dashed rgba(124,58,237,0.2)",
                background: "rgba(124,58,237,0.03)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto"
                style={{ background: "rgba(124,58,237,0.1)", color: "#7c3aed" }}
              >
                <CloudUpload size={18} />
              </div>
              <p className="text-xs font-bold text-gray-700">
                Click or drag & drop
              </p>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                PNG, JPG or ZIP (max 800MB)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

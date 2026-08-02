"use client";

import React, { useState } from "react";

// ---- Data model: add/remove a zone here and both the cards and the map update ----
type Zone = {
  code: string;
  region: string;
  description: string;
  cx: number; // x position on the 0-400 map viewBox
  cy: number; // y position on the 0-360 map viewBox
};

const hub = { cx: 195, cy: 190 };

const zones: Zone[] = [
  {
    code: "A",
    region: "Dhaka Metropolitan",
    description:
      "Full-service coverage with same-day vendor confirmation across the capital.",
    cx: 195,
    cy: 190,
  },
  {
    code: "B",
    region: "Chattogram City",
    description:
      "Port-city logistics with dedicated coastal event vendors and transport partners.",
    cx: 300,
    cy: 270,
  },
  {
    code: "C",
    region: "Sylhet & Environs",
    description:
      "Local rates for hill-district venues, with regional transport pre-arranged.",
    cx: 295,
    cy: 70,
  },
  {
    code: "D",
    region: "Rajshahi & North",
    description:
      "Northern reach with vetted local vendors, no hidden long-haul fees.",
    cx: 80,
    cy: 100,
  },
];

export default function ServiceAreasSection() {
  const [activeCode, setActiveCode] = useState<string | null>(null);

  return (
    <section className="relative w-full overflow-hidden bg-black py-24 px-6">
      {/* ambient glow field */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-20 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #F59E0B 0%, transparent 70%)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-0 h-[420px] w-[420px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, #FB923C 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center">
        {/* ---- Left: copy + zone cards ---- */}
        <div>
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Service Areas
          </p>

          <h2
            className="mt-3 text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Zone-Based Planning
            <br />
            &amp; Pricing
          </h2>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400">
            Event logistics vary significantly by region. ZEYO offers
            zone-specific pricing to ensure you get the best local vendor
            rates and avoid hidden transportation fees.
          </p>

          <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {zones.map((zone) => {
              const isActive = activeCode === zone.code;
              return (
                <button
                  key={zone.code}
                  type="button"
                  onMouseEnter={() => setActiveCode(zone.code)}
                  onMouseLeave={() => setActiveCode(null)}
                  onFocus={() => setActiveCode(zone.code)}
                  onBlur={() => setActiveCode(null)}
                  className={[
                    "group rounded-xl border px-5 py-4 text-left transition-all duration-300",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
                    isActive
                      ? "border-amber-500/60 bg-gradient-to-br from-amber-950/60 to-black shadow-[0_0_30px_-8px_rgba(245,158,11,0.5)]"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]",
                  ].join(" ")}
                >
                  <span
                    className="text-xs font-semibold tracking-widest text-amber-400"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    ZONE {zone.code}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-white">
                    {zone.region}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---- Right: interactive map panel ---- */}
        <div className="relative pb-10 pl-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-black shadow-[0_30px_80px_-20px_rgba(245,158,11,0.25)]">
            {/* top nav bar */}
            <div className="flex items-center justify-end gap-4 border-b border-white/5 bg-white/[0.04] px-5 py-3">
              {["home", "calendar", "chart", "user", "search"].map((k) => (
                <span
                  key={k}
                  className="h-2 w-2 rounded-full bg-white/25"
                  aria-hidden
                />
              ))}
            </div>

            <svg
              viewBox="0 0 400 360"
              className="h-[360px] w-full"
              role="img"
              aria-label="Interactive map showing ZEYO's zone coverage with glowing markers over each region"
            >
              <defs>
                <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#FB923C" />
                </linearGradient>
                <radialGradient id="nodeGlow">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* faint grid backdrop, evokes a planning canvas */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 50} y1={0} x2={i * 50} y2={360} stroke="#ffffff" strokeOpacity={0.03} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`h${i}`} x1={0} y1={i * 50} x2={400} y2={i * 50} stroke="#ffffff" strokeOpacity={0.03} />
              ))}

              {/* connection routes between zones */}
              {zones
                .filter((z) => z.code !== "A")
                .map((zone) => {
                  const active = activeCode === zone.code || activeCode === "A";
                  return (
                    <g key={`line-${zone.code}`}>
                      <line
                        x1={hub.cx}
                        y1={hub.cy}
                        x2={zone.cx}
                        y2={zone.cy}
                        stroke="url(#lineGrad)"
                        strokeWidth={active ? 2 : 1}
                        strokeOpacity={active ? 0.9 : 0.3}
                        style={{ transition: "all 300ms ease" }}
                      />
                      <circle r="3" fill="#F59E0B" opacity={active ? 1 : 0.5}>
                        <animateMotion
                          dur={active ? "1.4s" : "3s"}
                          repeatCount="indefinite"
                          path={`M${hub.cx},${hub.cy} L${zone.cx},${zone.cy}`}
                        />
                      </circle>
                    </g>
                  );
                })}

              {/* zone nodes (Zone A doubles as the central hub) */}
              {zones.map((zone) => {
                const active = activeCode === zone.code;
                const isHub = zone.code === "A";
                return (
                  <g key={`node-${zone.code}`}>
                    <circle
                      cx={zone.cx}
                      cy={zone.cy}
                      r={active ? 22 : isHub ? 18 : 14}
                      fill="url(#nodeGlow)"
                      style={{ transition: "r 300ms ease" }}
                    />
                    <circle
                      cx={zone.cx}
                      cy={zone.cy}
                      r={active ? 7 : isHub ? 6 : 4.5}
                      fill={active || isHub ? "#F59E0B" : "#FB923C"}
                      stroke={isHub ? "#FDE68A" : "none"}
                      strokeWidth={isHub ? 2 : 0}
                      style={{ transition: "all 300ms ease" }}
                    />
                    <text
                      x={zone.cx}
                      y={zone.cy - 16}
                      textAnchor="middle"
                      fill={active ? "#FDE68A" : "#94A3B8"}
                      fontSize="11"
                      fontWeight={active ? 700 : 500}
                      style={{ transition: "all 300ms ease" }}
                    >
                      {zone.region.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* floating caption card, overlapping the panel like an annotation */}
          <div className="absolute -bottom-2 -left-2 flex max-w-[280px] items-center gap-3 rounded-xl border border-white/10 bg-white px-5 py-4 shadow-[0_20px_45px_-15px_rgba(0,0,0,0.5)]">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
                <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Interactive Planning Map
              </p>
              <p className="text-xs text-slate-500">
                Hover a zone to see package availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
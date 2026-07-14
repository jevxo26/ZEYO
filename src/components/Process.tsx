import { Compass, ClipboardCheck, Sparkles, type LucideIcon } from "lucide-react";

interface Step {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    number: "01",
    icon: Compass,
    title: "Select Zone & Event Type",
    description:
      "Choose your location and celebration type. Our system adapts pricing based on regional vendor availability and logistical requirements.",
  },
  {
    number: "02",
    icon: ClipboardCheck,
    title: "Choose Package or Custom",
    description:
      "Select from curated all-inclusive packages or build a bespoke plan using our smart builder tool with real-time budget tracking.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "We Manage Everything",
    description:
      "Relax while our dedicated concierge handles vendor vetting, coordination, and day-of execution to ensure your vision is flawless.",
  },
];

export function Process() {
  return (
    <section className="relative overflow-hidden bg-slate-50 px-6 py-24 sm:px-10">
      {/* Ambient background glow, echoes the hero gradient */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-200/40 via-blue-200/30 to-transparent blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        {/* Heading */}
        <div className="mx-auto max-w-xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
            Process
          </span>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Precision Planning in 3 Steps
          </h2>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Connecting line, desktop only */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-10 hidden h-px md:block"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(124,58,237,0.35) 0, rgba(124,58,237,0.35) 6px, transparent 6px, transparent 14px)",
            }}
          />

          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl hover:shadow-violet-200/60"
              >
                {/* Gradient ring on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 opacity-0 transition-opacity duration-300 [mask:linear-gradient(#fff,#fff)_content-box,linear-gradient(#fff,#fff)] [mask-composite:exclude] p-px group-hover:opacity-30" />

                {/* Faint background number */}
                <span className="pointer-events-none absolute right-5 top-3 text-5xl font-black text-slate-100 transition-colors duration-300 group-hover:text-violet-100 select-none">
                  {step.number}
                </span>

                <div className="relative">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-md shadow-violet-300/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>

                  <h3 className="relative z-10 mt-6 text-lg font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="relative z-10 mt-2 text-sm leading-relaxed text-slate-500">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
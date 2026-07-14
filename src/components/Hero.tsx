import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-[560px] w-full items-center overflow-hidden">
      {/* Background photo — replace src with your own image at /public/images/hero-bg.jpg */}
      <Image
        src="/images/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />

      {/* Purple-blue overlay so the text stays readable on any photo */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 via-purple-950/75 to-blue-950/50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-violet-700/20 via-transparent to-blue-500/20" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-24 sm:px-10">
        <div className="max-w-xl">
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl">
            Bangladesh&apos;s Smartest{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
              Event Planning
            </span>{" "}
            Platform.
          </h1>

          <p className="mt-5 text-base text-indigo-50/80 sm:text-lg">
            Plan, customize, and book your entire event in one place.
            Transparent pricing, managed vendors, and seamless execution for
            your grandest moments.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-opacity hover:opacity-90"
            >
              Browse Packages
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 rounded-md border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Calculator className="h-4 w-4" />
              Try Smart Calculator
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
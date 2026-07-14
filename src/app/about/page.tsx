
"use client";

import {
  CalendarDays,
  BadgeCheck,
  Star,
  ShieldCheck,
  CalendarCheck,
  Users,
  Wallet,
  HeartHandshake,
  CheckCircle2,
  ArrowRight,
  Sparkles, 
  Target,
  Eye, 
  Gem, Rocket,
  Lightbulb,
  Clock3,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Vendors",
    description: "Every vendor is carefully verified to ensure quality, professionalism, and reliability.",
  },
  {
    icon: CalendarCheck,
    title: "Smart Event Planning",
    description: "Organize every detail from booking to execution through one seamless platform.",
  },
  {
    icon: Wallet,
    title: "Transparent Pricing",
    description: "No hidden costs. Compare packages and know exactly what you're paying for.",
  },
  {
    icon: Users,
    title: "Personalized Packages",
    description: "Customize event packages based on your budget, guest count, and preferences.",
  },
  {
    icon: Clock3,
    title: "Save Time",
    description: "Skip endless searching and planning with our curated event solutions.",
  },
  {
    icon: Sparkles,
    title: "Memorable Experiences",
    description: "Our goal is to transform every celebration into an unforgettable experience.",
  },
];

const storyPoints = [
  "Premium event planning experience from start to finish.",
  "Verified vendors and transparent pricing you can trust.",
  "Personalized packages tailored to your unique celebration.",
  "Dedicated support to make every event stress-free.",
];

const values = [
  {
    icon: Gem,
    title: "Excellence",
    description: "We strive to deliver exceptional quality in every event we organize.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Modern technology and creative ideas make planning smarter and easier.",
  },
  {
    icon: HeartHandshake,
    title: "Trust",
    description: "Building long-term relationships through honesty and transparency.",
  },
  {
    icon: Rocket,
    title: "Growth",
    description: "Continuously improving our platform to create better event experiences.",
  },
];

const stats = [
  {
    icon: CalendarDays,
    number: "500+",
    title: "Events Organized",
    description: "From weddings to corporate events, we've helped create unforgettable moments.",
  },
  {
    icon: Users,
    number: "200+",
    title: "Verified Vendors",
    description: "Trusted photographers, decorators, caterers, and event professionals.",
  },
  {
    icon: BadgeCheck,
    number: "98%",
    title: "Client Satisfaction",
    description: "Our customers consistently rate us for quality, professionalism, and reliability.",
  },
  {
    icon: Star,
    number: "24/7",
    title: "Customer Support",
    description: "Our dedicated support team is always available whenever you need assistance.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50 py-16 lg:py-24">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
            <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-indigo-300/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div>
                <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-100/70 px-3.5 py-1.5 text-xs font-semibold text-violet-700">
                  ✨ Bangladesh's Modern Event Management Platform
                </span>

                <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:leading-tight">
                  Creating
                  <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    {" "}Unforgettable{" "}
                  </span>
                  Events Made Easy.
                </h1>

                <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 md:text-base md:leading-7">
                  EvenTo transforms your dream celebration into reality by connecting
                  you with trusted vendors, premium event packages, transparent pricing,
                  and effortless booking—all in one modern platform.
                </p>

                <div className="mt-8 flex flex-wrap gap-3.5">
                  <a
                    href="/packages"
                    className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg"
                  >
                    Explore Packages
                  </a>
                  <a
                    href="/contact"
                    className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-violet-400 hover:text-violet-700"
                  >
                    Contact Us
                  </a>
                </div>

                {/* Inline Stats */}
                <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                  <div>
                    <h3 className="text-xl font-bold text-violet-700 md:text-2xl">500+</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Events Organized</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-violet-700 md:text-2xl">200+</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Trusted Vendors</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-violet-700 md:text-2xl">98%</h3>
                    <p className="mt-0.5 text-xs text-slate-500">Happy Clients</p>
                  </div>
                </div>
              </div>

              {/* Right Side Image */}
              <div className="relative mt-8 lg:mt-0">
                <div className="absolute -left-4 -top-4 h-full w-full rounded-[32px] bg-gradient-to-r from-violet-500 to-blue-500 opacity-15 blur-xl"></div>
                <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white shadow-xl">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1200"
                    alt="Wedding Event"
                    className="h-[350px] sm:h-[450px] lg:h-[500px] w-full object-cover"
                  />
                </div>

                {/* Floating Card */}
                <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white p-4 shadow-xl hidden sm:block">
                  <p className="text-2xl font-bold text-violet-700">500+</p>
                  <p className="text-xs text-slate-500 font-medium">Memorable Events Managed</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative overflow-hidden bg-white py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-violet-200/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="mx-auto max-w-3xl text-center">
              <span className="rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold text-violet-700">
                Why Choose EvenTo
              </span>
              <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl">
                Everything You Need for a
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}Perfect Event
                </span>
              </h2>
              <p className="mt-4 text-sm leading-6 text-slate-600 md:text-base">
                We combine technology, trusted vendors, and premium event planning
                services to make every celebration stress-free and unforgettable.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md"
                  >
                    <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600" />
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-5 text-slate-600 md:text-sm md:leading-6">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white py-20">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-violet-200/30 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-200/20 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
            {/* Left Image */}
            <div className="relative order-last lg:order-first">
              <div className="overflow-hidden rounded-3xl shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1200"
                  alt="Event"
                  className="h-[400px] sm:h-[500px] w-full object-cover transition duration-500 hover:scale-103"
                />
              </div>

              <div className="absolute -bottom-6 -right-4 rounded-2xl bg-white p-4 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white">
                    <HeartHandshake size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">500+</h3>
                    <p className="text-xs text-slate-500">Happy Celebrations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Content */}
            <div>
              <span className="rounded-full bg-violet-100 px-4 py-1.5 text-xs font-semibold text-violet-700">
                Our Story
              </span>

              <h2 className="mt-5 text-2xl font-bold text-slate-900 sm:text-3xl md:text-4xl md:leading-tight">
                Turning Your
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">
                  {" "}Dream Events{" "}
                </span>
                Into Reality
              </h2>

              <p className="mt-5 text-sm leading-6 text-slate-600 md:text-base">
                EvenTo was founded with a simple vision—to make event planning
                effortless, transparent, and enjoyable. From intimate family
                gatherings to grand weddings and corporate celebrations, we believe
                every event deserves exceptional planning and unforgettable memories.
              </p>

              <div className="mt-6 space-y-3.5">
                {storyPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100">
                      <CheckCircle2 size={14} className="text-violet-600" />
                    </div>
                    <p className="text-xs text-slate-700 md:text-sm">
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="/packages"
                className="group mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:scale-105"
              >
                Explore Packages
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        {/* Purpose & Core Values Section */}
        <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-24 top-20 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-300">
                Our Purpose
              </span>
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl md:text-4xl">
                Driven by
                <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                  {" "}Passion & Innovation
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xs leading-5 text-slate-400 md:text-sm md:leading-6">
                Everything we build is centered around creating seamless, memorable,
                and stress-free event experiences for our customers.
              </p>
            </div>

            {/* Mission & Vision */}
            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600">
                  <Target size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold">Our Mission</h3>
                <p className="mt-3 text-xs leading-5 text-slate-400 md:text-sm md:leading-6">
                  To simplify event planning by connecting people with trusted
                  vendors, premium packages, and smart digital tools that make every
                  celebration effortless and unforgettable.
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500">
                  <Eye size={22} />
                </div>
                <h3 className="mt-5 text-xl font-bold">Our Vision</h3>
                <p className="mt-3 text-xs leading-5 text-slate-400 md:text-sm md:leading-6">
                  To become Bangladesh's leading event management platform, empowering
                  people to celebrate life's most meaningful moments with confidence,
                  creativity, and convenience.
                </p>
              </div>
            </div>

            {/* Core Values sub-grid */}
            <div className="mt-20">
              <h3 className="text-center text-xl font-bold sm:text-2xl">Our Core Values</h3>
              <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div
                      key={value.title}
                      className="rounded-xl border border-white/5 bg-white/5 p-5 text-center backdrop-blur-md transition-transform duration-300 hover:-translate-y-1"
                    >
                      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600">
                        <Icon size={20} />
                      </div>
                      <h4 className="mt-4 text-base font-bold">{value.title}</h4>
                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Stats & Impact Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-blue-700 py-20 text-white">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-10 top-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-10 bottom-10 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur">
                Our Impact
              </span>
              <h2 className="mt-5 text-2xl font-bold sm:text-3xl md:text-4xl">
                Numbers That Reflect Our Commitment
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-xs leading-5 text-violet-100 md:text-sm">
                Behind every successful celebration is a dedicated team committed to
                excellence, innovation, and creating unforgettable experiences.
              </p>
            </div>

            {/* Stats Items Grid */}
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
                      <Icon size={22} />
                    </div>
                    <h3 className="mt-5 text-3xl font-extrabold md:text-4xl">{item.number}</h3>
                    <h4 className="mt-1.5 text-sm font-semibold">{item.title}</h4>
                    <p className="mt-2 text-xs leading-5 text-violet-100">{item.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Banner */}
            <div className="mt-16 rounded-2xl border border-white/15 bg-white/10 p-6 md:p-8 backdrop-blur-md">
              <div className="grid items-center gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-xl font-bold sm:text-2xl">
                    Every Celebration Deserves Perfection
                  </h3>
                  <p className="mt-3 text-xs leading-5 text-violet-100 md:text-sm md:leading-6">
                    We believe every event is unique. That's why we combine experienced
                    vendors, personalized packages, and innovative technology to ensure
                    every celebration becomes a lasting memory.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/5 p-4 text-center">
                    <h4 className="text-xl font-bold md:text-2xl">5+</h4>
                    <p className="mt-1 text-xs text-violet-100">Years Experience</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4 text-center">
                    <h4 className="text-xl font-bold md:text-2xl">50+</h4>
                    <p className="mt-1 text-xs text-violet-100">Event Categories</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4 text-center">
                    <h4 className="text-xl font-bold md:text-2xl">1000+</h4>
                    <p className="mt-1 text-xs text-violet-100">Happy Guests</p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4 text-center">
                    <h4 className="text-xl font-bold md:text-2xl">99%</h4>
                    <p className="mt-1 text-xs text-violet-100">On-Time Delivery</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}


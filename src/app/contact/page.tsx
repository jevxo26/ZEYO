"use client";

import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const contactDetails = [
  {
    icon: Phone,
    title: "Call Us",
    info: "+880 17XX-XXXXXX",
    description: "Mon-Sat from 9am to 7pm.",
  },
  {
    icon: Mail,
    title: "Email Us",
    info: "info@evento.com",
    description: "Our support team will reply within 24 hours.",
  },
  {
    icon: MapPin,
    title: "Visit Our Office",
    info: "Gulshan-2, Dhaka, Bangladesh",
    description: "Come say hello at our headquarters.",
  },
  {
    icon: Clock,
    title: "Working Hours",
    info: "9:00 AM - 8:00 PM",
    description: "Available 24/7 for premium booked events.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // এখানে আপনার ফর্ম সাবমিট লজিক বা API কল যুক্ত করতে পারেন
    console.log("Form Submitted:", formData);
    alert("Thank you! Your message has been sent successfully.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-violet-50 py-16 lg:py-20">
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -left-24 top-0 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl" />
            <div className="absolute -right-20 top-20 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
          </div>

          <div className="mx-auto max-w-7xl px-6 text-center">
            <span className="inline-flex items-center rounded-full border border-violet-200 bg-violet-100/70 px-3.5 py-1.5 text-xs font-semibold text-violet-700">
              💬 Get in Touch with EvenTo
            </span>

            <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
              Let's Plan Your Next
              <span className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                {" "}Unforgettable{" "}
              </span>
              Event
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base md:leading-7">
              Have questions about our packages, vendors, or custom planning? 
              Drop us a message, and our expert event planners will get back to you shortly.
            </p>
          </div>
        </section>

        {/* Contact Content Section */}
        <section className="relative bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-12 lg:grid-cols-5">
              
              {/* Left Side: Contact Info Info Cards */}
              <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl bg-slate-900 p-6 text-white shadow-md">
                  <h3 className="text-lg font-bold sm:text-xl">Contact Information</h3>
                  <p className="mt-2 text-xs text-slate-400">
                    Fill out the form and our team will guide you to lock the best deals for your celebration.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {contactDetails.map((detail) => {
                    const Icon = detail.icon;
                    return (
                      <div
                        key={detail.title}
                        className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-600 to-blue-600" />
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-sm">
                            <Icon size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{detail.title}</h4>
                            <p className="mt-1 text-xs font-semibold text-violet-700 md:text-sm">{detail.info}</p>
                            <p className="mt-0.5 text-[11px] text-slate-500">{detail.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Side: Interactive Contact Form */}
              <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8 lg:col-span-3">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Send us a Message</h3>
                    <p className="text-xs text-slate-500">We respond to inquiries real quick!</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none transition focus:border-violet-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none transition focus:border-violet-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Wedding Event Package Query"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none transition focus:border-violet-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700">Message / Event Requirements</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your estimated guest count, date, budget, and expectations..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-xs outline-none transition focus:border-violet-500 focus:bg-white resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Send Message</span>
                    <Send size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </form>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Quick Banner */}
        <section className="relative overflow-hidden bg-slate-900 py-16 text-white">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
          </div>

          <div className="mx-auto max-w-5xl px-6 text-center">
            <h3 className="text-xl font-bold sm:text-2xl">Want faster answers?</h3>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-400 md:text-sm">
              Check out our pre-made event packages or jump straight to planning with verified vendors.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/packages"
                className="group inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-5 py-2.5 text-xs font-semibold transition hover:bg-white/20"
              >
                View Packages
                <ArrowRight size={14} className="transition group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
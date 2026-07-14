"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
    Mail, 
    Phone, 
    MapPin, 
    Send, 
    Check,
    ArrowRight
} from "lucide-react";
import { 
    FaFacebook, 
    FaTwitter, 
    FaInstagram, 
    FaLinkedin, 
    FaGithub 
} from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Footer() {
    const [email, setEmail] = useState("");
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!trimmedEmail) return;
        setIsLoading(true);
        // Simulate a smooth API subscription delay
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsLoading(false);
        setIsSubscribed(true);
        setEmail("");
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full relative z-10 border-t border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md overflow-hidden">
            {/* Visual glow decoration */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-indigo-200/10 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-purple-200/10 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none translate-y-1/2"></div>

            <div className="max-w-6xl mx-auto px-6 pt-16 pb-12 relative z-10">
                {/* Main Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8 mb-16">
                    {/* Brand / Logo Info (Col 1-2) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="flex items-center space-x-2">
                            {/* Stylish Geometric Mini-logo */}
                            <Link href="/" className="flex items-baseline gap-2">
          <span className="text-[15px] font-bold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            EVENTO
          </span>
          <span className="hidden lg:inline text-[11px] font-medium text-slate-400 tracking-wide">
            — Every moment, perfectly planned
          </span>
        </Link>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                            Empowering modern event orchestration and digital vendor integration. Discover premium, beautiful, and tailored planning solutions.
                        </p>
                        
                        {/* Social Icons with interactive states */}
                        <div className="flex items-center space-x-3 pt-2">
                            {[
                                { Icon: FaFacebook, href: "https://facebook.com", label: "Facebook" },
                                { Icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
                                { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
                                { Icon: FaLinkedin, href: "https://linkedin.com", label: "LinkedIn" },
                                { Icon: FaGithub, href: "https://github.com", label: "GitHub" },
                            ].map(({ Icon, href, label }, idx) => (
                                <a
                                    key={idx}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/50 dark:hover:border-indigo-500/30 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:-translate-y-1 hover:scale-105 transition-all duration-300 shadow-sm"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Services Links (Col 3) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Services
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                "Photography",
                                "Venue Booking",
                                "Catering Services",
                                "Sound & Lighting",
                                "Event Planning"
                            ].map((service, idx) => (
                                <li key={idx}>
                                    <Link 
                                        href={`/services/${service.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 inline-flex items-center group/link hover:translate-x-1"
                                    >
                                        <ArrowRight size={12} className="opacity-0 w-0 group-hover/link:opacity-100 group-hover/link:w-3 group-hover/link:mr-1 transition-all duration-200 text-indigo-500" />
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links (Col 4) */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
                            {[
                                { name: "Track Order", href: "/TrackOrder" },
                                { name: "Wishlist", href: "/Wishlist" },
                                { name: "Cart", href: "/Cart" },
                                { name: "About Us", href: "/about" },
                                { name: "Contact Us", href: "/contact" }
                            ].map((link, idx) => (
                                <li key={idx}>
                                    <Link 
                                        href={link.href}
                                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 inline-flex items-center group/link hover:translate-x-1"
                                    >
                                        <ArrowRight size={12} className="opacity-0 w-0 group-hover/link:opacity-100 group-hover/link:w-3 group-hover/link:mr-1 transition-all duration-200 text-indigo-500" />
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info & Newsletter (Col 5-6) */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Contact Us
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-start space-x-3 text-sm text-slate-600 dark:text-slate-400">
                                    <MapPin size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                                    <span>123 Gulshan Ave, Gulshan 1, Dhaka 1212</span>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                                    <Phone size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                                    <a href="tel:+8801700000000" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        +880 1700 000 000
                                    </a>
                                </li>
                                <li className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                                    <Mail size={16} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                                    <a href="mailto:hello@finora.com" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        hello@evento.com
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter subscription form */}
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Subscribe to Newsletter
                            </h3>
                            {isSubscribed ? (
                                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 dark:bg-emerald-500/5 px-3 py-2 rounded-xl border border-emerald-500/20 max-w-sm transition-all duration-300 animate-in fade-in zoom-in-95">
                                    <Check size={16} className="shrink-0" />
                                    <span className="text-sm font-medium">Thank you for subscribing!</span>
                                </div>
                            ) : (
                                <form onSubmit={handleSubscribe} className="flex gap-2 w-full max-w-sm">
                                    <Input
                                        type="email"
                                        required
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-9 px-3 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-indigo-500/30 rounded-xl"
                                    />
                                    <Button
                                        type="submit"
                                        size="sm"
                                        disabled={isLoading}
                                        className="h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md hover:shadow-indigo-500/25 transition-all flex items-center justify-center disabled:opacity-75"
                                    >
                                        {isLoading ? (
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <Send size={14} />
                                        )}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Copyright & Legal links */}
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        &copy; {currentYear} EVENTO  Inc. All rights reserved.
                    </p>
                    <div className="flex space-x-6">
                        {[
                            { name: "Privacy Policy", href: "/privacy" },
                            { name: "Terms of Service", href: "/terms" },
                            { name: "Cookie Settings", href: "/cookies" },
                        ].map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.href}
                                className="text-xs text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
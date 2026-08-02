"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Mail, Lock, Building2, Phone } from "lucide-react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { AppDispatch } from "@/store/store";

export default function VendorRegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Mock API call to create vendor user
      const newVendorUser = {
        id: `V-USER-${Date.now().toString().slice(-6)}`,
        name: formData.businessName,
        email: formData.email,
        phone: formData.phone,
        role: "vendor",
        status: "PENDING_VERIFICATION",
        supportedServiceKeys: [],
        supportedZoneIds: [],
        rating: 5.0,
        jobsCompleted: 0,
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(formData.businessName) + "&background=6366f1&color=fff",
      };

      try {
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        users.push(newVendorUser);
        localStorage.setItem("users", JSON.stringify(users));

        localStorage.setItem("user", JSON.stringify(newVendorUser));
        localStorage.setItem("accessToken", "mock-jwt-token-vendor-" + Date.now());

        dispatch(setCredentials({ user: newVendorUser as any, token: "mock-jwt-token" }));
        toast.success("Vendor application submitted successfully!");
        
        router.push("/dashboard");
      } catch (err) {
        toast.error("Registration failed. Please try again.");
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-100/40 via-white to-purple-50/40"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:w-[480px] lg:px-20 mx-auto lg:mx-0 lg:ml-24 xl:ml-32">
        <div className="w-full max-w-sm mx-auto lg:w-96">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase className="w-8 h-8 text-indigo-600" />
              <span className="font-display-evento text-2xl font-bold tracking-tight text-slate-900">EVENTO <span className="text-indigo-600">Partners</span></span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Become a Vendor</h2>
            <p className="mt-2 text-sm text-slate-500">
              Join Bangladesh's premier event management OS and start receiving verified bookings.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Business Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g. Royal Photo Studio"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting Application..." : "Apply as Vendor"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-500">
              Already a partner?{" "}
              <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
                Sign in to portal
              </Link>
            </div>
            
            <div className="mt-4 text-center text-sm text-slate-500">
              Looking to book an event?{" "}
              <Link href="/register" className="font-semibold text-violet-600 hover:text-violet-500 transition-colors">
                Sign up as Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="hidden lg:block relative w-0 flex-1">
        <img
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"
          alt="Event Vendors"
        />
        <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-[2px] mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute bottom-12 left-12 right-12 text-white">
          <h3 className="text-3xl font-display-evento font-bold mb-4">Grow your business with EVENTO</h3>
          <p className="text-lg text-indigo-100 max-w-xl">
            Focus on what you do best. We handle the marketing, booking, payments, and client coordination.
          </p>
        </div>
      </div>
    </div>
  );
}

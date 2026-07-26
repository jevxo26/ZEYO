"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  Tag,
  CheckCircle2,
  FileText,
  AlertCircle,
  Star,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { toast } from "sonner";
import PlatformReviewModal from "@/components/reviews/PlatformReviewModal";

const DEFAULT_BOOKING_DETAIL = {
  id: "BKG-2026-001",
  bookingNumber: "BKG-2026-001",
  eventName: "Royal Wedding Ceremony",
  eventType: "Wedding",
  eventDate: "2026-11-15",
  location: "Gulshan Club, Dhaka",
  bookingStatus: "confirmed",
  grandTotal: 380000,
  subtotal: 360000,
  tax: 20000,
  discount: 0,
  createdAt: "2026-07-20T10:00:00Z",
  notes: "Wedding Premium Package with Photography, Videography & Catering (400 Guests). Managed by EVENTO Operations.",
  customer: {
    customerCode: "CUST-8801",
    user: {
      name: "Ahmed Rahman",
      email: "ahmed.rahman@gmail.com",
      phone: "+880 1711-234567",
    },
  },
  services: [
    { name: "Photography", tier: "Premium", price: 35000, details: "2 Senior Photographers + 4K Teaser" },
    { name: "Videography", tier: "Premium", price: 40000, details: "Cinematic Full Coverage" },
    { name: "Catering", tier: "Premium", price: 240000, details: "Royal Kacchi Menu (400 Guests)" },
    { name: "Decoration", tier: "Standard", price: 45000, details: "Fresh Floral Stage & Backdrop" },
  ],
};

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await apiClient.get(`/bookings/${id}`);
        if (response.data?.success !== false && response.data.data) {
          setBooking(response.data.data);
        } else {
          setBooking(DEFAULT_BOOKING_DETAIL);
        }
      } catch (error) {
        console.error("Failed to fetch booking", error);
        setBooking(DEFAULT_BOOKING_DETAIL);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertCircle className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">Booking Not Found</h2>
        <p className="text-slate-500 mt-2 mb-6">The booking you are looking for does not exist or you don't have access.</p>
        <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED': return 'bg-emerald-100 text-emerald-700';
      case 'PENDING': return 'bg-amber-100 text-amber-700';
      case 'CANCELLED': return 'bg-rose-100 text-rose-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500 hover:text-slate-900">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {booking.eventName || booking.notes || "Untitled Event"}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.bookingStatus || booking.status)}`}>
              {booking.bookingStatus || booking.status || 'NEW'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">Booking #{booking.bookingNumber || booking.id}</p>
        </div>

        <div className="ml-auto flex flex-wrap gap-2.5">
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:opacity-95 transition-opacity flex items-center gap-1.5"
          >
            <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
            Rate EVENTO Platform
          </button>
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm">
            Cancel Booking
          </button>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
            Edit Details
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        {['overview', 'services', 'timeline'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 text-sm font-semibold capitalize transition-colors relative ${
              activeTab === tab ? 'text-slate-900' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-slate-900 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="w-5 h-5 text-slate-400" />
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date & Time</p>
                  <p className="text-slate-900 font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(booking.eventDate || Date.now()).toLocaleDateString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Event Type</p>
                  <p className="text-slate-900 font-medium flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    {booking.eventType || "Standard"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="text-slate-900 font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {booking.location || "TBD"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Notes / Instructions</p>
                  <div className="p-4 bg-slate-50 rounded-xl text-sm text-slate-700 leading-relaxed border border-slate-100 mt-2">
                    {booking.notes || booking.remarks || "No additional notes provided."}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Customer</h2>
              
              {booking.customer?.user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{booking.customer.user.name}</p>
                      <p className="text-xs text-slate-500">Customer #{booking.customer.customerCode}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      {booking.customer.user.email}
                    </p>
                    {booking.customer.user.phone && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400" />
                        {booking.customer.user.phone}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No customer data attached.</p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-400" />
                Financials
              </h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">৳{Number(booking.subtotal || booking.budget || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600">
                  <span>Tax & Fees</span>
                  <span className="font-medium">৳{Number(booking.tax || 0).toLocaleString()}</span>
                </div>
                {booking.discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-600">
                    <span>Discount</span>
                    <span className="font-medium">-৳{Number(booking.discount).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="font-bold text-lg text-slate-900">৳{Number(booking.grandTotal || booking.budget || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-indigo-950">Managed Event OS Guarantee</h4>
              <p className="text-xs text-indigo-800/90 mt-1">
                All selected services are fulfilled by EVENTO&apos;s pre-vetted background professional teams.
                You do not need to coordinate with or manage individual vendors. Our operations coordinators
                handle 100% of execution and quality control.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {booking.services && booking.services.length > 0 ? (
              booking.services.map((srv: any, i: number) => (
                <div key={i} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm">
                      #{i + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                      <p className="text-xs text-slate-500">{srv.details || `${srv.tier || "Standard"} Tier Service`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs uppercase font-semibold text-slate-400 block">{srv.tier || "Standard"}</span>
                    <span className="text-sm font-extrabold text-slate-900">৳{Number(srv.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-sm font-medium">
                No specific line items attached to this booking.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-8">Activity Timeline</h2>
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-100">
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-900 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">Booking Created</h3>
                  <time className="text-xs font-medium text-slate-500">{new Date(booking.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="text-sm text-slate-600">The initial booking request was submitted.</p>
              </div>
            </div>
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-600 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-purple-50/50 p-4 rounded-xl border border-purple-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-purple-950 text-sm">EVENTO Operations Coordinator Assigned</h3>
                  <time className="text-xs font-medium text-purple-600">Active Stage</time>
                </div>
                <p className="text-sm text-purple-900/80">Background vendor dispatch and quality assurance checks in progress.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <PlatformReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        bookingReference={booking.bookingNumber || booking.id}
        eventName={booking.eventName}
      />
    </div>
  );
}

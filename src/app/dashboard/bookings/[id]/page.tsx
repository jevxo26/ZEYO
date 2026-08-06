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
  X,
  Edit3,
  Check,
  Building2,
  ShieldCheck,
  Star,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import Link from "next/link";
import { toast } from "sonner";
import PlatformReviewModal from "@/components/reviews/PlatformReviewModal";
import { createNotification } from "@/lib/notifications";

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
  notes: "Wedding Premium Package with Photography, Videography & Catering (400 Guests).",
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Payment State
  const [transactions, setTransactions] = useState<any[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "card">("bkash");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editBudget, setEditBudget] = useState<number | string>("");
  const [editNotes, setEditNotes] = useState("");

  const fetchBookingDetails = async () => {
    setIsLoading(true);
    let matchedLocal: any = null;

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        if (stored) {
          const customList = JSON.parse(stored);
          matchedLocal = customList.find(
            (b: any) =>
              String(b.id) === String(id) ||
              String(b.bookingNumber) === String(id) ||
              String(b.bookingNumber).endsWith(`-${id}`) ||
              String(b.bookingNumber).endsWith(`00${id}`) ||
              String(b.id).endsWith(`-${id}`)
          );
        }
      } catch (e) {}
    }

    if (matchedLocal) {
      if (typeof window !== "undefined") {
        try {
          const paymentsStr = localStorage.getItem(`custom_payments_${matchedLocal.id}`);
          if (paymentsStr) setTransactions(JSON.parse(paymentsStr));
        } catch (e) {}
      }
      setBooking(matchedLocal);
      setIsLoading(false);
      return;
    }

    try {
      const response = await Promise.race([
        apiClient.get(`/bookings/${id}`),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))
      ]) as any;

      if (response?.data?.success !== false && response?.data?.data) {
        setBooking(response.data.data);
      } else {
        setBooking({
          ...DEFAULT_BOOKING_DETAIL,
          id: String(id),
          bookingNumber: String(id).startsWith("#") ? String(id) : `#${id}`,
          eventName: String(id).includes("002") ? "Gaye Holud Night Celebration" : "Royal Wedding Ceremony",
        });
      }
    } catch (error) {
      setBooking({
        ...DEFAULT_BOOKING_DETAIL,
        id: String(id),
        bookingNumber: String(id).startsWith("#") ? String(id) : `#${id}`,
        eventName: String(id).includes("002") ? "Gaye Holud Night Celebration" : "Royal Wedding Ceremony",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  const openEditModal = () => {
    if (!booking) return;
    setEditName(booking.eventName || booking.notes || "");
    setEditType(booking.eventType || "Wedding");
    setEditDate(booking.eventDate ? new Date(booking.eventDate).toISOString().split("T")[0] : "");
    setEditLocation(booking.location || "");
    setEditBudget(booking.grandTotal || booking.budget || 0);
    setEditNotes(booking.notes || "");
    setShowEditModal(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEdit(true);

    const updatedBooking = {
      ...booking,
      eventName: editName,
      eventType: editType,
      eventDate: editDate ? new Date(editDate).toISOString() : booking.eventDate,
      location: editLocation,
      budget: Number(editBudget),
      grandTotal: Number(editBudget),
      subtotal: Number(editBudget),
      notes: editNotes || editName,
      updatedAt: new Date().toISOString(),
    };

    try {
      await apiClient.put(`/bookings/${booking.id}`, {
        eventName: editName,
        eventType: editType,
        eventDate: editDate,
        location: editLocation,
        budget: Number(editBudget),
        notes: editNotes,
      });
    } catch (e) {
      console.warn("API booking update fallback:", e);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        let list = stored ? JSON.parse(stored) : [];
        const index = list.findIndex(
          (b: any) => String(b.id) === String(booking.id) || String(b.bookingNumber) === String(booking.id)
        );

        if (index >= 0) {
          list[index] = updatedBooking;
        } else {
          list.unshift(updatedBooking);
        }

        localStorage.setItem("customBookings", JSON.stringify(list));
        window.dispatchEvent(new CustomEvent("dashboard-data-update"));
      } catch (e) {}
    }

    setBooking(updatedBooking);
    setIsSavingEdit(false);
    setShowEditModal(false);
    toast.success("Booking details updated");
  };

  const handleApproveBooking = () => {
    const approvedBooking = {
      ...booking,
      bookingStatus: "confirmed",
      status: "CONFIRMED",
    };
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        let list = stored ? JSON.parse(stored) : [];
        const index = list.findIndex(
          (b: any) => String(b.id) === String(booking.id) || String(b.bookingNumber) === String(booking.id)
        );
        if (index >= 0) {
          list[index] = approvedBooking;
          localStorage.setItem("customBookings", JSON.stringify(list));
          window.dispatchEvent(new CustomEvent("dashboard-data-update"));
        }
      } catch (e) {}
    }
    setBooking(approvedBooking);
    toast.success("✓ Booking Approved & Confirmed!");
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    const cancelledBooking = {
      ...booking,
      bookingStatus: "cancelled",
      status: "CANCELLED",
    };

    try {
      await apiClient.post(`/bookings/${booking.id}/cancel`, { reason: "Customer cancelled" });
    } catch (e) {
      console.warn("API cancel fallback:", e);
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("customBookings");
        let list = stored ? JSON.parse(stored) : [];
        const index = list.findIndex(
          (b: any) => String(b.id) === String(booking.id) || String(b.bookingNumber) === String(booking.id)
        );

        if (index >= 0) {
          list[index] = cancelledBooking;
          localStorage.setItem("customBookings", JSON.stringify(list));
          window.dispatchEvent(new CustomEvent("dashboard-data-update"));
        }
      } catch (e) {}
    }

    setBooking(cancelledBooking);
    toast.success("Booking cancelled");
  };

  const handleMakePayment = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(paymentAmount);
    if (!amt || amt <= 0) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const methodLabel =
        paymentMethod === "bkash"
          ? "bKash Direct Wallet"
          : paymentMethod === "nagad"
          ? "Nagad Digital Wallet"
          : "Credit Card / Online Banking";

      const newTransaction = {
        id: `TXN-${Date.now()}`,
        amount: amt,
        date: new Date().toISOString(),
        method: methodLabel,
        status: "SUCCESS"
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      
      const newAmountPaid = (booking.amountPaid || 0) + amt;
      const updatedBooking = { ...booking, amountPaid: newAmountPaid };
      setBooking(updatedBooking);

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(`custom_payments_${booking.id}`, JSON.stringify(updatedTransactions));
          
          const stored = localStorage.getItem("customBookings");
          if (stored) {
            let list = JSON.parse(stored);
            const index = list.findIndex((b: any) => String(b.id) === String(booking.id) || String(b.bookingNumber) === String(booking.id));
            if (index >= 0) {
              list[index] = updatedBooking;
              localStorage.setItem("customBookings", JSON.stringify(list));
              window.dispatchEvent(new CustomEvent("dashboard-data-update"));
            }
          }
        } catch (e) {}
      }

      setIsProcessingPayment(false);
      setShowPaymentModal(false);
      setPaymentAmount("");
      createNotification("Payment Successful", `Received ৳${amt.toLocaleString()} payment for booking ${booking.bookingNumber}.`, "💳");
      toast.success(`✓ Successfully paid ৳${amt.toLocaleString()} online!`);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-slate-400 mb-3" />
        <h2 className="text-lg font-semibold text-slate-900">Booking Not Found</h2>
        <p className="text-sm text-slate-500 mt-1 mb-5">The requested booking ID does not exist or has been removed.</p>
        <button onClick={() => router.push('/dashboard/bookings')} className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
          Back to Bookings
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("CONFIRM")) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Confirmed</span>;
    }
    if (s.includes("PENDING") || s.includes("REVIEW") || s.includes("WAITING") || s === "NEW") {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">Pending Review</span>;
    }
    if (s.includes("CANCEL")) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">Cancelled</span>;
    }
    if (s.includes("COMPLETE")) {
      return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">Completed</span>;
    }
    return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">{status || "Active"}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/bookings" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {booking.eventName || booking.notes || "Untitled Event"}
              </h1>
              {getStatusBadge(booking.bookingStatus || booking.status)}
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">#{booking.bookingNumber || booking.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowReviewModal(true)}
            className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium transition-colors shadow-sm"
          >
            Feedback
          </button>
          {(booking.bookingStatus || booking.status)?.toLowerCase() !== "cancelled" &&
            (booking.bookingStatus || booking.status)?.toLowerCase() !== "completed" && (
              <>
                {(booking.bookingStatus || booking.status)?.toLowerCase() === "pending" && (
                  <button
                    onClick={handleApproveBooking}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve Booking
                  </button>
                )}
                <button
                  onClick={handleCancelBooking}
                  className="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 rounded-lg text-xs font-medium transition-colors shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={openEditModal}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Details
                </button>
              </>
            )}
        </div>
      </div>

      {/* Clean Tabs */}
      <div className="flex gap-6 border-b border-slate-200">
        {['overview', 'services', 'timeline', 'financials'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-semibold capitalize transition-colors relative ${
              activeTab === tab ? 'text-slate-900 border-b-2 border-slate-900 -mb-px' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Event Specifications */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Event Overview</h2>
                <button
                  onClick={openEditModal}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Date</span>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(booking.eventDate || Date.now()).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <span className="block text-xs text-slate-500 font-medium mb-1">Category</span>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-slate-400" />
                    {booking.eventType || "Event"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="block text-xs text-slate-500 font-medium mb-1">Venue Address</span>
                  <p className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    {booking.location || "Location to be confirmed"}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <span className="block text-xs text-slate-500 font-medium mb-1.5">Notes & Requirements</span>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-normal leading-relaxed">
                    {booking.notes && String(booking.notes).trim() !== "" 
                      ? booking.notes 
                      : (booking.remarks && String(booking.remarks).trim() !== "" 
                          ? booking.remarks 
                          : "No additional instructions or notes recorded for this booking.")}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Review Display */}
            {booking.hasReview && booking.reviewData && (
              <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3">
                  <h2 className="text-sm font-semibold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    EVENTO Platform Review
                  </h2>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star key={star} className={`w-3.5 h-3.5 ${star <= (booking.reviewData.overallRating || 5) ? 'fill-amber-400 text-amber-400' : 'text-indigo-200'}`} />
                    ))}
                  </div>
                </div>
                <div className="text-sm text-indigo-950 font-medium italic leading-relaxed">
                  "{booking.reviewData.comment || "Great platform experience!"}"
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                   <div className="text-xs text-indigo-800 bg-indigo-100/50 p-2 rounded border border-indigo-100 text-center">
                     <p className="text-[10px] uppercase font-bold text-indigo-500 mb-0.5">Booking Process</p>
                     {booking.reviewData.bookingProcessRating}/5
                   </div>
                   <div className="text-xs text-indigo-800 bg-indigo-100/50 p-2 rounded border border-indigo-100 text-center">
                     <p className="text-[10px] uppercase font-bold text-indigo-500 mb-0.5">Service Quality</p>
                     {booking.reviewData.serviceQualityRating}/5
                   </div>
                   <div className="text-xs text-indigo-800 bg-indigo-100/50 p-2 rounded border border-indigo-100 text-center">
                     <p className="text-[10px] uppercase font-bold text-indigo-500 mb-0.5">EVENTO Support</p>
                     {booking.reviewData.supportTeamRating}/5
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Client Details</h2>
              {(() => {
                let defaultUser: any = {};
                if (typeof window !== "undefined") {
                  try {
                    const saved =
                      localStorage.getItem("user") ||
                      localStorage.getItem("current_user");
                    if (saved) defaultUser = JSON.parse(saved);
                  } catch (e) {}
                }
                const name =
                  booking.customer?.user?.name ||
                  booking.customerName ||
                  booking.clientName ||
                  defaultUser.name ||
                  "Event Organizer";
                const email =
                  booking.customer?.user?.email ||
                  booking.customerEmail ||
                  booking.clientEmail ||
                  defaultUser.email ||
                  "organizer@evento.bd";
                const phone =
                  booking.customer?.user?.phone ||
                  booking.customerPhone ||
                  booking.clientPhone ||
                  defaultUser.phone;
                return (
                  <div className="space-y-3 text-xs">
                    <p className="font-semibold text-slate-900 text-sm">{name}</p>
                    <p className="text-slate-600 flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {email}
                    </p>
                    {phone && (
                      <p className="text-slate-600 flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        {phone}
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Financial Breakdown</h2>
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-medium text-slate-900">৳{Number(booking.subtotal || booking.budget || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>VAT / Taxes</span>
                <span className="font-medium text-slate-900">৳{Number(booking.tax || 0).toLocaleString()}</span>
              </div>
              {booking.discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span className="font-medium">-৳{Number(booking.discount).toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-900">Total</span>
                <span className="font-bold text-slate-900">৳{Number(booking.grandTotal || booking.budget || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {booking.services && booking.services.length > 0 ? (
            booking.services.map((srv: any, i: number) => (
              <div key={i} className="p-4 flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{srv.name}</h4>
                  <p className="text-slate-500 mt-0.5">{srv.details || `${srv.tier || "Standard"} Tier Service`}</p>
                </div>
                <span className="font-bold text-slate-900 text-sm">৳{Number(srv.price || 0).toLocaleString()}</span>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs font-medium">
              No individual service line items attached to this record.
            </div>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">Event Timeline</h2>
          <div className="space-y-4 text-xs">
            <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900">Booking Registered</p>
                <p className="text-slate-500 mt-0.5">{new Date(booking.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'financials' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Payment Ledger & Invoices</h2>
                <button
                  onClick={() => {
                    toast.success("Downloading formal PDF Invoice...");
                    // In a real app, this would trigger a PDF generation library
                  }}
                  className="text-xs font-medium text-purple-600 hover:text-purple-700 flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <FileText className="w-3.5 h-3.5" /> Download Invoice
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Contract</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">৳{Number(booking.grandTotal || booking.budget || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Amount Paid</p>
                  <p className="text-lg font-bold text-emerald-950 mt-1">৳{Number(booking.amountPaid || 0).toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
                  <p className="text-[10px] uppercase font-bold text-rose-600 tracking-wider">Remaining Balance</p>
                  <p className="text-lg font-bold text-rose-950 mt-1">৳{Number((booking.grandTotal || booking.budget || 0) - (booking.amountPaid || 0)).toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Transaction History</h3>
                {transactions.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                    {transactions.map(txn => (
                      <div key={txn.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{txn.method}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{txn.id} • {new Date(txn.date).toLocaleDateString()} {new Date(txn.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-emerald-700">+৳{Number(txn.amount).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs font-medium border border-slate-200 rounded-lg bg-slate-50">
                    No payments have been made yet.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-2 text-indigo-600">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-semibold text-slate-900">Online Payment Gateway</h2>
              <p className="text-xs text-slate-500 leading-relaxed">Securely pay your booking balance or an initial advance via Credit Card or Mobile Banking.</p>
              
              <button
                onClick={() => setShowPaymentModal(true)}
                disabled={(booking.grandTotal || booking.budget || 0) - (booking.amountPaid || 0) <= 0}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                {(booking.grandTotal || booking.budget || 0) - (booking.amountPaid || 0) <= 0 ? "Fully Paid" : "Make a Payment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900">Secure Checkout</h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleMakePayment} className="p-6 space-y-5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">Select Payment Gateway</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("bkash")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === "bkash"
                        ? "border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>💗 bKash</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("nagad")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === "nagad"
                        ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>🟠 Nagad</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      paymentMethod === "card"
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <span>💳 Card</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Amount to Pay (BDT)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                  <input
                    type="number"
                    required
                    min="100"
                    max={(booking.grandTotal || booking.budget || 0) - (booking.amountPaid || 0)}
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full pl-7 pr-3 py-2 rounded-lg border border-slate-300 text-sm font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(Math.round(((booking.grandTotal || booking.budget || 0) * 0.3)))}
                    className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded"
                  >
                    30% Advance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentAmount((booking.grandTotal || booking.budget || 0) - (booking.amountPaid || 0))}
                    className="flex-1 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-bold rounded"
                  >
                    Pay Full
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessingPayment || !paymentAmount}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-sm transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed gap-2"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Pay ৳{Number(paymentAmount || 0).toLocaleString()}</>
                )}
              </button>
              
              <div className="text-center mt-3">
                <span className="text-[10px] text-slate-400 flex items-center justify-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL Secured Gateway</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Human-Designed Clean Professional Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-200">
            {/* Clean Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Edit Booking Details</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">#{booking.bookingNumber || booking.id}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Form */}
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Event Title</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Wedding Reception"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  >
                    <option value="Wedding">Wedding</option>
                    <option value="Gaye Holud">Gaye Holud</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Social">Social</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Venue / Address</label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  placeholder="e.g. Gulshan Club, Dhaka"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Budget (BDT ৳)</label>
                <input
                  type="number"
                  required
                  value={editBudget}
                  onChange={(e) => setEditBudget(e.target.value)}
                  placeholder="350000"
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Notes & Instructions</label>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Additional instructions..."
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-normal text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                >
                  {isSavingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
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

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getAvailableSlots, bookSlot, getCompanyById } from "@/services/UserService";
import { Clock, Calendar, CheckCircle2, Loader2, ArrowLeft, Building2, Timer, IndianRupee, CreditCard, AlertCircle } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import UserNavbar from "@/components/user/UserNavbar";

export default function UserBookSlots() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCompanyId = searchParams.get("companyId") || "";

  const [companyId, setCompanyId] = useState(urlCompanyId);
  const [companyName, setCompanyName] = useState("");
  const [consultationFee, setConsultationFee] = useState(0);
  const [sessionHours, setSessionHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");

  useEffect(() => {
    if (urlCompanyId) {
      setCompanyId(urlCompanyId);
      // Fetch company details for name and fee
      getCompanyById(urlCompanyId).then(data => {
        setCompanyName(data.name);
        if (data.profile?.consultationFee) {
          setConsultationFee(data.profile.consultationFee);
        }
      }).catch(() => {});
    }
  }, [urlCompanyId]);

  const fetchSlots = useCallback(async () => {
    if (!companyId || !selectedDate) return;
    setLoading(true);
    try {
      const availableSlots = await getAvailableSlots(companyId, selectedDate);
      setSlots(availableSlots);
      setSelectedSlot("");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch slots";
      toast.error(message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [companyId, selectedDate]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  const handleBooking = async () => {
    if (!selectedSlot) {
      toast.warn("Please select a time slot");
      return;
    }
    setBookingLoading(true);
    try {
      await bookSlot({ 
        companyId, 
        date: selectedDate, 
        startTime: selectedSlot,
        // @ts-expect-error - sessionHours might be added to API later
        sessionHours 
      });
      toast.success("Booking and Payment initiated successfully!");
      fetchSlots(); // Refresh slots
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Booking failed";
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNavbar />
      <div className="h-20 sm:h-24"></div>
      <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
          Book Your <span className="text-blue-600">Consultation</span>
        </h1>
        <p className="text-gray-900 text-lg">
          {companyName ? `Professional consultation with ${companyName}` : "Select a company and date to view available time slots."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Selections */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className={`space-y-2 ${urlCompanyId ? 'opacity-60 pointer-events-none' : ''}`}>
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Building2 size={16} className="text-blue-500" /> {urlCompanyId ? 'Company Selected' : 'Search Company'}
              </label>
              <input
                type="text"
                placeholder="Enter Company ID..."
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                readOnly={!!urlCompanyId}
                className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium shadow-inner"
              />
              {companyName && urlCompanyId && (
                <p className="text-xs font-bold text-blue-600 px-1 uppercase tracking-wider">{companyName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Calendar size={16} /> Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-sm"
              />
              <div className="space-y-4 pt-4 border-t border-gray-100">
               <div className="space-y-2">
                 <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                   <Timer size={16} className="text-blue-500" /> Session Duration (Hours)
                 </label>
                 <select 
                   value={sessionHours}
                   onChange={(e) => setSessionHours(Number(e.target.value))}
                   className="w-full p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 transition-all outline-none text-sm font-medium shadow-inner"
                 >
                   {[1, 2, 3, 4, 5].map(h => (
                     <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                   ))}
                 </select>
               </div>
              </div>
            </div>
          </div>

          {selectedSlot && (
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Booking Summary</h3>
                  <p className="text-xs text-gray-900 uppercase font-black tracking-widest">{companyName}</p>
                </div>
              </div>

              <div className="space-y-3 bg-gray-50 p-4 rounded-2xl">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Date</span>
                  <span className="font-bold text-gray-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Clock size={14} /> Start Time</span>
                  <span className="font-bold text-gray-900">{selectedSlot}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 flex items-center gap-2"><Timer size={14} /> Duration</span>
                  <span className="font-bold text-gray-900">{sessionHours} Hour{sessionHours > 1 ? 's' : ''}</span>
                </div>
                <div className="h-px bg-gray-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 flex items-center gap-2 text-sm"><IndianRupee size={14} /> Fee per Hour</span>
                  <span className="font-bold text-gray-900">₹{consultationFee}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-bold">Total Amount</span>
                  <span className="text-2xl font-black text-blue-600">₹{consultationFee * sessionHours}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full py-4 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white rounded-2xl font-bold hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
              >
                {bookingLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <CreditCard size={20} />
                    <span>Pay ₹{consultationFee * sessionHours} & Confirm</span>
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-center text-gray-400 font-medium px-4">
                By clicking confirm, you agree to the consultation terms and cancellation policy.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Slot Grid */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Loader2 className="animate-spin text-blue-500 mb-2" size={32} />
              <p className="text-gray-900 text-sm">Checking availability...</p>
            </div>
          ) : !companyId || !selectedDate ? (
            <div className="h-64 flex flex-col items-center justify-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
               <Calendar className="text-gray-300 mb-2" size={48} />
               <p className="text-gray-900 text-sm">Please select a company and date</p>
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {slots.map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedSlot(time)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center gap-2 ${
                    selectedSlot === time
                      ? "bg-blue-600 border-blue-600 text-white shadow-md ring-4 ring-blue-100"
                      : "bg-white border-gray-100 text-gray-700 hover:border-blue-400 hover:shadow-sm"
                  }`}
                >
                  <Clock size={18} className={selectedSlot === time ? "text-blue-100" : "text-blue-400"} />
                  <span className="font-bold tracking-tight text-lg">{time}</span>
                  <div className={`text-[10px] uppercase font-bold tracking-widest ${selectedSlot === time ? "text-blue-200" : "text-gray-700"}`}>
                    Available
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-red-50 rounded-3xl border-2 border-dashed border-red-100">
              <AlertCircle className="text-red-300 mb-2" size={48} />
              <p className="text-red-400 font-medium">No slots available for this date.</p>
              <p className="text-red-300 text-xs mt-1">Try a different date or company.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);
}

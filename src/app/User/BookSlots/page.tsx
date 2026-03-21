"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { toast } from "react-toastify";
import { getAvailableSlots, bookSlot, getCompanyById, getSlotConfig } from "@/services/UserService";
import { Clock, Calendar, CheckCircle2, Building2, Timer, CreditCard, AlertCircle, ChevronRight, Share2, Heart, Star, MapPin, Phone, Info } from "lucide-react";
import { format } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation";
import UserNavbar from "@/components/user/UserNavbar";
import BookingCalendar from "@/components/user/BookingCalendar";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; // spinners added

interface SlotConfig {
  startDate: string;
  endDate: string;
  weekdays: string[];
  exceptionalDays: { date: string; reason: string }[];
}

interface CompanyDetails {
  name: string;
  profile?: {
    consultationFee?: number;
    address?: string;
  };
  contactEmail?: string;
}

function BookSlotsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlCompanyId = searchParams.get("companyId") || "";

  const [companyId, setCompanyId] = useState(urlCompanyId);
  const [companyName, setCompanyName] = useState("");
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails | null>(null);
  const [consultationFee, setConsultationFee] = useState(0);
  const [sessionHours] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [slotConfig, setSlotConfigData] = useState<SlotConfig | null>(null);

  useEffect(() => {
    if (urlCompanyId) {
      setCompanyId(urlCompanyId);
      // Fetch company details
      getCompanyById(urlCompanyId).then(data => {
        setCompanyDetails(data);
        setCompanyName(data.name);
        if (data.profile?.consultationFee) {
          setConsultationFee(data.profile.consultationFee);
        }
      }).catch(() => {});

      // Fetch slot config for calendar highlighting
      getSlotConfig(urlCompanyId).then(config => {
        setSlotConfigData(config);
      }).catch(err => {
        console.error("Failed to fetch slot config", err);
      });
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
      const { createCheckoutSession } = await import("@/services/UserService");
      
      const booking = await bookSlot({ 
        companyId, 
        date: selectedDate, 
        startTime: selectedSlot,
        // @ts-expect-error - sessionHours might be added to API later
        sessionHours 
      });
      
      toast.info("Booking created! Redirecting to payment...");
      
      const session = await createCheckoutSession(booking.id);
      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Failed to create payment session");
      }
      
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Booking failed";
      toast.error(message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFBFD] min-h-screen pb-20">
      <UserNavbar />
      <div className="h-24 sm:h-28"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <button onClick={() => router.push("/")} className="hover:text-blue-600 transition-colors">Home</button>
          <ChevronRight size={14} />
          <button onClick={() => router.back()} className="hover:text-blue-600 transition-colors">Companies</button>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-bold">{companyName || "Booking"}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Header Section */}
            <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl transition-transform group-hover:scale-110 duration-700"></div>
              
              <div className="relative flex flex-col md:flex-row gap-8 items-start md:items-center">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] flex items-center justify-center text-white shadow-xl shadow-blue-100 shrink-0">
                  <Building2 size={40} className="sm:size-48" />
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">{companyName || "Select Company"}</h1>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-black uppercase tracking-widest border border-green-100">
                      <Star size={12} fill="currentColor" />
                      <span>Verified Profile</span>
                    </div>
                  </div>
                  <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
                    Secure your consultation session with one of our top-tier professionals. Review available dates and select your preferred slot.
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <MapPin size={16} className="text-blue-500" />
                      <span>{companyDetails?.profile?.address || "Global Online"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                      <Phone size={16} className="text-blue-500" />
                      <span>{companyDetails?.contactEmail || "Contact available after booking"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Steps / Booking Interaction */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-2">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black shadow-lg shadow-blue-100">1</div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Choose Date & Time</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                  <BookingCalendar 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate}
                    config={slotConfig}
                  />
                  <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100 flex items-start gap-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm">
                      <Info size={20} className="text-blue-600" />
                    </div>
                    <p className="text-xs text-blue-700 font-bold leading-relaxed">
                      Dates marked with a <span className="text-red-500">red dot</span> are available for consultation. Grayed out dates are currently closed or fully booked.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {selectedDate ? (
                    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="flex items-center justify-between">
                         <div className="space-y-1">
                           <h3 className="font-black text-gray-900 text-xl">Available Slots</h3>
                           <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{format(new Date(selectedDate), "EEEE, MMMM do")}</p>
                         </div>
                         <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
                           <Clock size={20} />
                         </div>
                      </div>

                      {loading ? (
                        <div className="py-12">
                          {/* spinners added: Reusable spinner for consistency */}
                          <LoadingSpinner size={40} text="Searching slots..." />
                        </div>
                      ) : slots.length > 0 ? (
                        <div className="grid grid-cols-2 gap-3">
                          {slots.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedSlot(time)}
                              className={`
                                group relative p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-2
                                ${selectedSlot === time
                                  ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100 scale-105 z-10"
                                  : "bg-white border-gray-50 text-gray-600 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1"}
                              `}
                            >
                              <span className="font-black text-xl tracking-tight">{time}</span>
                              <div className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ${selectedSlot === time ? "bg-white/20" : "bg-green-50 text-green-600"}`}>
                                Available
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center space-y-4 bg-gray-50 rounded-[32px]">
                          <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto">
                            <AlertCircle className="text-red-400" size={32} />
                          </div>
                          <p className="text-gray-900 font-black">No Slots Found</p>
                          <p className="text-xs text-gray-400 font-medium px-8">The professional has no available openings for this day. Please try another red-marked date.</p>
                        </div>
                      )}

                      {/* <div className="space-y-3 pt-4 border-t border-gray-50">
                        <label className="text-sm font-black text-gray-900 ml-1">Consultation Depth</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[1, 2, 3, 4, 5].map(h => (
                            <button
                              key={h}
                              onClick={() => setSessionHours(h)}
                              className={`py-3 rounded-2xl font-black text-sm transition-all ${sessionHours === h ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                            >
                              {h}h
                            </button>
                          ))}
                        </div>
                      </div> */}
                    </div>
                  ) : (
                    <div className="h-[432px] bg-white rounded-[40px] border border-gray-100 border-dashed flex flex-col items-center justify-center p-12 text-center space-y-6">
                       <div className="w-24 h-24 bg-gray-50 rounded-[32px] flex items-center justify-center">
                         <Calendar className="text-gray-300" size={48} />
                       </div>
                       <div className="space-y-2">
                        <h3 className="text-xl font-black text-gray-900">Select a Date</h3>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">Choose one of the available dates from the calendar on the left to view time slots.</p>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 space-y-8">
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button className="flex-1 py-4 bg-white rounded-2xl border border-gray-100 shadow-sm font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-all">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
                <button className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 flex items-center justify-center hover:text-red-500 transition-all group">
                  <Heart size={20} className="group-active:fill-red-500 transition-colors" />
                </button>
              </div>

              {/* Booking Receipt Card */}
              <div className={`
                bg-white p-8 rounded-[40px] border border-gray-100 shadow-2xl space-y-8 transition-all duration-500
                ${selectedSlot ? "translate-y-0 opacity-100" : "translate-y-12 opacity-50 grayscale pointer-events-none"}
              `}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <CheckCircle2 size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">Order Summary</h3>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em]">{companyName}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-4 border-b border-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <Calendar size={18} className="text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-500">Scheduled Date</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{selectedDate}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <Clock size={18} className="text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-500">Pick-up Time</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{selectedSlot}</span>
                  </div>

                  <div className="flex justify-between items-center py-4 border-b border-gray-50 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl group-hover:bg-blue-50 transition-colors">
                        <Timer size={18} className="text-gray-400 group-hover:text-blue-600" />
                      </div>
                      <span className="text-sm font-bold text-gray-500">Session Span</span>
                    </div>
                    <span className="text-sm font-black text-gray-900">{sessionHours} Hour{sessionHours > 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="bg-gray-50/80 p-6 rounded-[32px] space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-400">Consultation Fee</span>
                    <span className="text-sm font-black text-gray-900">₹{consultationFee}.00/hr</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black text-gray-900">Total payable</span>
                    <span className="text-3xl font-black text-blue-600 tracking-tighter">₹{consultationFee * sessionHours}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="w-full py-5 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-3xl font-black text-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 disabled:grayscale disabled:pointer-events-none"
                >
                  {bookingLoading ? (
                    /* spinners added */
                    <LoadingSpinner size={24} className="text-white" />
                  ) : (
                    <>
                      <CreditCard size={22} />
                      <span>Confirm & Pay Order</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-gray-400 font-bold uppercase tracking-widest px-4 leading-relaxed">
                  Secure checkout powered by Stripe. Cancellation policies apply.
                </p>
              </div>

              {/* Policy Note */}
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-start gap-4">
                 <div className="p-2 bg-green-50 rounded-xl text-green-600 shrink-0">
                   <Star size={18} fill="currentColor" />
                 </div>
                 <div className="space-y-1">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Trust Policy</h4>
                   <p className="text-xs text-gray-600 font-bold leading-relaxed">All payments are held in escrow until the session is completed to ensure maximum safety.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserBookSlots() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={48} className="text-blue-900" />
      </div>
    }>
      <BookSlotsContent />
    </Suspense>
  );
}


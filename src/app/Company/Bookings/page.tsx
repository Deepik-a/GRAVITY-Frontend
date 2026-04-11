"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCompanyBookings, rescheduleBooking, cancelBooking } from "@/services/CompanyService";
import { getAvailableSlots } from "@/services/UserService";
import { toast } from "react-toastify";
import { Calendar, Clock, User, CheckCircle, Ban, RefreshCcw, Mail, AlertCircle, XCircle, Video, Loader2, Timer, History } from "lucide-react";
import io from "socket.io-client";
// import VideoCall from "@/components/video/VideoCall";

interface Booking {
  id: string;
  companyId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  price: number;
  paymentStatus: string;
  isRescheduled?: boolean;
  userId: string;
  createdAt: string;
  userDetails?: {
    name: string;
    email: string;
    profileImage?: string;
  };
}

export default function CompanyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  
  // Rescheduling state
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isRescheduling, setIsRescheduling] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 6;

  // Video Call State
  // const [currentCompany, setCurrentCompany] = useState<{ id: string, name: string } | null>(null);
  /* const [videoCallData, setVideoCallData] = useState<{
    targetId: string;
    targetName: string;
    isIncoming: boolean;
    offer?: RTCSessionDescriptionInit;
  } | null>(null); */

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      // setCurrentCompany({ id: user.id, name: user.name });
      
      const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000");
      socket.emit("join", { userId: user.id, type: "company" });

      /* socket.on("incoming_call", (data: { callerId: string, callerName: string, offer: RTCSessionDescriptionInit }) => {
        // Handled by GlobalVideoCallListener
      }); */

      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    fetchBookings(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchBookings = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getCompanyBookings(page, itemsPerPage);
      // Backend returns { bookings: Booking[], total: number } now
      setBookings(result.bookings || []);
      setTotalItems(result.total || 0);
      setTotalPages(Math.ceil((result.total || 0) / itemsPerPage));
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleClick = async (booking: Booking) => {
    if (reschedulingId === booking.id) {
      setReschedulingId(null);
      return;
    }

    setReschedulingId(booking.id);
    setIsFetchingSlots(true);
    try {
      // Ensure date is in YYYY-MM-DD format
      const dateStr = new Date(booking.date).toISOString().split('T')[0];
      let slots = await getAvailableSlots(booking.companyId, dateStr);
      
      // Filter out past slots if rescheduling to today
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      if (dateStr === todayStr) {
        const currentTimeInMins = now.getHours() * 60 + now.getMinutes();
        slots = slots.filter((slotTime) => {
          const [hours, minutes] = slotTime.split(":").map(Number);
          const slotTimeInMins = hours * 60 + minutes;
          return slotTimeInMins > currentTimeInMins;
        });
      }

      setAvailableSlots(slots.slice(0, 5));
    } catch (error: unknown) {
      const message = (error as Error).message || "Failed to fetch available slots";
      toast.error(message);
      setReschedulingId(null);
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const executeReschedule = async (booking: Booking, newSlot: string) => {
    setIsRescheduling(true);
    try {
      await rescheduleBooking(booking.id, booking.date, newSlot);
      toast.success("Booking rescheduled successfully!");
      setReschedulingId(null);
      fetchBookings();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Rescheduling failed");
    } finally {
      setIsRescheduling(false);
    }
  };

  const handleCancelClick = async (booking: Booking) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This will refund the user if paid.")) return;
    
    try {
      await cancelBooking(booking.id);
      toast.success("Booking cancelled successfully!");
      fetchBookings();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to cancel booking");
    }
  };

  const categorizedBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (booking.status === "cancelled") return activeTab === "cancelled";
    
    if (bookingDate < now) return activeTab === "past";
    
    return activeTab === "upcoming";
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-50 border-green-100";
      case "cancelled": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-blue-600 bg-blue-50 border-blue-100";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-bold tracking-tight">Syncing your schedule...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Consultations</h2>
          <p className="text-gray-500 font-medium">Manage your client appointments and consultation records</p>
        </div>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab("upcoming")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'upcoming' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Timer size={16} /> Upcoming
          </button>
          <button 
            onClick={() => setActiveTab("past")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'past' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <History size={16} /> Past
          </button>
          <button 
            onClick={() => setActiveTab("cancelled")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'cancelled' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Ban size={16} /> Cancelled
          </button>
        </div>
      </div>

      {categorizedBookings.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-20 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
            {activeTab === 'upcoming' ? <Calendar size={40} /> : activeTab === 'past' ? <History size={40} /> : <Ban size={40} />}
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2">No {activeTab} bookings</h3>
          <p className="text-gray-500 max-w-xs mx-auto font-medium">Your {activeTab} consultation records will be listed here once available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {categorizedBookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center text-blue-600 shrink-0 overflow-hidden border-4 border-white shadow-sm">
                {
  booking.userDetails?.profileImage ? (
    <>
      {/*
      <Image 
        src={resolveImageUrl(booking.userDetails.profileImage) || ""} 
        alt="" 
        width={80} 
        height={80} 
        className="w-full h-full object-cover" 
        unoptimized
      />
      */}
      <User size={32} />
    </>
  ) : (
    <User size={32} />
  )
}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <h4 className="font-black text-gray-900 text-2xl group-hover:text-blue-600 transition-colors">{booking.userDetails?.name || "Premium Client"}</h4>
                      {booking.isRescheduled && (
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <RefreshCcw size={10} /> Rescheduled
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-bold text-gray-500">
                      <span className="flex items-center gap-2">
                        <Mail size={16} className="text-blue-400" />
                        {booking.userDetails?.email}
                      </span>
                      <span className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full">
                        <AlertCircle size={14} className="text-blue-500" />
                        ID: {booking.id.slice(-6).toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 lg:bg-gray-50/50 lg:p-6 lg:rounded-[1.5rem] lg:border lg:border-gray-100">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Appointment Date</p>
                    <div className="flex items-center gap-2 font-black text-gray-900">
                      <Calendar size={18} className="text-blue-500" />
                      {new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Consultation Time</p>
                    <div className="flex items-center gap-2 font-black text-gray-900">
                      <Clock size={18} className="text-blue-500" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>

                  <div className="w-px h-10 bg-gray-200 hidden sm:block"></div>

                  <div className="space-y-2">
                    <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest text-center">Status</p>
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest border ${getStatusColor(booking.status)}`}>
                      {booking.status === "confirmed" && <CheckCircle size={14} />}
                      {booking.status === "cancelled" && <XCircle size={14} />}
                      {booking.status === "pending" && <AlertCircle size={14} />}
                      {booking.status}
                    </div>
                  </div>
                </div>

                  <div className="flex items-center gap-3">
                    {activeTab === "upcoming" && (
                      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        {booking.status === "confirmed" && (
                          <button 
                            onClick={() => {
                              const [h1, m1] = booking.startTime.split(":").map(Number);
                              const [h2, m2] = booking.endTime.split(":").map(Number);
                              const duration = (h2 * 60 + m2) - (h1 * 60 + m1);
                              router.push(`/VideoCall?targetId=${booking.userId}&targetName=${booking.userDetails?.name || "Client"}&targetType=user&bookingId=${booking.id}&scheduledDuration=${duration}`);
                            }}
                            className="flex-1 lg:flex-none px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 animate-pulse"
                          >
                            <Video size={18} />
                            Start Call
                          </button>
                        )}
                        <button 
                          onClick={() => handleRescheduleClick(booking)}
                          className={`flex-1 lg:flex-none px-6 py-4 rounded-2xl text-sm font-black transition-all flex items-center justify-center gap-2 ${reschedulingId === booking.id ? 'bg-amber-600 text-white shadow-amber-100' : 'bg-white text-amber-600 border-2 border-amber-100 hover:bg-amber-50'}`}
                        >
                          <RefreshCcw size={18} className={reschedulingId === booking.id ? 'animate-spin' : ''} />
                          {reschedulingId === booking.id ? 'Close' : 'Reschedule'}
                        </button>

                        <button 
                          onClick={() => handleCancelClick(booking)}
                          className="flex-1 lg:flex-none px-6 py-4 bg-white text-red-600 border-2 border-red-100 rounded-2xl text-sm font-black hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                        >
                          <Ban size={18} /> Cancel
                        </button>
                      </div>
                    )}
                    {/* <button className="flex-1 lg:flex-none px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                      View Details
                    </button> */}
                  </div>
              </div>

              {/* Reschedule Slots Panel */}
              {reschedulingId === booking.id && (
                <div className="mt-8 pt-8 border-t border-dashed border-gray-100 animate-in slide-in-from-top-4 duration-300">
                  <div className="bg-gray-50 rounded-[1.5rem] p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                          <Clock size={20} />
                        </div>
                        <div>
                          <h5 className="font-black text-gray-900">Select New Time</h5>
                          <p className="text-xs text-gray-500 font-bold">Showing first 5 available slots for {new Date(booking.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      {isFetchingSlots && <Loader2 size={20} className="animate-spin text-amber-600" />}
                    </div>

                    {!isFetchingSlots && availableSlots.length === 0 && (
                      <div className="text-center py-4 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-sm font-bold text-gray-400">No other slots available for this day.</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot}
                          disabled={isRescheduling}
                          onClick={() => executeReschedule(booking, slot)}
                          className="px-6 py-3 bg-white border-2 border-gray-100 rounded-xl text-sm font-black text-gray-700 hover:border-amber-500 hover:text-amber-600 transition-all active:scale-95 disabled:opacity-50"
                        >
                          {slot}
                        </button>
                      ))}
                    </div>

                    {isRescheduling && (
                      <div className="mt-4 flex items-center gap-2 text-amber-600 font-black text-xs animate-pulse">
                        <Loader2 size={14} className="animate-spin" />
                        Updating consultation schedule...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination UI */}
      {!loading && totalItems > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500 font-bold">
            Showing <span className="text-gray-900">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}</span> to <span className="text-gray-900">{Math.min(totalItems, currentPage * itemsPerPage)}</span> of <span className="text-gray-900">{totalItems}</span> total consultations
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <RefreshCcw size={18} className="rotate-180" />
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              <RefreshCcw size={18} />
            </button>
          </div>
        </div>
      )}

      {/* VideoCall is now global and on separate page */}
    </div>
  );
}

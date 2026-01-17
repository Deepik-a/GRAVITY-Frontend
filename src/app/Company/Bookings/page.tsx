"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCompanyBookings, confirmBooking } from "@/services/CompanyService";
import { toast } from "react-toastify";
import { Calendar, Clock, User, Mail, CheckCircle, XCircle, AlertCircle, Loader2, History, Timer, Ban } from "lucide-react";
import { resolveImageUrl } from "@/utils/urlHelper";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  price: number;
  paymentStatus: string;
  userDetails?: {
    name: string;
    email: string;
    profileImage?: string;
  };
}

export default function CompanyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "cancelled">("upcoming");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getCompanyBookings();
      setBookings(data);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      await confirmBooking(bookingId);
      toast.success("Booking confirmed successfully!");
      fetchBookings();
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to confirm booking");
    } finally {
      setProcessingId(null);
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
          <p className="text-gray-500 font-medium">Manage your client appointments and confirm pending slots</p>
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
                    {booking.userDetails?.profileImage ? (
                      <Image 
                        src={resolveImageUrl(booking.userDetails.profileImage) || ""} 
                        alt="" 
                        width={80} 
                        height={80} 
                        className="w-full h-full object-cover" 
                        unoptimized
                      />
                    ) : (
                      <User size={32} />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-black text-gray-900 text-2xl group-hover:text-blue-600 transition-colors">{booking.userDetails?.name || "Premium Client"}</h4>
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
                  {booking.status === "pending" && activeTab === "upcoming" ? (
                    <button 
                      onClick={() => handleConfirm(booking.id)}
                      disabled={processingId === booking.id}
                      className="flex-1 lg:flex-none px-8 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {processingId === booking.id ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                      Confirm Booking
                    </button>
                  ) : (
                    <button className="flex-1 lg:flex-none px-8 py-4 bg-gray-900 text-white rounded-2xl text-sm font-black hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
                      View Details
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


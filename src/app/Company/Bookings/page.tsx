"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getCompanyBookings } from "@/services/CompanyService";
import { toast } from "react-toastify";
import { Calendar, Clock, User, Mail, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  userDetails?: {
    name: string;
    email: string;
    profileImage?: string;
  };
}

export default function CompanyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Consultation Bookings</h2>
          <p className="text-gray-500">Manage your upcoming and past client consultations</p>
        </div>
        <button 
          onClick={fetchBookings}
          className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
        >
          Refresh Data
        </button>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
            <Calendar size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-500">When clients book consultations, they will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                    {booking.userDetails?.profileImage ? (
                      <Image 
                        src={booking.userDetails.profileImage} 
                        alt="" 
                        width={48} 
                        height={48} 
                        className="rounded-full object-cover" 
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-900 text-lg">{booking.userDetails?.name || "Unknown Client"}</h4>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        {booking.userDetails?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-black text-gray-400 tracking-widest">Date</p>
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <Calendar size={16} className="text-blue-500" />
                      {new Date(booking.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase font-black text-gray-400 tracking-widest">Time Slot</p>
                    <div className="flex items-center gap-2 font-bold text-gray-800">
                      <Clock size={16} className="text-blue-500" />
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <p className="text-xs uppercase font-black text-gray-400 tracking-widest">Status</p>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                      {booking.status === "confirmed" && <CheckCircle size={12} />}
                      {booking.status === "cancelled" && <XCircle size={12} />}
                      {booking.status === "pending" && <AlertCircle size={12} />}
                      {booking.status}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAllBookings, refundBooking } from "@/services/AdminService";
import { toast } from "react-toastify";
import { Calendar, Clock, Loader2, Search, Filter, AlertCircle, CheckCircle, XCircle, RefreshCcw } from "lucide-react";
import { resolveImageUrl } from "@/utils/urlHelper";
import Image from "next/image";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  price: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  userDetails?: {
    name: string;
    email: string;
    profileImage?: string;
  };
  companyDetails?: {
    name: string;
    logo?: string;
  };
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchBookings = useCallback(async (page = 1, search = debouncedSearch) => {
    setLoading(true);
    try {
      const result = await getAllBookings(page, itemsPerPage, search);
      setBookings(result.bookings || []);
      setTotalItems(result.total || 0);
      setTotalPages(Math.ceil((result.total || 0) / itemsPerPage));
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, itemsPerPage]);

  useEffect(() => {
    fetchBookings(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchBookings]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings(1, debouncedSearch);
  };

  const handleRefund = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to refund this cancelled booking to the user's wallet?")) return;
    
    try {
      await refundBooking(bookingId);
      toast.success("Refund processed successfully!");
      fetchBookings(currentPage);
    } catch (error: unknown) {
      toast.error((error as Error).message || "Failed to process refund");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} /> Confirmed
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle size={12} /> Pending
          </span>
        );
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium tracking-wide">Fetching all system bookings...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Bookings</h1>
          <p className="text-gray-500 font-medium">Monitor and manage all consultation bookings across the platform</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setStatusFilter("all")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter === 'all' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              All
            </button>
            <button 
              onClick={() => setStatusFilter("pending")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter === 'pending' ? 'bg-yellow-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setStatusFilter("confirmed")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${statusFilter === 'confirmed' ? 'bg-green-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            >
              Confirmed
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Search by client, company or booking ID..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all shadow-sm font-medium text-gray-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            suppressHydrationWarning={true}
          />
        </div>
        <button 
          onClick={handleRefresh}
          className="bg-white border border-gray-200 text-gray-700 px-6 py-3 rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          disabled={loading || isRefreshing}
        >
          <RefreshCcw size={18} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Updating..." : "Refresh Registry"}
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Client</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Provider</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Schedule</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Fee &amp; Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shrink-0">
                          {booking.userDetails?.profileImage ? (
                            <Image src={resolveImageUrl(booking.userDetails.profileImage) || ""} alt="" width={40} height={40} className="object-cover w-full h-full" unoptimized />
                          ) : (
                            <Image 
                              src="https://cdn-icons-png.flaticon.com/512/147/147144.png" 
                              alt="Avatar" 
                              width={40} 
                              height={40} 
                              className="object-cover opacity-80" 
                              unoptimized 
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{booking.userDetails?.name || "N/A"}</p>
                          <p className="text-xs text-gray-500 font-medium">{booking.userDetails?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden shrink-0">
                          {booking.companyDetails?.logo ? (
                            <Image src={resolveImageUrl(booking.companyDetails.logo) || ""} alt="" width={40} height={40} className="object-cover w-full h-full" unoptimized />
                          ) : (
                            <Image 
                              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                              alt="Company" 
                              width={40} 
                              height={40} 
                              className="object-cover opacity-80 p-1" 
                              unoptimized 
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{booking.companyDetails?.name || "N/A"}</p>
                          <p className="text-xs text-gray-500 font-medium italic">Service Provider</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                          <Calendar size={14} className="text-blue-500" />
                          {new Date(booking.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                          <Clock size={14} />
                          {booking.startTime} - {booking.endTime}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-5 text-right space-y-2">
                      <div>
                        <p className="font-black text-gray-900">₹{booking.price?.toLocaleString()}</p>
                        <p className={`text-[10px] font-bold uppercase tracking-tighter ${booking.paymentStatus === 'paid' ? 'text-green-600' : booking.paymentStatus === 'refunded' ? 'text-blue-600' : 'text-orange-500'}`}>
                          {booking.paymentStatus}
                        </p>
                      </div>
                      {booking.status === "cancelled" && booking.paymentStatus !== "refunded" && (
                        <button
                          onClick={() => handleRefund(booking.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
                        >
                          <RefreshCcw size={12} /> Refund to Wallet
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <Filter size={32} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">No matching bookings</h3>
                      <p className="text-sm text-gray-500">Try adjusting your search terms or filters to find what you&apos;re looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination UI */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{Math.min(totalItems, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(totalItems, currentPage * itemsPerPage)}</span> of <span className="font-bold text-gray-900">{totalItems}</span> bookings
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {i + 1}
                </button>
              )).slice(Math.max(0, currentPage - 3), Math.min(totalPages, currentPage + 2))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

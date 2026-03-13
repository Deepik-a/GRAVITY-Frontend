"use client";
import React, { useEffect, useState } from "react";
import { getRevenue, initiatePayout } from "@/services/AdminService";
// import { format } from "date-fns"; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RevenuePage() {
  const [data, setData] = useState<{ totalRevenue: number; totalCompanyShare: number; bookings: { id: string; date: string; price: number; adminCommission?: number; payoutStatus: string }[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getRevenue();
      setData(res);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to load revenue data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePayout = async (bookingId: string) => {
    try {
       await initiatePayout(bookingId);
       toast.success("Payout initiated successfully");
       fetchData(); // Refresh data
    } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message || "Payout failed");
    }
  };

  const isEligible = (dateStr: string) => {
      const date = new Date(dateStr);
      const eligibilityDate = new Date(date);
      eligibilityDate.setDate(eligibilityDate.getDate() + 2);
      return new Date() >= eligibilityDate;
  }

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Revenue & Payouts</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium">Total Admin Commission</h3>
            <p className="text-2xl font-bold text-gray-900">₹{data?.totalRevenue?.toFixed(2) || "0.00"}</p>
         </div>
         <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
             <h3 className="text-gray-500 text-sm font-medium">Total Company Share (Pending/Paid)</h3>
             <p className="text-2xl font-bold text-gray-900">₹{data?.totalCompanyShare?.toFixed(2) || "0.00"}</p>
         </div>
      </div>

      {/* Bookings Table */}
       <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Booking Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
               <thead className="bg-gray-50">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slot Date</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking ID</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin (10%)</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company (90%)</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payout Status</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
               </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                  {data?.bookings?.length === 0 && (
                    <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">No paid bookings found.</td></tr>
                  )}
                  {data?.bookings?.map((booking: { id: string; date: string; price: number; adminCommission?: number; payoutStatus: string }) => {
                     const adminComm = booking.adminCommission || (booking.price * 0.1);
                     const companyShare = booking.price - adminComm;
                     return (
                     <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" title={booking.id}>{booking.id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">₹{booking.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">₹{adminComm.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">₹{companyShare.toFixed(2)}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.payoutStatus === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                               {booking.payoutStatus === 'completed' ? 'Paid to Company' : 'Pending'}
                            </span>
                         </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {booking.payoutStatus !== 'completed' && (
                                <button
                                  onClick={() => handlePayout(booking.id)}
                                  disabled={!isEligible(booking.date)}
                                  className={`px-3 py-1 rounded text-white text-xs font-medium transition ${isEligible(booking.date) ? 'bg-indigo-600 hover:bg-indigo-700 shadow-sm' : 'bg-gray-400 cursor-not-allowed'}`}
                                  suppressHydrationWarning={true}
                                >
                                  {isEligible(booking.date) ? "Confirm Payment" : `Wait (${Math.max(0, Math.ceil((new Date(new Date(booking.date).setDate(new Date(booking.date).getDate() + 2)).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} days)`}
                                </button>
                            )}
                            {booking.payoutStatus === 'completed' && <span className="text-green-600 font-medium text-xs">Completed</span>}
                         </td>
                     </tr>
                  )})}
               </tbody>
            </table>
          </div>
       </div>
    </div>
  );
}

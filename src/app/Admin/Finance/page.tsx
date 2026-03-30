"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getTransactions, initiatePayout } from "@/services/AdminService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Transaction {
  id: string;
  type: "booking_payment" | "subscription_payment" | "admin_commission" | "company_payout" | "subscription_payment";
  amount: number;
  status: "pending" | "completed" | "failed" | "pending_transfer";
  description: string;
  commissionRate?: number;
  commissionAmount?: number;
  netAmount?: number;
  bookingId?: string;
  userDetails?: {
    name: string;
    email: string;
  };
  companyDetails?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface TransactionData {
  transactions: Transaction[];
  totalRevenue: number;
  totalCommissions: number;
  revenueByType: { type: string; total: number }[];
}

const FinancePage = () => {
  const [data, setData] = useState<TransactionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [payoutLoading, setPayoutLoading] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await getTransactions(filters);

      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInitiatePayout = async (bookingId: string) => {
    const resolvePayout = async () => {
      setPayoutLoading(bookingId);
      try {
        await initiatePayout(bookingId);
        toast.success("Payout initiated successfully!");
        fetchTransactions();
      } catch (err: unknown) {
        const error = err as Error;
        toast.error(error.message || "Failed to initiate payout");
      } finally {
        setPayoutLoading(null);
      }
    };

    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-3 p-1">
          <p className="font-semibold text-gray-800">Are you sure you want to confirm this payout to the company wallet?</p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                closeToast();
                resolvePayout();
              }}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors"
            >
              Confirm
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { position: "top-center", autoClose: false }
    );
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    fetchTransactions();
  };

  const handleResetFilters = () => {
    setFilters({ type: "", status: "", startDate: "", endDate: "" });
    setCurrentPage(1);
    setTimeout(() => fetchTransactions(), 100);
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      booking_payment: "Booking Payment",
      subscription_payment: "Subscription Payment",
      admin_commission: "Admin Commission",
      company_payout: "Company Payout",
    };
    return labels[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      booking_payment: "bg-blue-100 text-blue-800",
      subscription_payment: "bg-purple-100 text-purple-800",
      admin_commission: "bg-green-100 text-green-800",
      company_payout: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      pending_transfer: "bg-indigo-100 text-indigo-800 border border-indigo-200",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Finance Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-blue-600">
            ₹{data?.totalRevenue.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Commissions</h3>
          <p className="text-3xl font-bold text-green-600">
            ₹{data?.totalCommissions.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Transactions</h3>
          <p className="text-3xl font-bold text-purple-600">
            {data?.transactions.length || 0}
          </p>
        </div>
      </div>

      {/* Revenue by Type */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue by Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.revenueByType.map((item) => (
            <div key={item.type} className="border rounded-lg p-4 bg-gray-50">
              <p className="text-sm text-gray-600 mb-1">{getTypeLabel(item.type)}</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{item.total.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning={true}
            >
              <option value="">All Types</option>
              <option value="booking_payment">Booking Payment</option>
              <option value="subscription_payment">Subscription Payment</option>
              <option value="admin_commission">Admin Commission</option>
              <option value="company_payout">Company Payout</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning={true}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending Checkout</option>
              <option value="pending_transfer">Ready for Payout</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning={true}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              suppressHydrationWarning={true}
            />
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User/Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amounts (₹)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.transactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                    {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${getTypeColor(
                        transaction.type
                      )}`}
                    >
                      {getTypeLabel(transaction.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <p className="font-medium truncate" title={transaction.description}>{transaction.description}</p>
                    {transaction.bookingId && (
                      <p className="text-xs text-blue-500 font-mono">Booking: #{transaction.bookingId.slice(-8)}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 border-x border-gray-50">
                    {transaction.userDetails && (
                      <div>
                        <p className="font-semibold text-gray-800">{transaction.userDetails.name}</p>
                        <p className="text-gray-500 text-xs">{transaction.userDetails.email}</p>
                      </div>
                    )}
                    {transaction.companyDetails && (
                      <div>
                        <p className="font-semibold text-indigo-700">{transaction.companyDetails.name}</p>
                        <p className="text-gray-400 text-xs italic">{transaction.companyDetails.email}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">Gross:</span>
                        <span className="font-bold">₹{transaction.amount.toLocaleString()}</span>
                      </div>
                      {transaction.commissionAmount !== undefined && (
                        <div className="flex justify-between gap-4 text-red-500 text-xs">
                          <span>Comm ({transaction.commissionRate}%):</span>
                          <span>- ₹{transaction.commissionAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {transaction.netAmount !== undefined && (
                        <div className="flex justify-between gap-4 pt-1 border-t border-gray-100 text-green-600 font-black">
                          <span>Net:</span>
                          <span>₹{transaction.netAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${getStatusColor(
                        transaction.status
                      )} shadow-sm`}
                    >
                      {transaction.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {transaction.type === "company_payout" && transaction.status === "pending_transfer" && transaction.bookingId && (
                      <button
                        onClick={() => handleInitiatePayout(transaction.bookingId!)}
                        disabled={payoutLoading === transaction.bookingId}
                        className={`px-4 py-2 rounded-lg text-white font-bold text-xs transition-all ${
                          payoutLoading === transaction.bookingId 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-indigo-200 active:scale-95"
                        }`}
                      >
                        {payoutLoading === transaction.bookingId ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                            Processing...
                          </span>
                        ) : (
                          "Confirm Transfer"
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data?.transactions && data.transactions.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-medium">
              Showing <span className="font-bold text-gray-900">{Math.min(data.transactions.length, (currentPage - 1) * itemsPerPage + 1)}-{Math.min(data.transactions.length, currentPage * itemsPerPage)}</span> of <span className="font-bold text-gray-900">{data.transactions.length}</span> entries
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors shadow-sm bg-white text-gray-700"
              >
                Previous
              </button>
              <div className="flex gap-1">
                {[...Array(Math.ceil(data.transactions.length / itemsPerPage))].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold shadow-sm transition-colors ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'}`}
                  >
                    {i + 1}
                  </button>
                )).slice(Math.max(0, currentPage - 3), Math.min(Math.ceil(data.transactions.length / itemsPerPage), currentPage + 2))}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(data.transactions!.length / itemsPerPage), p + 1))}
                disabled={currentPage === Math.ceil(data.transactions.length / itemsPerPage)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors shadow-sm bg-white text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
        
        {data?.transactions.length === 0 && (
          <div className="text-center py-20 text-gray-500 bg-gray-50/50">
            <div className="text-4xl mb-4 group-hover:animate-bounce">🔍</div>
            <p className="text-lg font-medium">No transactions found matching your criteria</p>
            <button onClick={handleResetFilters} className="mt-4 text-blue-600 hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancePage;

"use client";
import React, { useEffect, useState } from "react";
import { getWallet } from "@/services/CompanyService";
// import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function WalletPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getWallet();
                setData(res);
            } catch (err: any) {
                toast.error(err.message || "Failed to load wallet");
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    if (loading) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
             <ToastContainer />
             <h1 className="text-3xl font-bold mb-6 text-gray-800">My Wallet</h1>
             <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-indigo-500">
                <h3 className="text-gray-500 text-sm font-medium">Current Balance</h3>
                <p className="text-4xl font-bold text-gray-900 mt-2">₹{data?.balance?.toFixed(2) || "0.00"}</p>
             </div>

             <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-700">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.transactions?.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No transactions found.</td></tr>
                            )}
                            {data?.transactions?.map((t: any) => (
                                <tr key={t.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">{t.type ? t.type.replace('_', ' ') : '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        {t.type === 'company_payout' ? '+' : ''}₹{t.amount?.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {t.bookingId && <span title={t.bookingId}>Booking: {t.bookingId.slice(-6)}</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
    );
}

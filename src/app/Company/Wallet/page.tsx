"use client";
import React, { useEffect, useState } from "react";
import { getWallet } from "@/services/CompanyService";
// import { format } from "date-fns";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface WalletTransaction {
    id: string;
    type: string;
    amount: number;
    status: string;
    description: string;
    bookingId?: string;
    commissionAmount?: number;
    commissionRate?: number;
    createdAt: string;
}

interface WalletData {
    balance: number;
    transactions: WalletTransaction[];
}

export default function WalletPage() {
    const [data, setData] = useState<WalletData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getWallet();
                setData(res);
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : "Failed to load wallet";
                toast.error(message);
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
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amounts (₹)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data?.transactions?.length === 0 && (
                                <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">No transactions found.</td></tr>
                            )}
                            {data?.transactions?.map((t: WalletTransaction) => (
                                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-full ${
                                            t.type === 'company_payout' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {t.type ? t.type.replace('_', ' ') : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                                        <p className="truncate">{t.description}</p>
                                        {t.bookingId && <p className="text-[10px] text-gray-400 font-mono">ID: #{t.bookingId.slice(-8)}</p>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex flex-col gap-1">
                                            {t.type === 'company_payout' ? (
                                                <>
                                                    <div className="flex justify-between gap-4 text-xs">
                                                        <span className="text-gray-400">Total Charged:</span>
                                                        <span className="font-semibold text-gray-600">₹{(t.amount + (t.commissionAmount || 0)).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 text-xs text-red-400">
                                                        <span className="italic">Platform Fee ({t.commissionRate || 10}%):</span>
                                                        <span>- ₹{(t.commissionAmount || 0).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between gap-4 pt-1 border-t border-gray-100 font-bold text-green-600">
                                                        <span>To Wallet:</span>
                                                        <span>₹{t.amount?.toFixed(2)}</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <span className="font-bold">₹{t.amount?.toFixed(2)}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-[10px] leading-5 font-black uppercase rounded-full ${
                                            t.status === 'completed' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                        }`}>
                                            {t.status.replace('_', ' ')}
                                        </span>
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

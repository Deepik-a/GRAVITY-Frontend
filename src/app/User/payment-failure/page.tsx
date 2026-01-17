"use client";

import React from "react";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";

export default function PaymentFailed() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
          <XCircle size={64} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Payment Failed</h1>
          <p className="text-gray-500 font-medium">
            Something went wrong while processing your payment.
          </p>
        </div>

        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4 text-left">
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <AlertCircle size={20} />
          </div>
          <div>
            <h3 className="font-bold text-red-900">Why did it fail?</h3>
            <p className="text-sm text-red-700 leading-relaxed">
              This could be due to insufficient funds, an expired card, or a temporary issue with the payment provider.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button 
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <RefreshCw size={18} />
            <span>Try Again</span>
          </button>
          
          <Link 
            href="/User/HomePage" 
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
          >
            <ArrowLeft size={18} />
            <span>Return Home</span>
          </Link>
        </div>

        <p className="text-xs text-gray-400 font-medium px-8 leading-relaxed">
          If your money was deducted, it will be refunded automatically within 5-7 business days.
        </p>
      </div>
    </div>
  );
}

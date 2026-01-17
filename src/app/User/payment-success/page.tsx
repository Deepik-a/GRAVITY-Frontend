"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Calendar, ExternalLink } from "lucide-react";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
          <CheckCircle2 size={64} />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900">Payment Successful!</h1>
          <p className="text-gray-500 font-medium">
            Your consultation has been booked and confirmed.
          </p>
        </div>

        <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4 text-left">
          <div className="bg-green-100 p-2 rounded-lg text-green-600">
            <Calendar size={20} />
          </div>
          <div>
            <h3 className="font-bold text-green-900">What&apos;s Next?</h3>
            <p className="text-sm text-green-700 leading-relaxed">
              Check your dashboard for the meeting link and booking details. You will also receive an email confirmation shortly.
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <Link 
            href="/User/HomePage" 
            className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <span>Back to Dashboard</span>
            <ArrowRight size={18} />
          </Link>
          
          <button 
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
          >
            <ExternalLink size={18} />
            <span>Download Invoice</span>
          </button>
        </div>

        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest pt-4">
          Antigravity Gravity Reservation System
        </p>
      </div>
    </div>
  );
}

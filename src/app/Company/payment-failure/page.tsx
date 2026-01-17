"use client";

import React from "react";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
             <XCircle className="text-red-600 w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Failed</h1>
        <p className="text-gray-500 mb-8 font-medium">
          We couldn&apos;t process your payment. Please try again or contact support if the issue persists.
        </p>

        <div className="space-y-3">
            <Link 
              href="/Company/Subscription" 
              className="block w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Try Again
            </Link>
             <Link 
              href="/Company/CompanyDashBoard" 
              className="block w-full bg-white text-gray-900 border-2 border-gray-200 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Back to Dashboard
            </Link>
        </div>
      </div>
    </div>
  );
}

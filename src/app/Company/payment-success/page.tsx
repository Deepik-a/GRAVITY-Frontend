"use client";

import React, { useEffect, useState } from "react";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { verifySubscriptionSession } from "@/services/SubscriptionService";
import { toast } from "react-toastify";
// @ts-ignore
// import Confetti from 'react-confetti';

export default function PaymentSuccessPage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Verify session if ID exists
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get("session_id");
    
    if (sessionId) {
      verifySubscriptionSession(sessionId)
        .then((res) => {
          if (res.success) {
            toast.success("Subscription activated successfully!");
          }
        })
        .catch((err) => {
          console.error("Verification failed:", err);
          toast.error("Failed to verify subscription status automatically.");
        });
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={500} /> */}
      
      <div className="bg-white p-10 rounded-3xl shadow-2xl text-center max-w-md w-full border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
             <CheckCircle className="text-green-600 w-16 h-16" />
          </div>
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8 font-medium">
          Your subscription is now active. You can now manage your slots and enjoy premium features.
        </p>

        <div className="space-y-3">
            <Link 
              href="/Company/CompanyDashBoard" 
              className="block w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-black transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              Go to Dashboard
            </Link>
             <Link 
              href="/Company/CompanyProfile" 
              className="block w-full bg-white text-gray-900 border-2 border-gray-200 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              View Profile
            </Link>
        </div>
      </div>
    </div>
  );
}

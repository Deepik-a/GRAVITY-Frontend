"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, ArrowRight, Calendar, Loader2 } from "lucide-react";
import { verifyPaymentSession } from "@/services/UserService";
import { toast } from "react-toastify";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(false);
  const [invoice, setInvoice] = useState<{
    bookingId?: string;
    sessionId?: string;
    booking?: {
      id?: string;
      date: string;
      startTime: string;
      endTime: string;
      price?: number;
      companyId: string;
      companyDetails?: { name: string };
      paymentStatus: string;
      status: string;
    };
  } | null>(null);
  const verificationStarted = useRef(false);


  useEffect(() => {
    if (sessionId && !verificationStarted.current) {
      verificationStarted.current = true;
      const verify = async () => {
        try {
          const res = await verifyPaymentSession(sessionId);
          if (!res.success) {
            setError(true);
          } else {
            toast.success(res.message || "Booking confirmed successfully!");
          }
          setInvoice({
            bookingId: res.bookingId,
            sessionId: res.sessionId,
            booking: res.booking,
          });
        } catch (err) {
          console.error("Verification failed", err);
          setError(true);
        } finally {
          setVerifying(false);
        }
      };
      verify();
    } else if (!sessionId) {
      setVerifying(false);
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6 animate-in fade-in zoom-in duration-500">
        {verifying ? (
          <div className="py-12 flex flex-col items-center gap-4">
            <Loader2 size={64} className="text-blue-500 animate-spin" />
            <h2 className="text-xl font-bold text-gray-700">Confirming your booking...</h2>
          </div>
        ) : (
          <>
            <div className={`w-24 h-24 ${error ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'} rounded-full flex items-center justify-center mx-auto`}>
              {error ? (
                <div className="text-4xl font-black">!</div>
              ) : (
                <CheckCircle2 size={64} />
              )}
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-gray-900">
                {error ? "Payment Received" : "Payment Successful!"}
              </h1>
              <p className="text-gray-500 font-medium">
                {error 
                  ? "We've received your payment. It might take a moment to confirm your consultation." 
                  : "Your consultation has been booked and confirmed."}
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

            {invoice?.booking && (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 text-left">
                <h3 className="font-bold text-gray-900 mb-3">Payment details</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Company</span><span className="font-semibold">{invoice.booking.companyDetails?.name || "Company"}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Date</span><span className="font-semibold">{new Date(invoice.booking.date).toLocaleDateString()}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Time</span><span className="font-semibold">{invoice.booking.startTime} - {invoice.booking.endTime}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Amount</span><span className="font-semibold">₹{(invoice.booking.price || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between gap-4"><span className="text-gray-500">Status</span><span className="font-semibold">{invoice.booking.paymentStatus}</span></div>
                </div>
              </div>
            )}

            <div className="pt-4 space-y-3">
              <Link 
                href="/User/HomePage" 
                className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
              >
                <span>Back to Dashboard</span>
                <ArrowRight size={18} />
              </Link>
              
              {/* <button 
                onClick={handleDownloadInvoice}
                className="w-full flex items-center justify-center gap-2 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-2xl font-bold hover:bg-gray-50 transition-all active:scale-95"
              >
                <ExternalLink size={18} />
                <span>Download Invoice</span>
              </button> */}
            </div>
          </>
        )}

        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest pt-4">
         Gravity Reservation System
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
         <Loader2 size={64} className="text-blue-500 animate-spin" />
       </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}


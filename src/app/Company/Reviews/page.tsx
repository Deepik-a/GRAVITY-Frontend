"use client";
import React, { useEffect, useState } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import { Star, Loader2 } from "lucide-react";

export default function CompanyReviewsPage() {
    const [companyId, setCompanyId] = useState<string | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                if (user.id) setCompanyId(user.id);
            } catch (e) {
                console.error("Failed to parse user info", e);
            }
        }
    }, []);

    if (!companyId) {
        return (
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-bold tracking-tight">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Customer Sentiment</h2>
                    </div>
                    <p className="text-gray-500 font-medium ml-1">Monitor and respond to your clients&apos; professional experiences</p>
                </div>
            </div>

            <div className="bg-white/50 rounded-[2.5rem] p-2">
                <ReviewsSection companyId={companyId} isUser={false} />
            </div>
        </div>
    );
}


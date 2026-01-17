"use client";
import React, { useEffect, useState } from "react";
import ReviewsSection from "@/components/ReviewsSection";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CompanyReviewsPage() {
    const [companyId, setCompanyId] = useState<string | null>(null);

    useEffect(() => {
        // Get company ID from local storage
        const userInfo = localStorage.getItem("userInfo");
        if (userInfo) {
            try {
                const user = JSON.parse(userInfo);
                if (user.id) setCompanyId(user.id);
            } catch (e) {
                console.error("Failed to parse userInfo", e);
            }
        }
    }, []);

    if (!companyId) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <ToastContainer />
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Reviews</h1>
            <ReviewsSection companyId={companyId} isUser={false} />
        </div>
    );
}

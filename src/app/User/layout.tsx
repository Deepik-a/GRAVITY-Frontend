"use client";

import React from "react";
import UserNavbar from "@/components/user/UserNavbar";
import UserFooter from "@/components/user/UserFooter";
import { usePathname } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // List of pages that have hero sections and want the transparent navbar to overlap
  // We avoid adding top padding for these specific pages
  const noPaddingPages = [
    "/User/HomePage",
    "/User",
    "/User/CompanyPage",
    "/User/CompanyListing"
  ];

  const skipPadding = noPaddingPages.some(page => pathname === page || pathname.startsWith(page + "?"));

  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <div className="flex flex-col min-h-screen">
        <UserNavbar />
        <main className={`flex-grow ${!skipPadding ? "pt-16 sm:pt-20 lg:pt-24" : ""}`}>
          {children}
        </main>
        <UserFooter />
      </div>
    </ProtectedRoute>
  );
}

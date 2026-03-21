"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("user" | "company" | "admin")[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, role, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.replace("/signup?show=login");
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        router.replace("/unauthorized");
      }
    }
  }, [user, role, isLoading, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white flex-col gap-4">
        <div className="w-12 h-12 border-4 border-[rgb(210,152,4)] border-t-white rounded-full animate-spin"></div>
        <p className="text-[rgb(0,14,41)] font-bold animate-pulse">Verifying Session...</p>
      </div>
    );
  }

  if (!user || (allowedRoles && role && !allowedRoles.includes(role))) {
      return null;
  }

  return <>{children}</>;
};

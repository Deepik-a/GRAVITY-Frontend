"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Profile } from "@/types/AuthTypes";
import { getProfile, logout as apiLogout } from "@/services/AuthService";
import { getMyProfile as getCompanyProfile } from "@/services/CompanyService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUserProfile, clearUserProfile } from "@/redux/slices/userSlice";
import Cookies from "js-cookie";

interface AuthContextType {
  user: Profile | null;
  role: "user" | "company" | "admin" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: Profile, userRole: "user" | "company" | "admin") => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [role, setRole] = useState<"user" | "company" | "admin" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local state
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("companyProfile");
      localStorage.removeItem("adminId");
      
      Cookies.remove("documentStatus");

      setUser(null);
      setRole(null);
      
      toast.success("Logged out successfully");
      
      // Redirect based on role
      if (role === "admin") {
        router.replace("/Login");
      } else if (role === "company") {
        router.replace("/signup?show=login");
      } else {
        // Default for users or others
        router.replace("/signup?show=login");
      }
    }
  }, [router, role]);

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const storedRole = localStorage.getItem("role") as "user" | "company" | "admin" | null;
    
    if (!storedRole) {
      setUser(null);
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      let profileData;
      if (storedRole === "admin") {
          // Admin might not have a /me endpoint yet, but we can check localStorage
          const storedUser = localStorage.getItem("user");
          profileData = storedUser ? JSON.parse(storedUser) : null;
          if (!profileData) throw new Error("No admin session");
      } else if (storedRole === "company") {
        profileData = await getCompanyProfile();
      } else {
        profileData = await getProfile();
      }

      // For companies, display the profile's companyName (if present) in UI elements
      // that rely on `user.name` (sidebar/topbar).
      const normalizedProfile =
        storedRole === "company"
          ? ({
              ...profileData,
              name: (profileData as { profile?: { companyName?: string } }).profile?.companyName || (profileData as { name?: string }).name,
            } as Profile)
          : (profileData as Profile);

      setUser(normalizedProfile);
      setRole(storedRole);

      // Keep localStorage `user` in sync so non-context consumers update correctly.
      localStorage.setItem("user", JSON.stringify(normalizedProfile));
    } catch (error: unknown) {
      console.error("Auth check failed:", error);
      // If unauthorized, clear session
      const errorMessage = error instanceof Error ? error.message : "";
      const isUnauthorized = errorMessage.includes("Unauthorized") || (error as { response?: { status?: number } }).response?.status === 401;

      if (isUnauthorized) {
          localStorage.removeItem("user");
          localStorage.removeItem("role");
          setUser(null);
          setRole(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    const onPageShow = async (event: PageTransitionEvent) => {
      // When a page is restored from the browser back/forward cache, React state can be stale.
      if (!event.persisted) return;

      await checkAuth();

      // If the session is gone, ensure we don't keep showing protected UI.
      const path = window.location.pathname;
      const isProtected =
        path.startsWith("/User") || path.startsWith("/Company") || path.startsWith("/Admin");

      const storedRole = localStorage.getItem("role") as
        | "user"
        | "company"
        | "admin"
        | null;

      if (isProtected && !storedRole) {
        if (path.startsWith("/Admin")) {
          router.replace("/Login");
        } else if (path.startsWith("/Company")) {
          router.replace("/signup?show=login");
        } else {
          router.replace("/signup?show=login");
        }
      }
    };

    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, [checkAuth, router]);

  const login = (userData: Profile, userRole: "user" | "company" | "admin") => {
    setUser(userData);
    setRole(userRole);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("role", userRole);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      dispatch(setUserProfile({
        name: user.name,
        profileImage: user.profileImage
      }));
    } else {
      dispatch(clearUserProfile());
    }
  }, [user, dispatch]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

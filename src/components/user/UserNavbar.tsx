"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, ChevronDown, Bell, Menu, X } from "lucide-react";
import { getProfile } from "@/services/AuthService";
import { Profile } from "@/types/AuthTypes";
import Image from "next/image";
import { resolveImageUrl } from "@/utils/urlHelper";

export default function UserNavbar() {
  const router = useRouter();
  const [user, setUser] = useState<Profile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const profile = await getProfile();
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
        // If profile fetch fails, we might still have basic info in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    fetchUser();

    // Listen for custom "userUpdate" event
    const handleUserUpdate = () => fetchUser();
    window.addEventListener("userUpdate", handleUserUpdate);

    // Listen for storage changes (for multiple tabs)
    window.addEventListener("storage", handleUserUpdate);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("userUpdate", handleUserUpdate);
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/Login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/User/HomePage" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-[rgb(0,14,41)] rounded-xl flex items-center justify-center border-2 border-[rgb(210,152,4)] group-hover:scale-110 transition-transform">
              <span className="text-[rgb(210,152,4)] font-black text-xl">G</span>
            </div>
            <span
              className={`text-2xl font-black tracking-tighter transition-colors duration-300 ${
                scrolled ? "text-[rgb(0,14,41)]" : "text-white"
              }`}
            >
              GRAVITY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/User/HomePage"
              className={`text-sm font-bold uppercase tracking-wider hover:text-[rgb(210,152,4)] transition-colors ${
                scrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Home
            </Link>
            <Link
              href="/User/Search"
              className={`text-sm font-bold uppercase tracking-wider hover:text-[rgb(210,152,4)] transition-colors ${
                scrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Companies
            </Link>
            <Link
              href="#"
              className={`text-sm font-bold uppercase tracking-wider hover:text-[rgb(210,152,4)] transition-colors ${
                scrolled ? "text-gray-700" : "text-white/90"
              }`}
            >
              Projects
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <button
                  className={`p-2 rounded-full hover:bg-gray-100 transition-colors relative ${
                    scrolled ? "text-gray-600" : "text-white"
                  }`}
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 p-1 rounded-full hover:bg-black/5 transition-all"
                  >
                    <div className="w-9 h-9 rounded-full border-2 border-[rgb(210,152,4)] overflow-hidden bg-gray-200 relative">
                      {user.profileImage ? (
                        <Image
                          src={resolveImageUrl(user.profileImage) || ""}
                          alt={user.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[rgb(0,14,41)] text-[rgb(210,152,4)] text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      } ${scrolled ? "text-gray-600" : "text-white"}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-sm font-black text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link
                        href="/User/UserProfile"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User size={18} className="text-gray-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/Login"
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    scrolled
                      ? "text-[rgb(0,14,41)] hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2 bg-[rgb(210,152,4)] text-white rounded-xl text-sm font-bold hover:shadow-lg hover:bg-[rgb(180,132,4)] transition-all"
                >
                  Join Us
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-lg ${
                scrolled ? "text-gray-600" : "text-white"
              }`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col gap-4">
            <Link
              href="/User/HomePage"
              className="text-gray-700 font-bold py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/User/Search"
              className="text-gray-700 font-bold py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Companies
            </Link>
            <Link
              href="#"
              className="text-gray-700 font-bold py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            {!user && (
              <div className="flex flex-col gap-2 pt-4 border-t border-gray-50">
                <Link
                  href="/Login"
                  className="w-full text-center py-3 rounded-xl font-bold text-gray-700 bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center py-3 rounded-xl font-bold text-white bg-[rgb(210,152,4)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

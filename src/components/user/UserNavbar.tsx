"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { User, LogOut, ChevronDown, Menu, X, Settings, Heart, Home, Briefcase, Star, Bell, Search, Calendar } from "lucide-react";
import Image from "next/image";
import { resolveImageUrl } from "@/utils/urlHelper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NotificationBell from "../notifications/NotificationBell";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

export default function UserNavbar() {
  const { user: authUser, role, logout } = useAuth();
  const reduxUser = useSelector((state: RootState) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = reduxUser.name || authUser?.name || "User";
  const profileImage = reduxUser.profileImage || authUser?.profileImage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const profileImageUrl = profileImage ? resolveImageUrl(profileImage) : null;
  const bellRole = role === "user" || role === "company" ? role : null;

  const navLinks = [
    { name: "Home", href: "/User/HomePage", icon: Home },
    { name: "Find Professionals", href: "/User/CompanyListing", icon: Briefcase },
    { name: "Favorites", href: "/User/UserProfile?section=favourites", icon: Heart },
  ];

  const mobileLinks = [
    ...navLinks,
    { name: "My Appointments", href: "/User/UserProfile?section=consultations", icon: Calendar },
  ];

  // Gradient style for hover effects
  const gradientHoverStyle = {
    background: "linear-gradient(to right, #020D2E, #0F2FA8)",
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg"
            : "bg-gradient-to-b from-black/30 to-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">

            {/* Logo Section - Larger with Glow Effect */}
            <Link 
              href="/User/HomePage" 
              className="flex items-center gap-3 group relative"
            >
              {/* Glow effect behind logo */}
              <div className="absolute -inset-2 bg-gradient-to-r from-[#020D2E]/20 to-[#0F2FA8]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Logo Image - Larger */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 relative transition-all duration-300 group-hover:scale-105">
                <Image
                  src="/assets/Logo.png"
                  alt="Gravity Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              
              {/* Text with Glow Effect */}
              <div className="flex flex-col">
                <div className="relative">
                  <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight">
                    <span 
                      className={`transition-all duration-300 ${
                        isScrolled 
                          ? "text-[#020D2E]" 
                          : "text-white drop-shadow-lg"
                      } group-hover:bg-gradient-to-r group-hover:from-[#020D2E] group-hover:to-[#0F2FA8] group-hover:bg-clip-text group-hover:text-transparent`}
                    >
                      GRA
                    </span>
                    <span 
                      className={`transition-all duration-300 ${
                        isScrolled 
                          ? "text-[#EEB21B]" 
                          : "text-[#EEB21B] drop-shadow-lg"
                      }`}
                    >
                      VITY
                    </span>
                  </span>
                  {/* Text glow effect on hover */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#020D2E]/30 to-[#0F2FA8]/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                </div>
                <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-semibold tracking-wider ${
                  isScrolled ? "text-gray-400" : "text-white/70"
                }`}>
                  BUILD WITH TRUST
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-4 lg:px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 group ${
                      isScrolled
                        ? "text-gray-700 hover:text-white"
                        : "text-white/90 hover:text-white"
                    }`}
                    onMouseEnter={() => setActiveLink(link.name)}
                    onMouseLeave={() => setActiveLink("")}
                    style={activeLink === link.name ? gradientHoverStyle : undefined}
                  >
                    <span className="flex items-center gap-2 relative z-10">
                      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      {link.name}
                    </span>
                    {activeLink === link.name && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-full -z-0"
                        style={gradientHoverStyle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Actions */}
            <div className="hidden md:flex items-center gap-4">
            

              {/* Notifications with Gradient Hover */}
              {authUser && bellRole && (
              <div className="relative group">
  <div
    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
    style={gradientHoverStyle}
  />
  <div className={`relative z-10 transition-all duration-300 ${
    isScrolled ? "[&_*]:text-[#020D2E] [&_svg]:text-[#020D2E] [&_svg]:stroke-[#020D2E]" : "[&_svg]:text-white [&_svg]:stroke-white"
  }`}>
    <NotificationBell currentUser={{ id: authUser.id, role: bellRole }} />
  </div>
</div>
              )}

              {/* User Dropdown with Gradient Hover */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3 px-2 py-1.5 rounded-full transition-all duration-300 relative overflow-hidden group ${
                    isScrolled
                      ? "hover:text-white border border-transparent hover:border-transparent"
                      : "hover:text-white"
                  } ${isDropdownOpen ? (isScrolled ? "text-white" : "bg-white/10") : ""}`}
                >
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={gradientHoverStyle}></div>
                  
                  <div className="relative z-10">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#EEB21B] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                        {profileImageUrl ? (
                          <Image
                            src={profileImageUrl}
                            alt={displayName}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <User className="w-full h-full p-2 text-gray-500" />
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:block text-left relative z-10">
                    <p className={`text-sm font-bold leading-tight ${
                      isScrolled ? "text-[#020D2E] group-hover:text-white" : "text-white"
                    } transition-colors duration-300`}>
                      {displayName.split(" ")[0]}
                    </p>
                    <p className={`text-[10px] font-medium ${
                      isScrolled ? "text-gray-500 group-hover:text-white/80" : "text-white/60"
                    } transition-colors duration-300`}>
                      {role === "user" ? "Homeowner" : "Professional"}
                    </p>
                  </div>
                  
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 relative z-10 ${
                      isDropdownOpen ? "rotate-180" : ""
                    } ${isScrolled ? "text-gray-500 group-hover:text-white" : "text-white/70"} transition-colors duration-300`}
                  />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20"
                      >
                        {/* User Header with Gradient */}
                        <div className="px-4 py-4" style={gradientHoverStyle}>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#EEB21B] bg-white/10 relative">
                              {profileImageUrl ? (
                                <Image
                                  src={profileImageUrl}
                                  alt={displayName}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <User className="w-full h-full p-2 text-white" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-base text-white">{displayName}</p>
                              <p className="text-xs text-white/70">{authUser?.email}</p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <MenuItem 
                            href="/User/UserProfile" 
                            icon={User} 
                            label="View Profile" 
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <MenuItem 
                            href="/User/UserProfile?section=consultations" 
                            icon={Calendar} 
                            label="My Appointments" 
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <MenuItem 
                            href="/User/UserProfile?section=favourites" 
                            icon={Heart} 
                            label="Saved Professionals" 
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          <MenuItem 
                            href="/User/UserProfile?section=settings" 
                            icon={Settings} 
                            label="Settings & Password" 
                            onClick={() => setIsDropdownOpen(false)}
                          />
                          
                          <div className="border-t border-gray-100 my-2"></div>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                          >
                            <LogOut className="w-4 h-4 mr-3 transition-transform group-hover:-translate-x-0.5" />
                            <span className="font-medium">Logout</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
              {authUser && bellRole && <NotificationBell currentUser={{ id: authUser.id, role: bellRole }} />}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isScrolled
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile User Profile with Gradient */}
                <div className="flex items-center gap-4 pb-6 mb-4 border-b border-gray-100">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#EEB21B] bg-gradient-to-br from-gray-100 to-gray-200 relative">
                    {profileImageUrl ? (
                      <Image
                        src={profileImageUrl}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <User className="w-full h-full p-3 text-gray-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#020D2E] text-lg">{displayName}</p>
                    <p className="text-sm text-gray-500">{authUser?.email}</p>
                    <Link 
                      href="/User/UserProfile" 
                      className="text-xs text-[#EEB21B] font-semibold mt-1 inline-block"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      View Profile →
                    </Link>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  {mobileLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-white transition-all duration-200 group relative overflow-hidden"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={gradientHoverStyle}></div>
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors relative z-10" />
                        <span className="font-semibold relative z-10 group-hover:text-white">{link.name}</span>
                      </Link>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <div className="pt-6 mt-6 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 group"
                  >
                    <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// Helper Component for Menu Items
const MenuItem = ({ href, icon: Icon, label, onClick }: any) => (
  <Link
    href={href}
    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-white transition-all duration-300 group relative overflow-hidden"
    onClick={onClick}
  >
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to right, #020D2E, #0F2FA8)" }}></div>
    <Icon className="w-4 h-4 mr-3 transition-transform group-hover:scale-110 relative z-10 group-hover:text-white" />
    <span className="font-medium relative z-10 group-hover:text-white">{label}</span>
  </Link>
);
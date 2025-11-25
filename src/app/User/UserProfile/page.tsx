"use client";
import React, { useState, useEffect } from "react";
import { getProfile } from "@/services/authService";
import { Profile } from "@/types/authTypes";
import { extractAxiosError } from "@/utils/handleAxiosError";
import { toast } from "react-toastify";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Settings,
  Crown,
  TrendingUp,
  Star,
  Camera,
  Menu,
  X,
  Edit,
} from "lucide-react";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setIsEditModalOpen] = useState(false);

  // ✅ Profile state and loading
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch profile from backend
  useEffect(() => {
    let mounted = true;

    getProfile()
      .then((profile) => {
        if (!mounted) return;
        setProfileData(profile);
      })
      .catch((error) => {
        const message = extractAxiosError(error);
        console.error("❌ Profile Fetch Error:", message);
        toast.error(message);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  // ✅ Handle profile edits
  // const handleInputChange = (field: keyof Profile, value: string) => {
  //   setProfileData((prev) =>
  //     prev ? { ...prev, [field]: value } : { [field]: value } as Profile
  //   );
  // };

  // const handleSaveChanges = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Saving profile data:", profileData);
  //   setIsEditModalOpen(false);
  // };

  // ✅ Get initials safely
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // 🕓 Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-[#081c45] text-lg font-semibold animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // 🚫 No profile found
  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 mb-2 text-lg">No profile found.</p>
        <p className="text-sm text-gray-500">Please log in again.</p>
      </div>
    );
  }

  // ✅ Sidebar nav items
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "consultations", label: "Consultations", icon: Calendar },
    { id: "favourites", label: "Favourites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // ✅ Ads
  const ads = [
    {
      icon: Crown,
      badge: "PREMIUM LISTING",
      title: "Luxury Penthouse",
      location: "Downtown Manhattan",
      price: "$2.5M",
      shape: "rounded-tl-3xl rounded-br-3xl",
    },
    {
      icon: TrendingUp,
      badge: "",
      title: "Modern Villa",
      location: "Beverly Hills",
      price: "$3.8M",
      shape: "rounded-tr-3xl rounded-bl-3xl",
    },
    {
      icon: Star,
      badge: "NEW LISTING",
      title: "Waterfront Condo",
      location: "Miami Beach",
      price: "$1.2M",
      shape: "rounded-[25px_10px_25px_10px]",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex flex-col lg:flex-row">
        {/* 🔹 Mobile Header */}
        <div className="lg:hidden bg-gradient-to-br from-[#081c45] to-[#1e40af] p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
          <h1 className="text-2xl font-bold text-[#EEB21B]">My Dashboard</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* 🔹 Sidebar */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 z-40
            w-full sm:w-80 bg-white shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto lg:min-h-screen flex flex-col`}
        >
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-[#081c45] to-[#1e40af] flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[#EEB21B] to-[#FFD700] rounded-full flex items-center justify-center text-[#081c45] text-xl font-bold shadow-lg">
                {getInitials(profileData.name)}
              </div>
              <button className="absolute -bottom-1 -right-1 bg-[#081c45] text-white p-1 rounded-full shadow-lg hover:bg-[#061633] transition-all border-2 border-white">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#EEB21B] truncate">
                My Dashboard
              </h1>
              <p className="text-white font-semibold text-sm truncate">
                {profileData.name}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Ads */}
          <div className="px-4 mt-8 pb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
              Featured Properties
            </h3>
            {ads.map((ad, i) => {
              const Icon = ad.icon;
              return (
                <div
                  key={i}
                  className={`border-2 border-[#FFD700] bg-gradient-to-br from-[#FFF9E6] to-[#FFFBF0]
                    p-4 mb-4 ${ad.shape} transform hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl cursor-pointer animate-fade-in`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {ad.badge && (
                    <div className="flex items-center mb-2">
                      <Icon className="w-4 h-4 text-[#FFD700] mr-2" />
                      <span className="text-xs font-bold text-[#081c45]">{ad.badge}</span>
                    </div>
                  )}
                  <h4 className="font-semibold text-sm text-[#081c45]">{ad.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {ad.location} • {ad.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 🔹 Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {activeSection === "overview" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#081c45] mb-2">
                 {JSON.stringify(profileData, null, 2)}
                Welcome Back, {profileData.name}!
              </h1>
              <p className="text-gray-600">Here’s your dashboard overview.</p>
            </div>
          )}

          {activeSection === "settings" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#081c45] mb-6">
                Account Settings
              </h1>
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#081c45]">
                    Profile Information
                  </h3>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white shadow-lg px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-[#081c45]">
                      Full Name
                    </label>
                    <div className="border rounded-lg p-3.5 text-[#081c45]">{profileData.name}</div>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#081c45]">
                      Email
                    </label>
                    <div className="border rounded-lg p-3.5 text-gray-400
                    ">{profileData.email}</div>
                  </div>
                
                    <div>
                      <label className="text-sm font-semibold text-[#081c45]">
                        Phone
                      </label>
                      <div className="border rounded-lg p-3.5 text-[#081c45]">  {profileData.location || <span className="text-gray-400">Not provided</span>}</div>
                    </div>
               
                 
                    <div>
                      <label className="text-sm font-semibold text-[#081c45]">
                        Location
                      </label>
                      <div className="border rounded-lg p-3.5 text-[#081c45]">
                        {profileData.location || <span className="text-gray-400">Not provided</span>}
                      </div>
                    </div>
                  
                 
                    <div>
                      <label className="text-sm font-semibold text-[#081c45]">Bio</label>
                      <div className="border rounded-lg p-3.5 text-[#081c45]"> {profileData.bio || <span className="text-gray-400">Not provided</span>}</div>
                    </div>
                  
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔹 Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;

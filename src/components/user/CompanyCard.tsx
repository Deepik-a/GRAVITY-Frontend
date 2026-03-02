"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { resolveImageUrl } from "@/utils/urlHelper";

export interface Company {
  id: string;
  name: string;
  email: string;
  profile?: {
    companyName?: string;
    categories: string[];
    services: string[];
    consultationFee: number;
    establishedYear: number;
    companySize: string;
    overview: string;
    brandIdentity?: {
      banner1?: string;
    };
  };
}

interface CompanyCardProps {
  company: Company;
  index: number;
  isFavourite: boolean;
  onToggleFavourite: (e: React.MouseEvent, companyId: string) => void;
}

// optimized: Using React.memo to prevent unnecessary re-renders of list items
export const CompanyCard = React.memo(({ 
  company, 
  index, 
  isFavourite, 
  onToggleFavourite 
}: CompanyCardProps) => {
  return (
    <div 
      className="glass-effect rounded-2xl overflow-hidden card-hover flex flex-col animate-fadeInUp bg-white border border-gray-100 shadow-sm"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        className="relative h-48 bg-cover bg-center transition-all duration-700 hover:scale-110"
        style={{ backgroundImage: `url('${resolveImageUrl(company.profile?.brandIdentity?.banner1) || '/assets/apart3.jpg'}')` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        <button
          onClick={(e) => onToggleFavourite(e, company.id)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300 z-10 group/btn"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${isFavourite ? "fill-red-500 text-red-500" : "text-gray-600 group-hover/btn:text-red-500"}`} 
          />
        </button>

        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-gray-900 text-xs font-bold rounded-full shadow-lg">
            {company.profile?.establishedYear ? `${new Date().getFullYear() - company.profile.establishedYear}+ Years` : 'Verified'}
          </span>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-2 text-white drop-shadow-lg">
            <span className="text-2xl">⭐</span>
            <span className="font-bold text-lg">4.8</span>
            <span className="text-sm opacity-90">(Verified Professional)</span>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1 hover:text-[#0F1E50] transition-colors duration-300">
              {company.profile?.companyName || company.name}
            </h3>
            <p className="text-[#FFD700] font-semibold text-sm line-clamp-1 mt-1">
              {company.profile?.categories.join(' • ')}
            </p>
          </div>
          <div className="text-right ml-4">
            <div className="text-2xl font-bold text-[#0F1E50]">₹{company.profile?.consultationFee}</div>
            <div className="text-xs text-gray-600 uppercase tracking-wider font-medium">Fee</div>
          </div>
        </div>
        <p className="text-gray-700 mb-4 line-clamp-2 text-sm flex-1">
          {company.profile?.overview || 'Leading construction and design firm providing exceptional quality services for residential and commercial projects.'}
        </p>
        <div className="flex flex-wrap gap-2 mb-5">
          {company.profile?.services.slice(0, 3).map((service: string) => (
            <span 
              key={service} 
              className="px-3 py-1 bg-gradient-to-r from-[#0F1E50]/10 to-[#1A3A8F]/10 text-[#0F1E50] text-xs font-semibold rounded-full border border-[#0F1E50]/20 transition-all duration-300 hover:scale-105 hover:bg-[#0F1E50] hover:text-white"
            >
              {service}
            </span>
          ))}
          {company.profile?.services && company.profile.services.length > 3 && (
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full border border-gray-200">
              +{company.profile.services.length - 3} more
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link 
            href={`/User/CompanyPage?id=${company.id}`}
            className="px-4 py-3 border-2 border-[#0F1E50] bg-transparent text-[#0F1E50] text-center font-bold rounded-xl hover:bg-[#0F1E50] hover:text-white shadow-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 group"
          >
            <span className="flex items-center justify-center gap-2">
              View Portfolio
            </span>
          </Link>
          <Link
            href={`/User/BookSlots?companyId=${company.id}`}
            className="px-4 py-3 bg-gradient-to-r from-[#0F1E50] via-[#1A3A8F] to-[#0F1E50] text-white text-center font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-[#FFD700]/30 transform transition-all duration-300 hover:scale-105 hover:from-[#1A3A8F] hover:via-[#0F1E50] hover:to-[#1A3A8F] group"
          >
            <span className="flex items-center justify-center gap-2">
              Book Now
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
});

CompanyCard.displayName = "CompanyCard";

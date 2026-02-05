"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { searchCompanies, verifyCompany, toggleCompanyBlockStatus } from "../../../services/AdminService";
import { CompanyProfile } from "@/types/AuthTypes";
import { toast } from "react-toastify";
import { Search, Filter, ShieldAlert, ShieldCheck, Eye, X, MapPin, ImageOff, MessageSquare, Video, Info } from "lucide-react";
import DataTable from '../../../app/Admin/DataTable';  
import { resolveImageUrl } from "@/utils/urlHelper";

const CompanyManagementPage = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string>("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");
  // 🔹 DEBOUNCING STATE
const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 7;

  // Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedCompanyForDrawer, setSelectedCompanyForDrawer] = useState<CompanyProfile | null>(null);

  // 🔹 DEBOUNCING EFFECT (👇 )
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchTerm);
  }, 500); // 500ms debounce delay

  return () => clearTimeout(timer);
}, [searchTerm]);

  /* ---------------- Refs ---------------- */
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus search input on mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const res = await searchCompanies(
        debouncedSearch.trim(),
        currentPage,
        itemsPerPage,
        filterStatus
      );
      console.log(res,"Fetched Companies:");
      setCompanies(res.companies);
      setTotalItems(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      setError((err as Error).message);
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, currentPage, filterStatus]);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleToggleBlock = async (id: string, currentStatus: boolean) => {
    try {
      await toggleCompanyBlockStatus(id, !currentStatus);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isBlocked: !currentStatus } : c))
      );
      toast.info(`Company ${currentStatus ? "unblocked" : "blocked"} successfully`);
    } catch {
      toast.error("Failed to update account status");
    }
  };

  const handleVerify = async (companyId: string, approve: boolean, reason?: string) => {
    try {
      await verifyCompany(companyId, approve, reason);
      toast.success(`Company ${approve ? "accepted" : "rejected"} successfully!`);
      // Optionally refresh companies to show updated status
      fetchCompanies();
    } catch {
      toast.error("Failed to update document status");
    }
  };

  const submitRejection = async () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    await handleVerify(currentCompanyId!, false, rejectReason);
    setShowRejectModal(false);
    setRejectReason("");
    setCurrentCompanyId(null);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, filterStatus]);

  const columns = [
    {
      header: "Company",
      render: (company: CompanyProfile) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900">{company.name}</span>
          <span className="text-sm text-gray-500">{company.email}</span>
        </div>
      ),
    },
    {
      header: "Phone",
      render: (company: CompanyProfile) => (
        <span className="text-gray-700">{company.phone || "Not Provided"}</span>
      ),
    },
    {
      header: "Docs Status",
      render: (company: CompanyProfile) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase
            ${company.documentStatus === "verified" ? "bg-green-100 text-green-700" : ""}
            ${company.documentStatus === "rejected" ? "bg-red-100 text-red-700" : ""}
            ${company.documentStatus === "pending" ? "bg-yellow-100 text-yellow-700" : ""}
          `}
        >
          {company.documentStatus}
        </span>
      ),
    },
    {
      header: "Acc. Status",
      render: (company: CompanyProfile) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${company.isBlocked ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
          {company.isBlocked ? 'BLOCKED' : 'ACTIVE'}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (company: CompanyProfile) => (
        <div className="flex gap-3 items-center">
          {/* View Documents */}
          <button
            onClick={() => { setSelectedCompany(company); setShowViewModal(true); }}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold text-sm"
            title="View Documents"
          >
            <Eye size={18} /> Docs
          </button>

          {/* See Profile Drawer */}
          <button
            onClick={() => { 
                if (company.isProfileFilled) {
                    setSelectedCompanyForDrawer(company); 
                    setShowDrawer(true); 
                } else {
                    toast.warning("Profile details not completed by company yet.");
                }
            }}
            className={`${company.isProfileFilled ? 'text-indigo-600 hover:text-indigo-800' : 'text-gray-300 cursor-not-allowed'} flex items-center gap-1 font-bold text-sm`}
            title={company.isProfileFilled ? "See Full Profile" : "Profile Incomplete"}
          >
            <Info size={18} /> Profile
          </button>

          {/* Edit */}
          {/* <button className="text-gray-600 hover:text-gray-900" title="Edit Company">
            <Edit3 size={18} />
          </button> */}

          {/* Block/Unblock */}
          <button
            onClick={() => handleToggleBlock(company.id, !!company.isBlocked)}
            className={`${company.isBlocked ? 'text-green-600' : 'text-red-600'} hover:opacity-70`}
            title={company.isBlocked ? "Unblock Company" : "Block Company"}
          >
            {company.isBlocked ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
          </button>

          {/* Verification Logic */}
          {company.documentStatus === "pending" && (
            <div className="flex gap-2 border-l pl-3 ml-1">
              <button
                onClick={() => handleVerify(company.id, true)}
                className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => { setCurrentCompanyId(company.id); setShowRejectModal(true); }}
                className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <h1 className="text-3xl font-black mb-6 text-gray-800 tracking-tight">Company Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search company by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-base"
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter className="text-gray-500 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as "all" | "pending" | "verified" | "rejected")}
            className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white font-bold text-sm"
          >
            <option value="all">Filter: All Status</option>
            <option value="pending">Status: Pending</option>
            <option value="verified">Status: Verified</option>
            <option value="rejected">Status: Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-gray-500 font-bold">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading companies...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={companies}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white text-black p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-2xl font-black text-gray-900">
                {selectedCompany.name} <span className="text-gray-400 font-normal">| Documents</span>
              </h2>
              <button onClick={() => setShowViewModal(false)} className="text-gray-500 hover:text-black text-2xl">×</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(selectedCompany.documents || {}).length > 0 ? (
                Object.entries(selectedCompany.documents).map(([key, value]) => (
                  <div key={key} className="flex flex-col border border-gray-200 p-5 rounded-xl bg-gray-50">
                    <p className="font-black mb-4 capitalize text-gray-800 text-lg border-b pb-2">{key.replace(/_/g, " ")}</p>
                    {resolveImageUrl(value) ? (
                      <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden border border-gray-300 shadow-inner">
                        <Image src={resolveImageUrl(value)!} alt={key} fill className="object-contain p-2" unoptimized />
                      </div>
                    ) : (
                      <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg text-gray-500 font-black italic">
                        Not Provided
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 text-center py-20 text-gray-400 font-bold text-xl uppercase tracking-widest">
                  No documents found for this company
                </div>
              )}
            </div>
            
            <div className="flex justify-end mt-10">
              <button onClick={() => setShowViewModal(false)} className="px-10 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-black uppercase tracking-widest text-sm shadow-lg">
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-[450px]">
            <h2 className="text-2xl font-black mb-4 text-red-600 uppercase tracking-tight">Reject Application</h2>
            <p className="mb-4 text-gray-600 font-medium">Please specify the reason for rejection (this will be sent to the company).</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-4 h-40 focus:ring-2 focus:ring-red-500 outline-none resize-none text-base shadow-inner bg-gray-50"
              placeholder="e.g., Business license has expired..."
            />
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setShowRejectModal(false)} className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 font-bold text-gray-700">Cancel</button>
              <button onClick={submitRejection} className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-black uppercase shadow-lg">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {/* Side Drawer for Profile Details */}
      <CompanyDetailsDrawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)} 
        company={selectedCompanyForDrawer} 
      />
    </div>
  );
};

/* ---------------- Drawer Component ---------------- */
const CompanyDetailsDrawer = ({ 
    isOpen, 
    onClose, 
    company 
  }: { 
    isOpen: boolean; 
    onClose: () => void; 
    company: CompanyProfile | null 
  }) => {
    if (!company) return null;
  
    return (
      <div className="text-black">
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-500 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
          onClick={onClose}
        />
        
        {/* Drawer Panel */}
        <div 
          className={`fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-[70] transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}
        >
          {/* Drawer Header */}
          <div className="sticky top-0 bg-white/90 backdrop-blur-md z-10 px-8 py-6 border-b border-gray-100 flex justify-between items-center shadow-sm">
            <div>
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{company.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${company.documentStatus === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {company.documentStatus}
                </span>
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">•</span>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Full Profile View</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-all active:scale-95 text-gray-400 hover:text-gray-900 border border-gray-100"
            >
              <X size={24} />
            </button>
          </div>
  
          {/* Drawer Content */}
          <div className="p-8 space-y-12">
            
            {/* Hero Section */}
            <div className="relative h-56 rounded-3xl overflow-hidden bg-gray-900 shadow-2xl group">
              {resolveImageUrl(company.profile?.brandIdentity?.banner1) ? (
                <Image 
                  src={resolveImageUrl(company.profile!.brandIdentity!.banner1)!} 
                  alt="Banner" 
                  fill 
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                  unoptimized
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 opacity-80" />
              )}
              
              <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-2xl overflow-hidden relative transform rotate-3">
                    <Image 
                      src={resolveImageUrl(company.profile?.brandIdentity?.logo) || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=6366f1&color=fff&bold=true`} 
                      alt="Logo" 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="text-white">
                    <p className="text-indigo-400 font-black text-xs uppercase tracking-[0.2em] mb-1">Established {company.profile?.establishedYear}</p>
                    <h3 className="text-3xl font-black">{company.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-white/70">
                        <MapPin size={16} className="text-indigo-400" />
                        <span className="text-sm font-bold">{company.location || 'Pan India Service'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: 'Completed', value: company.profile?.projectsCompleted || 0, sub: 'Projects', color: 'bg-blue-50 text-blue-700' },
                { label: 'Customers', value: company.profile?.happyCustomers || 0, sub: 'Happy', color: 'bg-green-50 text-green-700' },
                { label: 'Awards', value: company.profile?.awardsWon || 0, sub: 'Recognitions', color: 'bg-purple-50 text-purple-700' },
                { label: 'Consultation', value: `₹${company.profile?.consultationFee}`, sub: 'Per Visit', color: 'bg-orange-50 text-orange-700' }
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} p-4 rounded-2xl border border-current/10 text-center flex flex-col items-center justify-center`}>
                  <p className="text-[10px] font-black uppercase tracking-tighter opacity-60 mb-1">{stat.label}</p>
                  <p className="text-xl font-black leading-none mb-1">{stat.value}</p>
                  <p className="text-[9px] font-bold uppercase tracking-widest opacity-60">{stat.sub}</p>
                </div>
              ))}
            </div>
  
            {/* Overview */}
            <section className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase mb-4 tracking-[0.3em] flex items-center gap-3">
                <span className="w-8 h-[2px] bg-indigo-600 rounded-full" />
                The Story
              </h3>
              <p className="text-gray-700 leading-relaxed font-semibold text-lg italic">
                &quot;{company.profile?.overview || 'No description available for this specialist.'}&quot;
              </p>
            </section>
  
            {/* Domain Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <section>
                <h3 className="text-xs font-black text-indigo-600 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                    Expertise
                    <div className="flex-1 h-px bg-indigo-100" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.profile?.categories?.map((cat, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-xl text-xs font-black shadow-sm hover:border-indigo-400 transition-colors">
                      {cat}
                    </span>
                  )) || <span className="text-gray-400 font-bold">General Contractor</span>}
                </div>
              </section>
              <section>
                <h3 className="text-xs font-black text-purple-600 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                    Core Services
                    <div className="flex-1 h-px bg-purple-100" />
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.profile?.services?.map((svc, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-gray-200 text-gray-800 rounded-xl text-xs font-black shadow-sm hover:border-purple-400 transition-colors">
                      {svc}
                    </span>
                  )) || <span className="text-gray-400 font-bold">Consultation</span>}
                </div>
              </section>
            </div>
  
            {/* Portfolio Spotlight */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                    Portfolio Spotlight
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{company.profile?.projects?.length || 0} Showcases</span>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                {company.profile?.projects?.map((proj) => (
                  <div key={proj.id} className="group flex flex-col gap-3">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md">
                      {resolveImageUrl(proj.afterImage) ? (
                        <Image src={resolveImageUrl(proj.afterImage)!} alt={proj.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                          <ImageOff size={32} strokeWidth={1} />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded text-[10px] font-black uppercase tracking-widest shadow-sm">Featured</span>
                      </div>
                    </div>
                    <div>
                        <h4 className="font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{proj.title}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed mt-1">{proj.description}</p>
                    </div>
                  </div>
                )) || (
                    <div className="col-span-2 py-10 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 gap-3">
                        <ImageOff size={40} strokeWidth={1} />
                        <p className="font-black uppercase tracking-widest text-xs">No active portfolio items</p>
                    </div>
                )}
              </div>
            </section>
  
            {/* Capabilities */}
            <section className="bg-black rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity" />
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                    <div>
                        <h3 className="text-xl font-black mb-6 flex items-center gap-3">
                            <div className="w-1 h-8 bg-indigo-500 rounded-full" />
                            Digital Capabilities
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Priority Messaging', active: company.profile?.contactOptions?.chatSupport, icon: <MessageSquare size={18}/> },
                                { label: 'Video Consultation', active: company.profile?.contactOptions?.videoCalls, icon: <Video size={18}/> }
                            ].map((cap, i) => (
                                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${cap.active ? 'border-indigo-500/50 bg-indigo-500/10' : 'border-white/5 opacity-30'}`}>
                                    <div className="flex items-center gap-3 font-bold text-sm tracking-wide">
                                        {cap.icon}
                                        {cap.label}
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${cap.active ? 'bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.8)]' : 'bg-gray-600'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center gap-6">
                        <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-sm">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[.3em] mb-2 text-center">Workforce Strength</p>
                            <p className="text-3xl font-black text-center">{company.profile?.companySize || 'Boutique'}</p>
                            <p className="text-[10px] text-gray-400 text-center font-bold mt-1 uppercase tracking-widest italic">{company.profile?.teamMembers?.length || 0} Registered Experts</p>
                        </div>
                        <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                            Verify Enterprise Details
                        </button>
                    </div>
                </div>
            </section>

          </div>
        </div>
      </div>
    );
  };

export default CompanyManagementPage;
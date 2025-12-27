"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { searchCompanies, verifyCompany, toggleCompanyBlockStatus } from "../../../services/AdminService";

import { CompanyProfile } from "@/types/authTypes";
import { toast } from "react-toastify";
import { Search, Filter, ShieldAlert, ShieldCheck, Edit3, Eye } from "lucide-react";
import DataTable from '../../../app/Admin/DataTable';  

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
            <Eye size={18} /> View
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
                    {value ? (
                      <div className="relative w-full h-64 bg-white rounded-lg overflow-hidden border border-gray-300 shadow-inner">
                        <Image src={value} alt={key} fill className="object-contain p-2" />
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
    </div>
  );
};

export default CompanyManagementPage;
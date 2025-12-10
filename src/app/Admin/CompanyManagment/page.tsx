"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { getCompanies, verifyCompany } from "../../../services/AdminService";
import { CompanyProfile } from "@/types/authTypes";
import { toast } from "react-toastify";
import { 
  Search, 
  Filter, 
  ChevronUp, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  ArrowUpDown
} from "lucide-react";

const CompanyManagementPage = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "verified" | "rejected">("all");

  // Sort State
  const [sortConfig, setSortConfig] = useState<{ key: keyof CompanyProfile; direction: "asc" | "desc" } | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  // Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyProfile | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [currentCompanyId, setCurrentCompanyId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await getCompanies();
        setCompanies(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleVerify = async (
    companyId: string,
    approve: boolean,
    reason?: string
  ) => {
    try {
      const updated = await verifyCompany(companyId, approve, reason);
      toast.success(`Company ${approve ? "accepted" : "rejected"} successfully!`);

      setCompanies((prev) =>
        prev.map((c) =>
          c.id === companyId
            ? {
                ...c,
                documentStatus: approve ? "verified" : "rejected",
                // rejectReason: reason, // backend might not return this immediately in list, but we update status
              }
            : c
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
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

  // --- Search, Filter, Sort Logic ---

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter =
        filterStatus === "all" || company.documentStatus === filterStatus;

      return matchesSearch && matchesFilter;
    });
  }, [companies, searchTerm, filterStatus]);

  const sortedCompanies = useMemo(() => {
    if (!sortConfig) return filteredCompanies;

    const sorted = [...filteredCompanies].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue == null || bValue == null) return 0;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredCompanies, sortConfig]);

  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedCompanies.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCompanies, currentPage]);

  const totalPages = Math.ceil(sortedCompanies.length / itemsPerPage);

  const handleSort = (key: keyof CompanyProfile) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading companies...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      {/* ---------- HEADER ---------- */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Company Management</h1>

      {/* ---------- CONTROLS ---------- */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white p-4 rounded-lg shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-500 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value as any);
              setCurrentPage(1);
            }}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* ---------- TABLE ---------- */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-semibold">
            <tr>
              <th 
                className="p-4 cursor-pointer hover:bg-gray-200 transition select-none"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {sortConfig?.key === "name" ? (
                    sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  ) : <ArrowUpDown size={16} className="text-gray-400" />}
                </div>
              </th>
              <th 
                className="p-4 cursor-pointer hover:bg-gray-200 transition select-none"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  {sortConfig?.key === "email" ? (
                    sortConfig.direction === "asc" ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                  ) : <ArrowUpDown size={16} className="text-gray-400" />}
                </div>
              </th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedCompanies.length > 0 ? (
              paginatedCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 font-medium">{company.name}</td>
                  <td className="p-4 text-gray-600">{company.email}</td>
                  <td className="p-4 text-gray-600">{company.phone || "—"}</td>
                  <td className="p-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize
                        ${company.documentStatus === 'verified' ? 'bg-green-100 text-green-700' : ''}
                        ${company.documentStatus === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                        ${company.documentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' : ''}
                      `}
                    >
                      {company.documentStatus}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCompany(company);
                        setShowViewModal(true);
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded hover:bg-blue-100 transition text-sm"
                    >
                      View
                    </button>

                    {company.documentStatus === "pending" && (
                      <>
                        <button
                          onClick={() => handleVerify(company.id, true)}
                          className="px-3 py-1 bg-green-50 text-green-600 border border-green-200 rounded hover:bg-green-100 transition text-sm"
                        >
                          Accept
                        </button>

                        <button
                          onClick={() => {
                            setCurrentCompanyId(company.id);
                            setShowRejectModal(true);
                          }}
                          className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded hover:bg-red-100 transition text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No companies found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- PAGINATION ---------- */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600 text-sm">
            Showing {Math.min((currentPage - 1) * itemsPerPage + 1, sortedCompanies.length)} to {Math.min(currentPage * itemsPerPage, sortedCompanies.length)} of {sortedCompanies.length} entries
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} />
            </button>
             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded text-sm transition
                    ${currentPage === page ? 'bg-blue-600 text-white border-blue-600' : 'hover:bg-gray-100'}
                  `}
                >
                  {page}
                </button>
             ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* ---------- MODALS (Unchanged logic, just keeping them here) ---------- */}
      
      {/* View Modal */}
      {showViewModal && selectedCompany && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white text-black p-6 rounded-xl shadow-2xl w-[750px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 border-b pb-2">
              {selectedCompany.name} <span className="text-gray-500 text-base font-normal">Documents</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(selectedCompany.documents).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center border p-4 rounded-lg bg-gray-50 hover:bg-white hover:shadow-md transition">
                  <p className="font-semibold mb-3 capitalize text-gray-700">{key.replace(/_/g, " ")}</p>
                  {value ? (
                    <div className="relative w-full h-48 bg-gray-200 rounded-lg overflow-hidden border">
                       <Image
                        src={value}
                        alt={key}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400 font-medium">
                      Not Provided
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white text-black p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-xl font-bold mb-4 text-red-600">Reject Company</h2>
            <p className="text-sm text-gray-600 mb-2">Please provide a reason for rejecting this company.</p>
            
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-red-500 focus:outline-none resize-none"
              placeholder="e.g. Invalid tax documents..."
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={submitRejection}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagementPage;

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getCompanies, verifyCompany } from "../../../services/AdminService";
import { CompanyProfile } from "@/types/authTypes";
import Sidebar from "../../../components/admin/SideBarLayout"; // Adjust path
import { toast } from "react-toastify";

const CompanyManagementPage = () => {
  const [companies, setCompanies] = useState<CompanyProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [activeSidebarItem, setActiveSidebarItem] = useState("Companies");

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

  const handleVerify = async (companyId: string, approve: boolean) => {
    try {
      const updated = await verifyCompany(companyId, approve);
      toast.success(`Company ${approve ? "accepted" : "rejected"} successfully!`);

      // Update the local state to reflect the change
      setCompanies((prev) =>
        prev.map((c) => (c.id === companyId ? { ...c, documentStatus: updated.documentStatus } : c))
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update company status");
    }
  };

  if (loading)
    return (
      <div className="flex min-h-screen">
        <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <p className="text-lg">Loading companies...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex min-h-screen">
        <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
        <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />

      <div className="flex-1 p-6 bg-gray-50">
        <div className="space-y-6">
          {companies.map((company) => (
            <div key={company.id} className="border border-gray-300 p-6 rounded-lg shadow-md bg-white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{company.name}</h3>
                  <p className="text-lg font-medium text-gray-700 mb-4">
                    Status: <span className="font-semibold">{company.status}</span>
                  </p>
                  <div className="flex gap-6 mt-4">
                    {company.documents.GST_Certificate && (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">GST Certificate</p>
                        <Image
                          src={company.documents.GST_Certificate}
                          alt="GST Certificate"
                          width={280}
                          height={200}
                          className="border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          priority={true}
                        />
                      </div>
                    )}
                    {company.documents.RERA_License && (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">RERA License</p>
                        <Image
                          src={company.documents.RERA_License}
                          alt="RERA License"
                          width={280}
                          height={200}
                          className="border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          priority={true}
                        />
                      </div>
                    )}
                    {company.documents.Trade_License && (
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-600 mb-2">Trade License</p>
                        <Image
                          src={company.documents.Trade_License}
                          alt="Trade License"
                          width={280}
                          height={200}
                          className="border-2 border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                          priority={true}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 ml-6 min-w-[120px]">
                  <button
                    onClick={() => handleVerify(company.id, true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleVerify(company.id, false)}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity shadow-md"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyManagementPage;

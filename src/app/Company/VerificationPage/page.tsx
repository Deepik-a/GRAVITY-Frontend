"use client";
import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import AuthLayout from "../../../components/auth/AuthLayout";
import { uploadCompanyDocuments } from "@/services/CompanyService";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner"; // spinners added

interface DocumentState {
  file: File | null;
  preview: string | null;
  name: string;
}

function DocumentUploadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [documents, setDocuments] = useState<{
    rera: DocumentState;
    gst: DocumentState;
    tradeLicense: DocumentState;
  }>({
    rera: { file: null, preview: null, name: "" },
    gst: { file: null, preview: null, name: "" },
    tradeLicense: { file: null, preview: null, name: "" },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (docType: keyof typeof documents, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload PDF, JPG, or PNG files only");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const preview = file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

    setDocuments(prev => ({
      ...prev,
      [docType]: {
        file,
        preview,
        name: file.name,
      },
    }));
  };

  const removeFile = (docType: keyof typeof documents) => {
    if (documents[docType].preview) {
      URL.revokeObjectURL(documents[docType].preview!);
    }
    
    setDocuments(prev => ({
      ...prev,
      [docType]: { file: null, preview: null, name: "" },
    }));

    // Reset file input
    if (fileInputRefs.current[docType]) {
      fileInputRefs.current[docType]!.value = "";
    }
  };


const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const rera = documents.rera.file;
  const gst = documents.gst.file;
  const trade = documents.tradeLicense.file;

  if (!rera || !gst || !trade) {
    toast.error("Please upload all documents");
    return;
  }

  setIsLoading(true);

  try {
    const files = [rera, gst, trade];

    // --- Create FormData and append files ---
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append("documents", file); // your backend expects "documents"
      console.log(`📎 Added file ${index + 1}:`, file.name);
    });

    // --- Append email from query params ---
    const email = searchParams.get("email");
    if (!email) throw new Error("Email not found in query params");
    formData.append("email", email);

    // --- Call API ---
    const result = await uploadCompanyDocuments(formData);

    toast.success("Documents uploaded successfully!");
    console.log("📥 Backend response:", result);

   // include email so the login form can be pre-filled (optional)
const emailParam = encodeURIComponent(email);

// use replace so back button won't return to upload-success
router.replace(`/signup?show=login&email=${emailParam}`);
return;

  } catch (error: unknown) {
    toast.error("Upload failed");
    console.error("❌ Upload error:", error);
  } finally {
    setIsLoading(false);
  }
};





  const setFileInputRef = (docType: string) => (el: HTMLInputElement | null) => {
    fileInputRefs.current[docType] = el;
  };

  const DocumentUploadSection = ({ 
    title, 
    description, 
    docType 
  }: { 
    title: string; 
    description: string; 
    docType: keyof typeof documents;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">{description}</p>
          <p className="text-xs text-gray-500 mt-2">PDF, JPG, PNG up to 10MB</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        {!documents[docType].file ? (
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-[#1E40AF] transition-colors duration-300 flex flex-col items-center justify-center flex-1 min-h-0"
            onClick={() => fileInputRefs.current[docType]?.click()}
          >
            <div className="text-gray-400 mb-2">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Click to upload {title}</p>
          </div>
        ) : (
          <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 sm:p-4 h-full">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              {documents[docType].preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={documents[docType].preview} 
                  alt="Preview" 
                  className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{documents[docType].name}</p>
                <p className="text-xs text-gray-500">
                  {documents[docType].file ? (documents[docType].file!.size / 1024 / 1024).toFixed(2) + " MB" : ""}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeFile(docType)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200 ml-2 flex-shrink-0"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={setFileInputRef(docType)}
        onChange={(e) => handleFileChange(docType, e)}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
      />
    </div>
  );

  return (
    <AuthLayout>
      <div className="text-center w-full flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
       
        </div>

        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-6 sm:mb-8 text-xs sm:text-sm">
          Upload required documents for verification
        </p>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 flex-1 flex flex-col min-h-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 text-left">
            Upload KYC Documents
          </h3>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 space-y-3 sm:space-y-4">
            <div className="flex-1 flex flex-col min-h-0">
              <DocumentUploadSection
                title="RERA License"
                description="Upload RERA License"
                docType="rera"
              />
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <DocumentUploadSection
                title="GST Certificate"
                description="Upload GST Certificate"
                docType="gst"
              />
            </div>

            <div className="flex-1 flex flex-col min-h-0">
              <DocumentUploadSection
                title="Trade License"
                description="Upload Trade License"
                docType="tradeLicense"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  /* spinners added */
                  <>
                    <LoadingSpinner size={20} className="text-white" />
                    <span>Uploading Documents...</span>
                  </>
                ) : (
                  "Submit Documents"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function DocumentUploadPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size={48} className="text-blue-900" />
      </div>
    }>
      <DocumentUploadContent />
    </Suspense>
  );
}

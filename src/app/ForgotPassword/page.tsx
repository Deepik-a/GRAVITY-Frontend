"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "../../services/authService";
import { toast } from "react-toastify";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validate email
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    toast.error("Please enter a valid email address");
    return;
  }

  setIsLoading(true);
  
  try {
    await forgotPassword(email);
    toast.success("OTP has been sent to your email!");

    // ✅ Redirect to OTP verification page after successful request
    setTimeout(() => {
      router.push(`/otp?email=${encodeURIComponent(email)}&action=forgot`);
    }, 2000);

  } catch (error) {
    toast.error((error as Error).message);
  } finally {
    setIsLoading(false);
  }
};


  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-4">
          Forgot Password
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your email address and we&apos;ll send an otp to reset your password.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-left text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-[#1E40AF] hover:text-[#081C45] font-medium text-sm transition-colors duration-300"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
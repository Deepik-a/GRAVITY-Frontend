"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPassword } from "../../services/AuthService";
import { toast } from "react-toastify";
import AuthLayout from "../../components/auth/AuthLayout";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";
   const otp = searchParams.get("otp") || ""; // ✅ Comes from previous step

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    feedback: string;
  }>({ score: 0, feedback: "" });

  // Password strength checker
  useEffect(() => {
    const checkPasswordStrength = (password: string) => {
      let score = 0;
      const feedback = [];

      if (password.length >= 8) score += 1;
      else feedback.push("at least 8 characters");

      if (/[A-Z]/.test(password)) score += 1;
      else feedback.push("one uppercase letter");

      if (/[a-z]/.test(password)) score += 1;
      else feedback.push("one lowercase letter");

      if (/[0-9]/.test(password)) score += 1;
      else feedback.push("one number");

      if (/[^A-Za-z0-9]/.test(password)) score += 1;
      else feedback.push("one special character");

      return {
        score,
        feedback: feedback.length > 0 ? `Needs ${feedback.join(", ")}` : "Strong password"
      };
    };

    setPasswordStrength(checkPasswordStrength(formData.password));
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
    await resetPassword(email, formData.password);
      toast.success("✅ Password reset successfully!");
      setTimeout(() => router.push("/signup?message=password_reset_success"), 1500);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength color
  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-gray-200";
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <AuthLayout>
      <div className="text-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-4">
          Reset Password
        </h2>
        <p className="text-gray-600 mb-6 text-sm">
          Create your new password
        </p>
        {email && (
          <p className="text-gray-500 mb-4 text-xs bg-gray-50 p-2 rounded-lg">
            {email}
          </p>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password Input */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-left text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
              required
            />
            
            {/* Password Strength Meter */}
            {formData.password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((index) => (
                    <div
                      key={index}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        index <= passwordStrength.score 
                          ? getStrengthColor(passwordStrength.score)
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs text-left ${
                  passwordStrength.score <= 2 ? "text-red-600" :
                  passwordStrength.score <= 3 ? "text-yellow-600" :
                  "text-green-600"
                }`}>
                  {passwordStrength.feedback}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-left text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
              required
            />
            
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <p className={`text-xs text-left ${
                formData.password === formData.confirmPassword 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {formData.password === formData.confirmPassword 
                  ? "✓ Passwords match" 
                  : "✗ Passwords do not match"
                }
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || formData.password !== formData.confirmPassword || passwordStrength.score < 3}
            className="w-full py-3 bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
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
"use client";
import { signupUser, loginUser, googleLogin } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";


export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hydrated, setHydrated] = useState(false);
    const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setHydrated(true);
    
    // Check if redirected from OTP verification
    const verified = searchParams.get('verified');
    const email = searchParams.get('email');
    const show = searchParams.get('show');
    
    if (verified === 'true') {
      toast.success("🎉 Email verified successfully! Please log in to continue.");
      
      // Pre-fill email in login form if provided
      if (email) {
        setLoginData(prev => ({ ...prev, email: decodeURIComponent(email) }));
      }
      
      // Show login form if specified
      if (show === 'login') {
        setIsSignup(false);
      }
    }
  }, [searchParams]);

  // ✅ Signup input change with validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation
    let error = "";
    switch (name) {
      case "name":
        error = validateName(value);
        break;
      case "email":
        error = validateEmail(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      case "password":
        error = validatePassword(value);
        // revalidate confirmPassword if already entered
        if (formData.confirmPassword)
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(value, formData.confirmPassword),
          }));
        break;
      case "confirmPassword":
        error = validateConfirmPassword(formData.password, value);
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ✅ Login input handler
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Signup submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
     if (loading) return; // prevent double submission
      setLoading(true); // prevent double submission
    console.log("🚀 handleSubmit function CALLED");
    console.log("📋 Form data:", formData);

    // Validate
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(
      formData.password,
      formData.confirmPassword
    );

    console.log("🔍 Validation errors:", {
      nameError, emailError, phoneError, passwordError, confirmPasswordError
    });

    setErrors({ name: nameError, email: emailError, phone: phoneError, password: passwordError, confirmPassword: confirmPasswordError });

    if (nameError || emailError || phoneError || passwordError || confirmPasswordError) {
      console.log("❌ Validation failed, returning early");
      toast.warning("Please fix all validation errors before submitting.");
      return;
    }
    
    console.log("✅ Validation passed, making API call");
    try {
      console.log("formdata", formData);
      const response = await signupUser(formData);
      toast.success(response.message || "Signup successful!");

      // ✅ Redirect to OTP page
      router.push(`/otp?email=${encodeURIComponent(formData.email)}&action=signup`);

    } catch (error: unknown) {
      const err = error as Error;
      console.error("Signup Error:", err.message);
      console.error("Failed formdata:", formData);
      toast.warning(err.message || "Signup failed!");
    }
  };

  // ✅ Login submit handler
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("loginData", loginData);
      const response = await loginUser(loginData);
      toast.success(response.message || "Login successful!");
      // Handle successful login (redirect to dashboard, etc.)
       // ✅ Redirect to landing page after successful login
    router.push("/LandingPage"); // change "/landing" to your actual landing page route
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Login Error:", err.message);
      toast.warning(err.message || "Login failed!");
    }
  };

  // ✅ Forgot Password handler
  const handleForgotPassword = () => {
    if (!loginData.email) {
      toast.info("Please enter your email address first");
      return;
    }
    // Redirect to forgot password page with email pre-filled
    router.push(`/ForgotPassword?email=${encodeURIComponent(loginData.email)}&action=forgot`);
  };


const handleGoogleSignup = async (credentialResponse: CredentialResponse) => {
  if (credentialResponse.credential) {
    try {
      const res = await googleLogin(credentialResponse.credential);
      toast.success(res.message || "Google signup successful!");
      router.push("/LandingPage");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Google signup failed!");
    }
  }
};

// ✅ Google Login handler
const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
  if (credentialResponse.credential) {
    try {
      const res = await googleLogin(credentialResponse.credential);
      toast.success(res.message || "Google login successful!");
      router.push("/LandingPage");
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Google login failed!");
    }
  }
};

  if (!hydrated) return null;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-6 font-['Montserrat']"
      style={{
        backgroundImage: "url('/assets/SignUpBackgroundImage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          {/* Left Side - Video */}
          <div
            className={`md:w-1/2 transition-all duration-700 ${
              isSignup ? "order-1 md:order-1" : "order-1 md:order-2"
            }`}
          >
            <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
              <video
                className="absolute top-0 left-0 w-full h-full object-cover object-bottom"
                src="/assets/SignUpBackgroundVideo.mp4"
                autoPlay
                loop
                muted
                playsInline
                poster="/assets/AlternativeSignUpImage.jpg"
              />
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div
            className={`md:w-1/2 transition-all duration-700 ${
              isSignup ? "order-2 md:order-2" : "order-2 md:order-1"
            }`}
          >
            <div className="h-full p-8 md:p-12 bg-white/95 backdrop-blur-sm flex flex-col justify-center">
              {/* Toggle Buttons */}
              <div className="flex mb-8 bg-gray-100 rounded-2xl p-1.5 animate-fade-in-up">
                <button
                  type="button"
                  onClick={() => setIsSignup(true)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 ${
                    isSignup
                      ? "bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white shadow-lg scale-[1.02]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  SIGN UP
                </button>
                <button
                  type="button"
                  onClick={() => setIsSignup(false)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm tracking-wide transition-all duration-500 ${
                    !isSignup
                      ? "bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white shadow-lg scale-[1.02]"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  SIGN IN
                </button>
              </div>

              {/* Signup & Login Forms */}
              <div className="relative min-h-[480px] flex items-center">
                {/* ✅ Signup Form */}
                <div
                  className={`w-full transition-all duration-700 ${
                    isSignup
                      ? "opacity-100 translate-x-0 relative"
                      : "opacity-0 translate-x-[-100%] absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div
                    className="text-center mb-6 animate-fade-in-up"
                    style={{ animationDelay: "0.1s" }}
                  >
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-2">
                      Create Your Account
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Google Sign Up Button */}
                  {/* Google Sign Up Button */}
{/* Google Sign In */}
<div className="flex justify-center">
  <div className="w-full"> {/* Full width container */}
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => toast.error("Google Login Failed")}
      shape="rectangular"
      size="large"
      width="100%"
    />
  </div>
</div>

                    {/* Divider */}
                    <div className="flex items-center my-4">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="px-4 text-gray-500 text-xs font-medium tracking-wider">
                        OR CONTINUE WITH
                      </span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>

                    {/* Input Fields */}
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Email */}
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                      </div>

                      {/* Name */}
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          FULL NAME
                        </label>
                        <input
                          type="text"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                          required
                        />
                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          PHONE NUMBER
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create strong password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                            required
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="md:col-span-2">
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          CONFIRM PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                            required
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="text-center text-xs text-gray-600 py-2">
                      By creating an account, you agree to our{" "}
                      <a
                        href="#"
                        className="text-[#1E40AF] hover:text-[#081C45] underline font-medium"
                      >
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-[#1E40AF] hover:text-[#081C45] underline font-medium"
                      >
                        Privacy Policy
                      </a>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-[#081C45] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#081C45] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                      {loading ? "CREATING...." : "CREATE ACCOUNT"}
                    </button>
                  </form>
                </div>

                {/* ✅ Login Form */}
                <div
                  className={`w-full transition-all duration-700 ${
                    !isSignup
                      ? "opacity-100 translate-x-0 relative"
                      : "opacity-0 translate-x-[100%] absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div className="flex flex-col justify-center h-full">
                    <div
                      className="text-center mb-8"
                      style={{ animationDelay: "0.1s" }}
                    >
                      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent mb-2">
                        Welcome Back
                      </h2>
                      <p className="text-gray-600 text-sm">
                        Sign in to continue building your dreams
                      </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      {/* Google Sign In */}
                      <div className="flex justify-center">
                        <GoogleLogin
                          onSuccess={handleGoogleLogin}
                          onError={() => toast.error("Google Login Failed")}
                          shape="rectangular"
                          size="large"
                        />
                      </div>

                      {/* Divider */}
                      <div className="flex items-center my-4">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="px-4 text-gray-500 text-xs font-medium tracking-wider">
                          OR
                        </span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          EMAIL
                        </label>
                        <input
                          type="email"
                          name="email"
                          placeholder="your@email.com"
                          value={loginData.email}
                          onChange={handleLoginChange}
                          className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-gray-700 text-xs font-semibold mb-2 tracking-wide">
                          PASSWORD
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Enter your password"
                            value={loginData.password}
                            onChange={handleLoginChange}
                            className="w-full p-3 pr-12 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? "🙈" : "👁️"}
                          </button>
                        </div>
                      </div>

                      {/* Forgot Password Link */}
                      <div className="text-right">
                        <button
                          type="button"
                          onClick={handleForgotPassword}
                          className="text-sm text-[#1E40AF] hover:text-[#081C45] font-medium underline transition-all duration-300"
                        >
                          Forgot your password?
                        </button>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-[#081C45] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#081C45] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                      >
                        SIGN IN
                      </button>

                      {/* Sign Up Link */}
                      <p className="text-center text-sm text-gray-600 pt-4">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={() => setIsSignup(true)}
                          className="text-[#1E40AF] hover:text-[#081C45] font-semibold underline transition-all duration-300"
                        >
                          Create one
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
}
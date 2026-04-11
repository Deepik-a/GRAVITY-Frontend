"use client";
import { signupUser, loginUser, googleLogin } from "@/services/AuthService";
import { getProfile as apiGetProfile } from "@/services/CompanyService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "react-toastify";
import {
  validateName,
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/Validation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { SignupData, Profile } from "@/types/AuthTypes";
import { useAuth } from "@/context/AuthContext";
import Cookies from "js-cookie";


function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login: contextLogin, isAuthenticated, role: currentRole, isLoading: authLoading, user } = useAuth();
  
  const [isSignup, setIsSignup] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hydrated, setHydrated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleAuthLoading, setGoogleAuthLoading] = useState(false); 
     const [role, setRole] = useState<'user' | 'company' | null>(null);

  useEffect(() => {
  const userType = searchParams.get('userType');
  if (userType === 'user' || userType === 'company') {
    setRole(userType);
    console.log("🎯 Role detected from URL:", userType);
  } else if (isSignup) {
    // Only warn during signup phase; login doesn't strictly need it as backend detects it
    console.warn("⚠️ No valid role found in URL params for Signup");
  }
}, [searchParams, isSignup]);

  // ... formData and other states ...
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

    if (!authLoading && isAuthenticated && currentRole) {
      if (currentRole === "user") {
        router.replace("/User/HomePage");
      } else if (currentRole === "company") {
        // Only redirect to VerificationPage if documents are missing or rejected
        const docStatus = user?.documentStatus;
        const email = user?.email || localStorage.getItem("otpEmail") || "";
        
        if (docStatus === "rejected") {
           toast.error("Documents rejected. Please upload again.");
           router.replace(`/Company/VerificationPage?role=company&email=${encodeURIComponent(email)}`);
        } else if (docStatus === "pending") {
           toast.info("Company verification is pending approval by admin. Please wait.");
        } else if (!docStatus) {
           router.replace(`/Company/VerificationPage?role=company&email=${encodeURIComponent(email)}`);
        } else {
           // Verified - handled by middleware primarily, but watchdog can assist
           if (!user?.isProfileFilled) {
             router.replace("/Company/CompanyDetail");
           }
        }
      } else if (currentRole === "admin") {
        router.replace("/Admin/AdminDashBoard");
      }
    }

    // Check if redirected from OTP verification
    const verified = searchParams.get('verified');
    const email = searchParams.get('email');
    const show = searchParams.get('show');
    
    if (verified === 'true') {
      toast.success("🎉 Email verified successfully! Please log in to continue.");
    }
      
    // Pre-fill email in login form if provided
    if (email) {
      setLoginData(prev => ({ ...prev, email: decodeURIComponent(email) }));
    }
      
    // Show login form if specified
    if (show === 'login') {
      setIsSignup(false);
    }
  }, [searchParams, router, isAuthenticated, currentRole, authLoading, user]);

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

  if (!role) {
    alert("Role not selected");
    return;
  }

  if (loading) return;
  setLoading(true);

  // Validation
  const nameError = validateName(formData.name);
  const emailError = validateEmail(formData.email);
  const phoneError = validatePhone(formData.phone);
  const passwordError = validatePassword(formData.password);
  const confirmPasswordError = validateConfirmPassword(
    formData.password,
    formData.confirmPassword
  );

  setErrors({
    name: nameError,
    email: emailError,
    phone: phoneError,
    password: passwordError,
    confirmPassword: confirmPasswordError,
  });

  if (nameError || emailError || phoneError || passwordError || confirmPasswordError) {
    toast.warning("Please fix all validation errors before submitting.");
    setLoading(false);
    return;
  }

  const signupData: SignupData = {
    ...formData,
    role, // ✅ correct role
  };
  console.log(signupData, "signupData from frontend");

  try {
    const response = await signupUser(signupData);
    toast.success(response.message || "Signup successful!");

    // ⭐ Save OTP purpose, email, and role
    localStorage.setItem("otpPurpose", "signup");
    localStorage.setItem("otpEmail", formData.email);
    //role is stored because after otp verification go to company verification page for company and login for user
    localStorage.setItem("role", role); // ✅ store role

    // ⭐ Store draft profile info if company
    if (role === "company") {
      const draftProfile = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        profile: {}
      };
      localStorage.setItem("companyProfile", JSON.stringify(draftProfile));
    }

    router.push(`/otp?email=${encodeURIComponent(formData.email)}&action=signup`);
  } catch (error: unknown) {
    const err = error as Error;
    // Handle cross-role registration errors
    if (err.message.includes("registered as company") || err.message.includes("registered as user")) {
      toast.error(err.message);
      // Optional: Automatically switch to login view since they already exist
      // setIsSignup(false); 
    } else {
      toast.warning(err.message || "Signup failed!");
    }
  } finally {
    setLoading(false);
  }
};



  // ✅ Login submit handler
// ✅ Login submit handler (role added)
const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true); // spinners added


  try {
    const finalLoginData = {
      email: loginData.email,
      password: loginData.password,
    };

    console.log("📤 Sending Login Payload:", finalLoginData);

    const response = await loginUser(finalLoginData);

    console.log("response of login",response)
    
    // Check for role mismatch
    const uiRole = role || 'user';
    const returnedRole = response.role;

    if (returnedRole === 'company' && uiRole === 'user') {
      toast.success("Account found as Company. Redirecting to Company Side...");
    } else if (returnedRole === 'user' && uiRole === 'company') {
      toast.success("Account found as User. Redirecting to User Dashboard...");
    } else {
      toast.success(response.message || "Login successful!");
    }

    // ⭐ Store session in context
    contextLogin(response.user as Profile, response.role as "user" | "company" | "admin");
    localStorage.setItem("authProvider", "password");
    localStorage.removeItem("otpEmail");
    localStorage.removeItem("otpPurpose");
    
    // 🔥 Store docStatus in cookie for middleware to see
    if (response.documentStatus) {
      Cookies.set("documentStatus", response.documentStatus, { expires: 7 });
    } else {
      Cookies.remove("documentStatus");
    }

    // 🔥 If company, fetch profile to prefill
    if (response.role === "company") {
      try {
        const profileData = await apiGetProfile(response.user.id);
        if (profileData) {
          localStorage.setItem("companyProfile", JSON.stringify(profileData));
        }
      } catch (err) {
        console.warn("Failed to fetch initial company profile on Login", err);
      }
    }

    // 🔥 Role-based redirect (same behavior as Google Auth)
    if (response.role === "user") {
      const nextPath = searchParams.get('next') || "/User/HomePage";
      router.replace(nextPath);

    } else if (response.role === "company") {
        const docStatus = response.documentStatus;
        if (docStatus === "rejected") {
           toast.error("Documents rejected. Please upload again.");
           router.replace(`/Company/VerificationPage?role=${response.role}&email=${encodeURIComponent(finalLoginData.email)}`);
        } else if (docStatus === "pending") {
           toast.info("Company verification is pending approval by admin. Please wait.");
           router.replace(`/Company/VerificationPage?role=${response.role}&email=${encodeURIComponent(finalLoginData.email)}`);
        } else if (!docStatus) {
           router.push(`/Company/VerificationPage?role=${response.role}&email=${encodeURIComponent(finalLoginData.email)}`);
        } else {
           // Verified
           if (response.user.isProfileFilled) {
             router.replace("/Company/CompanyDashBoard");
           } else {
             router.replace("/Company/CompanyDetail");
           }
        }

    } else if (response.role === "admin") {
      router.replace("/Admin/AdminDashBoard");

    } else {
      router.replace("/");
    }

  } catch (error: unknown) {
    const err = error as Error;
    console.error(`Login Error: ${err.message}`);
    toast.warning(err.message || "Login failed!");
  } finally {
    setLoading(false);
  }
};



  // ✅ Forgot Password handler
  const handleForgotPassword = () => {
    if (!loginData.email) {
      toast.info("Please enter your email address first");
      return;
    }

      // ⭐ Save OTP purpose + email
  localStorage.setItem("otpPurpose", "forgot-password");
  localStorage.setItem("otpEmail", loginData.email);

    // Redirect to forgot password page with email pre-filled
    router.push(`/ForgotPassword?email=${encodeURIComponent(loginData.email)}`);
  };


// ✅ Unified Google Auth handler
const handleGoogleAuth = async (credentialResponse: CredentialResponse) => {
  if (!credentialResponse.credential) {
    toast.error("Google authentication failed");
    return;
  }

  if (!role && isSignup) {
    toast.warning("Please select a role to sign up.");
    return;
  }

  if (googleAuthLoading) return;
  setGoogleAuthLoading(true); // spinners added

  try {
    console.log(`🚀 Google ${isSignup ? "Signup" : "Login"} for role:`, role);

    // 1️⃣ Call backend Google login/signup
    // Pass role if selected; backend handles "role required" for new users
    const res = await googleLogin(credentialResponse.credential, role || undefined);
console.log(res,"res from signup")
    // 2️⃣ Handling Role Mismatch & Success Messages
    const uiRole = role || 'user';
    const returnedRole = res.user.role;
    
    if (returnedRole === 'company' && uiRole === 'user') {
      toast.success("Email is already registered as company and Google signup successful");
    } else if (returnedRole === 'user' && uiRole === 'company') {
       toast.success("Email is already registered as user. Redirecting to User Dashboard...");
    } else {
      const action = isSignup ? "signup" : "login";
      toast.success(res.message || `Google ${action} successful!`);
    }

    // ⭐ Store basic user info
    const userData: Profile = {
      id: res.user.id,
      name: res.user.name,
      email: res.user.email,
      role: res.user.role,
      phone: (res.user as { phone?: string }).phone || ""
    };

    // ⭐ Store session in context
    contextLogin(userData, res.user.role as "user" | "company");
    localStorage.setItem("authProvider", "google");
    localStorage.removeItem("otpEmail");
    localStorage.removeItem("otpPurpose");

    // 🔥 Store docStatus in cookie for middleware
    if (res.documentStatus) {
       Cookies.set("documentStatus", res.documentStatus, { expires: 7 });
    } else {
       Cookies.remove("documentStatus");
    }

    // 🔥 If company, fetch profile to prefill
    if (res.user.role === "company") {
      try {
        if (userData.id) {
          const profileData = await apiGetProfile(userData.id);
          if (profileData && Object.keys(profileData).length > 0) {
            localStorage.setItem("companyProfile", JSON.stringify(profileData));
          } else {
            throw new Error("Empty profile data");
          }
        }
      } catch (err) {
        console.warn("Could not fetch full profile for Google user, setting draft", err);
        const draftProfile = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          profile: {} 
        };
        localStorage.setItem("companyProfile", JSON.stringify(draftProfile));
      }
    }

    // 3️⃣ Decide redirect based on role & status
    if (res.user.role === "user") {
    console.log("res.user.role ", res.user.role) // ✅ correct
       
      const nextPath = searchParams.get('next') || "/User/HomePage";
      router.replace(nextPath);
    } else if (res.user.role === "company") {
        const docStatus = res.documentStatus;
        if (docStatus === "rejected") {
           toast.error("Documents rejected. Please upload again.");
           router.replace(`/Company/VerificationPage?role=${res.user.role}&email=${encodeURIComponent(res.user.email)}`);
        } else if (docStatus === "pending") {
           toast.info("Company verification is pending approval by admin. Please wait.");
           router.replace(`/Company/VerificationPage?role=${res.user.role}&email=${encodeURIComponent(res.user.email)}`);
        } else if (docStatus==='not_submitted') {
           router.push(`/Company/VerificationPage?role=${res.user.role}&email=${encodeURIComponent(res.user.email)}`);
        } else {
           // Verified
           if (res.user.isProfileFilled) {
             router.replace("/Company/CompanyDashBoard");
           } else {
             router.replace("/Company/CompanyDetail");
           }
        }
    } else {
      // Fallback for unknown roles
      router.replace("/");
    }
  } catch (error: unknown) {
    console.error("Google Auth error:", error);
    const errorMessage = error instanceof Error ? error.message : "Google authentication failed";
    toast.error(errorMessage);
  } finally {
    setGoogleAuthLoading(false); // spinners added
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
      src={
        role === "company"
          ? "/assets/AlternativeSignUpImage.jpg"   // company poster
          : "/assets/SignUpBackgroundVideo.mp4" // default homeowner/user video
      }
      autoPlay
      loop
      muted
      playsInline
      poster={
        role === "company"
          ? "/assets/AlternativeSignUpImage.jpg"
          : "/assets/worker.png"
      }
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
<div className="w-full">
  {isSignup && (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleAuth}
        onError={() => toast.error("Google Login Failed")}
        shape="rectangular"
        size="large"
        width="100%"
      />
    </div>
  )}
  {googleAuthLoading && (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E40AF]"></div>
    </div>
  )}
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
  <label className="block text-gray-700 text-xs font-bold mb-2 tracking-wide">
    {role === "company" ? "Company Name" : "Full Name"}
  </label>
  <input
    type="text"
    name="name"
    placeholder={role === "company" ? "ABC Builders" : "John Doe"}
    value={formData.name}
    onChange={handleChange}
    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/30 outline-none transition-all duration-300 text-sm font-medium"
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
                        <div className="w-full relative">
                          {!isSignup && (
                            <GoogleLogin
                              onSuccess={handleGoogleAuth}
                              onError={() => toast.error("Google Login Failed")}
                              shape="rectangular"
                              size="large"
                            />
                          )}
                          {googleAuthLoading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1E40AF]"></div>
                            </div>
                          )}
                        </div>
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
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#081C45] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#081C45] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>SIGNING IN...</span>
                          </>
                        ) : (
                          "SIGN IN"
                        )}
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

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E40AF]"></div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}

"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateEmail, validatePassword } from '@/utils/Validation';
import { LoginData, Profile } from "@/types/AuthTypes";
import { loginAdmin } from "@/services/AuthService";
import { toast } from "react-toastify";
import { useAuth } from '@/context/AuthContext';
import { Users, BarChart3, Settings, Quote, Mail, Lock, Eye, EyeOff, Loader2, Info } from 'lucide-react';

const AdminLogin: React.FC = () => {
    const router = useRouter();
    const { login: contextLogin, isAuthenticated, role: currentRole, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email: string; password: string }>({ email: '', password: '' });

  React.useEffect(() => {
    if (!authLoading && isAuthenticated && currentRole === "admin") {
      router.replace("/Admin/AdminDashBoard");
    }
  }, [router, isAuthenticated, currentRole, authLoading]);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  setErrors({
    email: emailError,
    password: passwordError,
  });

  if (emailError || passwordError) {
    toast.error("Please fix the validation errors.");
    return;
  }

  try {
    setIsLoading(true);

    const loginData: LoginData = {
      email,
      password,
    };

    const response = await loginAdmin(loginData);
    toast.success(response.message || "Login successful!");
    
    // Convert admin user to Profile type
    const adminUser: Profile = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: "admin"
    };

    // Store admin info in context
    contextLogin(adminUser, "admin");
    localStorage.setItem("adminId", response.user.id);
    // Token is stored in cookies by backend, but we can store it in localStorage if needed by interceptors
    // Based on previous code, I'll keep it for now but context is primary.
    // localStorage.setItem("token", response.accessToken); 
    
    resetForms();
    
    // 🔥 Redirect to admin dashboard
    router.replace("/Admin/AdminDashBoard");

  } catch (error: unknown) {
    let message = "Login failed";

    if (error instanceof Error) {
      message = error.message;
    }

    toast.error(message);
  } finally {
    setIsLoading(false);
  }
};



  const resetForms = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setErrors({ email: '', password: '' });
  };

  // Real-time validation as user types
  const handleEmailChange = (value: string) => {
    setEmail(value);
    // Validate on every change for real-time feedback
    setErrors(prev => ({ ...prev, email: validateEmail(value) }));
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    // Validate on every change for real-time feedback
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
  };

  return (
  <div className="min-h-screen bg-white flex items-center justify-center p-4 font-inter">
  <div className="w-full max-w-4xl flex flex-col md:flex-row rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
    {/* Left Side - Graphics */}
    <div className="bg-gradient-to-br from-[#020D2E] to-[#0F2FA8] text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative hidden md:flex min-h-[600px]">
    

      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Admin Dashboard</h1>
        <div className="h-1 w-20 bg-yellow-400 rounded-full mb-4"></div>
        <p className="text-lg text-blue-100 font-medium">Manage your platform with powerful, professional tools</p>
      </div>

      <div className="space-y-8 mb-10">
        <div className="flex items-center group transition-transform hover:translate-x-1">
          <div className="w-12 h-12 rounded-xl bg-white bg-opacity-10 border border-white/20 flex items-center justify-center mr-5 shadow-inner">
            <Users className="text-yellow-400" size={24} />
          </div>
          <p className="font-semibold text-lg">Manage users & permissions</p>
        </div>

        <div className="flex items-center group transition-transform hover:translate-x-1">
          <div className="w-12 h-12 rounded-xl bg-white bg-opacity-10 border border-white/20 flex items-center justify-center mr-5 shadow-inner">
            <BarChart3 className="text-yellow-400" size={24} />
          </div>
          <p className="font-semibold text-lg">View analytics & reports</p>
        </div>

        <div className="flex items-center group transition-transform hover:translate-x-1">
          <div className="w-12 h-12 rounded-xl bg-white bg-opacity-10 border border-white/20 flex items-center justify-center mr-5 shadow-inner">
            <Settings className="text-yellow-400" size={24} />
          </div>
          <p className="font-semibold text-lg">Configure system settings</p>
        </div>
      </div>

      <div className="bg-white/10 border border-white/10 p-6 rounded-2xl mt-4 backdrop-blur-md relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-5">
          <Quote size={100} />
        </div>
        <div className="flex items-start">
          <Quote size={28} className="text-yellow-400 mr-4 mt-1 flex-shrink-0" />
          <p className="text-base leading-relaxed font-medium text-white/95">
            The admin portal provides comprehensive control over your platform with enhanced security measures to
            protect sensitive data.
          </p>
        </div>
      </div>
    </div>

    {/* Right Side - Login Form */}
    <div className="bg-white p-8 md:p-12 md:w-1/2 relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Admin Login</h2>
        <p className="text-gray-600">Access your administrator account</p>
      </div>

      <form onSubmit={handleLogin} className="mb-6">
        <div className="mb-5">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="text-gray-400" size={18} />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-gray-900 font-medium ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-100 bg-red-50' 
                  : 'border-gray-200 focus:border-[#0F2FA8] focus:ring-blue-100'
              }`}
              placeholder="admin@gravity.com"
              required
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="text-gray-400" size={18} />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all text-gray-900 font-medium ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-100 bg-red-50' 
                  : 'border-gray-200 focus:border-[#0F2FA8] focus:ring-blue-100'
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center font-medium">
              <Info size={14} className="mr-1" />
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#0F2FA8] hover:bg-[#020D2E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              SIGNING IN...
            </>
          ) : (
            'SIGN IN'
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">© 2023 Admin Portal. All rights reserved.</p>
      </div>
    </div>
  </div>

  <style jsx>{`
    .font-inter {
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
    }
    
    /* Add custom styles for better visibility */
    input::placeholder {
      color: #9CA3AF; /* Gray-400 */
      opacity: 0.8;
    }
    
    input {
      color: #111827 !important; /* Gray-900 */
    }
    
    input:focus {
      background-color: white;
    }
  `}</style>
</div>
  );
};

export default AdminLogin;
"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { validateEmail, validatePassword } from '@/utils/Validation';
import { LoginData, Profile } from "@/types/AuthTypes";
import { loginAdmin } from "@/services/AuthService";
import { toast } from "react-toastify";
import { useAuth } from '@/context/AuthContext';

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
    <div className="bg-gradient-to-br from-[#081C45] to-[#1E40AF] text-white p-8 md:p-12 md:w-1/2 flex flex-col justify-center relative hidden md:flex">
      <div className="absolute top-4 right-4 bg-yellow-500 bg-opacity-20 text-yellow-300 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
        <i className="fas fa-shield-alt mr-2"></i>
        <span>Secure Admin Portal</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="opacity-90">Manage your platform with powerful tools</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
            <i className="fas fa-users text-yellow-300"></i>
          </div>
          <p>Manage users & permissions</p>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
            <i className="fas fa-chart-line text-yellow-300"></i>
          </div>
          <p>View analytics & reports</p>
        </div>

        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-4">
            <i className="fas fa-cog text-yellow-300"></i>
          </div>
          <p>Configure system settings</p>
        </div>
      </div>

      <div className="bg-white bg-opacity-10 p-6 rounded-xl mt-4">
        <div className="flex items-start">
          <i className="fas fa-quote-left text-xl text-yellow-300 mr-4 mt-1"></i>
          <p className="text-sm">
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-envelope text-gray-400"></i>
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-300 focus:border-[#1E40AF] focus:ring-blue-200'
              }`}
              placeholder="admin@example.com"
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-lock text-gray-400"></i>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-300 focus:border-[#1E40AF] focus:ring-blue-200'
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-600`}></i>
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <i className="fas fa-exclamation-circle mr-1"></i>
              {errors.password}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-[#081C45] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#081C45] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <i className="fas fa-spinner fa-spin mr-2"></i>
              SIGNING IN...
            </span>
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
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    
    .font-inter {
      font-family: 'Inter', sans-serif;
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
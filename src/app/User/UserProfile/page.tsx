"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getProfile, updateProfile, uploadProfileImage, deleteProfileField } from "@/services/AuthService";
import { getUserBookings, getFavourites, changePassword, completeBooking } from "@/services/UserService";
import { Profile, CompanyProfile } from "@/types/AuthTypes";
import { extractAxiosError } from "@/utils/HandleAxiosError";
import { toast } from "react-toastify";
import UserNavbar from "@/components/user/UserNavbar";
import {
  LayoutDashboard,
  Calendar,
  Heart,
  Settings,
  Crown,
  TrendingUp,
  Star,
  Camera,
  Menu,
  X,
  Edit,
  Trash2,
  Save,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Upload,
  XCircle,
  CheckCircle,
  AlertCircle,
  Check,
  Lock,
  Eye,
  EyeOff,
  MessageSquare,
  Video,
  RefreshCcw
} from "lucide-react";

import { resolveImageUrl } from "@/utils/urlHelper";

interface Booking {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  serviceStatus: "pending" | "completed";
  isRescheduled?: boolean;
  companyDetails?: {
    name: string;
    logo?: string;
  };
}

import AvatarEditor from 'react-avatar-editor';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Profile state
  const [profileData, setProfileData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [favourites, setFavourites] = useState<CompanyProfile[]>([]);
  const [loadingFavourites, setLoadingFavourites] = useState(false);
  
  // Password Change State
  const [passwordForm, setPasswordForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({ newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });
  
  // Edit form state
  const [editForm, setEditForm] = useState<Partial<Profile>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [editorScale, setEditorScale] = useState(1);
  const [editorPosition, setEditorPosition] = useState({ x: 0.5, y: 0.5 });
  const [imageUploadMessage, setImageUploadMessage] = useState<{type: 'success' | 'error' | 'info', message: string} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  // Fetch profile from backend
  useEffect(() => {
    let mounted = true;

    const fetchProfile = () => {
      getProfile()
        .then((profile) => {
          if (!mounted) return;
          setProfileData(profile);
          // Initialize edit form with current data
          setEditForm({
            name: profile.name,
            email: profile.email,
            phone: profile.phone || "",
            location: profile.location || "",
            bio: profile.bio || "",
          });
          // Set image preview if profile has image
          if (profile.profileImage) {
            setImagePreview(resolveImageUrl(profile.profileImage));
          }
        })
        .catch((error) => {
          const message = extractAxiosError(error);
          console.error("❌ Profile Fetch Error:", message);
          toast.error(message);
        })
        .finally(() => mounted && setLoading(false));
    };

    fetchProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch bookings when consultations section is active
  useEffect(() => {
    if (activeSection === "consultations") {
      setLoadingBookings(true);
      getUserBookings()
        .then(setBookings)
        .catch(err => toast.error(extractAxiosError(err)))
        .finally(() => setLoadingBookings(false));
    }
  }, [activeSection]);
  
  // Fetch favourites
  useEffect(() => {
    if (activeSection === "favourites") {
      setLoadingFavourites(true);
      getFavourites()
        .then(setFavourites)
        .catch(err => toast.error(extractAxiosError(err)))
        .finally(() => setLoadingFavourites(false));
    }
  }, [activeSection]);

  const validatePassword = (name: string, value: string) => {
    let error = "";
    if (name === "newPassword") {
      if (value.length < 6) {
        error = "Password must be at least 6 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
        error = "Password must contain uppercase, lowercase, and numbers";
      }
    } else if (name === "confirmPassword") {
      if (value !== passwordForm.newPassword) {
        error = "Passwords do not match";
      }
    }
    return error;
  };

  {bookings.map((booking, idx) => {
  console.log(`Booking ${idx}:`, {
    status: booking.status,
    paymentStatus: booking.paymentStatus,
    serviceStatus: booking.serviceStatus
  });
})}

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    
    const error = validatePassword(name, value);
    setPasswordErrors(prev => ({ ...prev, [name]: error }));

    // If we change newPassword, re-validate confirmPassword
    if (name === "newPassword" && passwordForm.confirmPassword) {
      const confirmError = value !== passwordForm.confirmPassword ? "Passwords do not match" : "";
      setPasswordErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPassError = validatePassword("newPassword", passwordForm.newPassword);
    const confirmPassError = validatePassword("confirmPassword", passwordForm.confirmPassword);

    if (newPassError || confirmPassError) {
      setPasswordErrors({ newPassword: newPassError, confirmPassword: confirmPassError });
      return;
    }

    setPasswordLoading(true);
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      });
      toast.success("Password changed successfully");
      setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordErrors({ newPassword: "", confirmPassword: "" });
    } catch (error) {
       const message = extractAxiosError(error);
       if (message.toLowerCase().includes("current password") || message.toLowerCase().includes("old password")) {
         toast.error("Incorrect current password. Please try again.");
       } else {
         toast.error(message);
       }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Validation rules
  const validateField = (field: string, value: string) => {
    const errors: Record<string, string> = {};
    
    switch (field) {
      case 'name':
        if (!value.trim()) {
          errors.name = "Name is required";
        } else if (value.length < 2) {
          errors.name = "Name must be at least 2 characters";
        } else if (value.length > 100) {
          errors.name = "Name must be less than 100 characters";
        }
        break;
      
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          errors.email = "Email is required";
        } else if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address";
        } else if (value.length > 100) {
          errors.email = "Email must be less than 100 characters";
        }
        break;
      
      case 'phone':
        if (value) {
          const phoneRegex = /^[0-9]{10}$/;
          const cleanedPhone = value.replace(/\D/g, '');
          if (!phoneRegex.test(cleanedPhone)) {
            errors.phone = "Please enter a valid 10-digit phone number";
          }
        }
        break;
      
      case 'location':
        if (value && value.length < 2) {
          errors.location = "Location must be at least 2 characters";
        } else if (value && value.length > 100) {
          errors.location = "Location must be less than 100 characters";
        }
        break;
      
      case 'bio':
        if (value && value.length > 500) {
          errors.bio = "Bio must be less than 500 characters";
        }
        break;
    }
    
    return errors;
  };

  // Real-time validation
  const handleInputChange = (field: keyof Profile, value: string) => {
    // Format phone number input
    let formattedValue = value;
    if (field === 'phone') {
      // Remove all non-digits
      formattedValue = value.replace(/\D/g, '');
      // Limit to 10 digits
      formattedValue = formattedValue.slice(0, 10);
    }
    
    // Update form
    setEditForm(prev => ({
      ...prev,
      [field]: formattedValue
    }));
    
    // Validate field
    const errors = validateField(field, formattedValue);
    setFormErrors(prev => {
      const newErrors = { ...prev };
      if (errors[field]) {
        newErrors[field] = errors[field];
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  // Handle file selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setImageUploadMessage({
        type: 'error',
        message: 'Please select a valid image (JPEG, PNG, GIF, WEBP)'
      });
      setTimeout(() => setImageUploadMessage(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUploadMessage({
        type: 'error',
        message: 'Image size should be less than 5MB'
      });
      setTimeout(() => setImageUploadMessage(null), 3000);
      return;
    }

    setSelectedImage(file);
    
    // Create preview and show editor
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setShowImageEditor(true);
      setImageUploadMessage({
        type: 'info',
        message: 'Crop your image before uploading'
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle crop and upload
  const handleCropAndUpload = async () => {
    if (!selectedImage || !editorRef.current) return;

    // Get the canvas from the editor
    const canvas = editorRef.current.getImageScaledToCanvas();
    
    // Convert canvas to blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setImageUploadMessage({
          type: 'error',
          message: 'Failed to process image'
        });
        setTimeout(() => setImageUploadMessage(null), 3000);
        return;
      }

      // Create a file from the blob
      const croppedFile = new File([blob], selectedImage.name, {
        type: selectedImage.type,
        lastModified: Date.now(),
      });

      setUploadingImage(true);
      setImageUploadMessage({
        type: 'info',
        message: 'Uploading cropped image...'
      });

      try {
        const uploadedImage = await uploadProfileImage(croppedFile);
        setProfileData(prev => prev ? { ...prev, profileImage: uploadedImage.url } : null);
        setImagePreview(resolveImageUrl(uploadedImage.url));

        // ✅ Update localStorage so other components reflect changes
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          localStorage.setItem("user", JSON.stringify({
            ...user,
            profileImage: uploadedImage.url
          }));
        }

        // ✅ Notify other components (like Navbar) to refresh
        window.dispatchEvent(new Event('userUpdate'));

        setImageUploadMessage({
          type: 'success',
          message: 'Profile image updated successfully!'
        });
        setSelectedImage(null);
        setShowImageEditor(false);
        setTimeout(() => setImageUploadMessage(null), 3000);
      } catch (error) {
        const message = extractAxiosError(error);
        setImageUploadMessage({
          type: 'error',
          message: `Failed to upload image: ${message}`
        });
        setTimeout(() => setImageUploadMessage(null), 3000);
      } finally {
        setUploadingImage(false);
      }
    }, selectedImage.type);
  };

  // Cancel image editing
  const handleCancelCrop = () => {
    setShowImageEditor(false);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImageUploadMessage(null);
  };

  // Remove image
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
    setShowImageEditor(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Delete a profile field
  const handleDeleteField = async (field: keyof Profile) => {
    if (!confirm(`Are you sure you want to remove your ${field}?`)) return;

    try {
      await deleteProfileField(field);
      setProfileData(prev => prev ? { ...prev, [field]: '' } : null);
      setEditForm(prev => ({ ...prev, [field]: '' }));
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
      toast.success(`${field} removed successfully`);
    } catch (error) {
      const message = extractAxiosError(error);
      toast.error(`Failed to remove ${field}: ${message}`);
    }
  };

  // Save profile changes
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors: Record<string, string> = {};
    Object.keys(editForm).forEach(field => {
      const fieldErrors = validateField(field, (editForm[field as keyof Profile] as string) || '');
      if (fieldErrors[field]) {
        errors[field] = fieldErrors[field];
      }
    });
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await updateProfile(editForm);
      setProfileData(updatedProfile);
      
      // ✅ Update localStorage so other components reflect changes
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        localStorage.setItem("user", JSON.stringify({
          ...user,
          name: updatedProfile.name,
          email: updatedProfile.email
        }));
      }

      // ✅ Notify other components (like Navbar) to refresh
      window.dispatchEvent(new Event('userUpdate'));

      setIsEditModalOpen(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      const message = extractAxiosError(error);
      toast.error(`Failed to update profile: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const isBookingPast = (date: string, endTime: string) => {
    try {
      const bookingEndTime = new Date(date);
      const [hours, minutes] = endTime.split(':').map(Number);
      bookingEndTime.setHours(hours, minutes, 0, 0);
      return new Date() > bookingEndTime;
    } catch (e) {
      return false;
    }
  };

  const handleMarkAsCompleted = async (bookingId: string) => {
    if (!confirm("Are you sure you want to mark this service as completed? This will initiate the settlement to the company.")) return;

    try {
      await completeBooking(bookingId);
      toast.success("Service marked as completed!");
      
      // Refresh bookings
      setLoadingBookings(true);
      getUserBookings()
        .then(setBookings)
        .catch(err => toast.error(extractAxiosError(err)))
        .finally(() => setLoadingBookings(false));
    } catch (error) {
      const message = extractAxiosError(error);
      toast.error(message);
    }
  };

  // Get initials safely
  const getInitials = (name?: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-[#081c45] text-lg font-semibold animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    );
  }

  // No profile found
  if (!profileData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 mb-2 text-lg">No profile found.</p>
        <p className="text-sm text-gray-500">Please log in again.</p>
      </div>
    );
  }

  // Sidebar nav items
  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "consultations", label: "Consultations", icon: Calendar },
    { id: "favourites", label: "Favourites", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Ads
  const ads = [
    {
      icon: Crown,
      badge: "PREMIUM LISTING",
      title: "Luxury Penthouse",
      location: "Downtown Manhattan",
      price: "$2.5M",
      shape: "rounded-tl-3xl rounded-br-3xl",
    },
    {
      icon: TrendingUp,
      badge: "",
      title: "Modern Villa",
      location: "Beverly Hills",
      price: "$3.8M",
      shape: "rounded-tr-3xl rounded-bl-3xl",
    },
    {
      icon: Star,
      badge: "NEW LISTING",
      title: "Waterfront Condo",
      location: "Miami Beach",
      price: "$1.2M",
      shape: "rounded-[25px_10px_25px_10px]",
    },
  ];

  

  
  return (
    <div className="bg-gray-50 min-h-screen">
      <UserNavbar />
      
      {/* Spacer for Navbar */}
      <div className="h-20 lg:h-24"></div>

      <div className="lg:flex max-w-[1600px] mx-auto relative">
        {/* Mobile Header */}
        <div className="lg:hidden bg-gradient-to-br from-[#081c45] to-[#1e40af] p-4 flex items-center justify-between sticky top-0 z-50 shadow-lg">
          <h1 className="text-2xl font-bold text-[#EEB21B]">My Dashboard</h1>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-all"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Sidebar */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 z-40
            w-full sm:w-80 bg-white shadow-2xl
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto lg:min-h-screen flex flex-col`}
        >
          {/* Profile Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-[#081c45] to-[#1e40af] flex items-center gap-4">
            <div className="relative">
              <div className="relative w-16 h-16 bg-gradient-to-br from-[#EEB21B] to-[#FFD700] rounded-full flex items-center justify-center text-[#081c45] text-xl font-bold shadow-lg overflow-hidden">
                {imagePreview ? (
                  <Image 
                    src={imagePreview} 
                    alt="Profile" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  getInitials(profileData.name)
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-[#081c45] text-white p-1.5 rounded-full shadow-lg hover:bg-[#061633] transition-all border-2 border-white"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-[#EEB21B] truncate">
                My Dashboard
              </h1>
              <p className="text-white font-semibold text-sm truncate">
                {profileData.name}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300 transform hover:scale-105 ${
                    isActive
                      ? "bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Ads */}
          <div className="px-4 mt-8 pb-6">
            <h3 className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
              Featured Properties
            </h3>
            {ads.map((ad, i) => {
              const Icon = ad.icon;
              return (
                <div
                  key={i}
                  className={`border-2 border-[#FFD700] bg-gradient-to-br from-[#FFF9E6] to-[#FFFBF0]
                    p-4 mb-4 ${ad.shape} transform hover:-translate-y-2 transition-all duration-300
                    hover:shadow-xl cursor-pointer animate-fade-in`}
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  {ad.badge && (
                    <div className="flex items-center mb-2">
                      <Icon className="w-4 h-4 text-[#FFD700] mr-2" />
                      <span className="text-xs font-bold text-[#081c45]">{ad.badge}</span>
                    </div>
                  )}
                  <h4 className="font-semibold text-sm text-[#081c45]">{ad.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">
                    {ad.location} • {ad.price}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
          {activeSection === "overview" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#081c45] mb-2">
                Welcome Back, {profileData.name}!
              </h1>
              <p className="text-gray-600">Here&apos;s your dashboard overview.</p>
            </div>
          )}

          {activeSection === "consultations" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-[#081c45]">Consultations</h1>
                  <p className="text-gray-600">View and manage your scheduled consultations</p>
                </div>
                <Link 
                  href="/User/HomePage" 
                  className="bg-[rgb(210,152,4)] text-white px-6 py-2.5 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                  Book New Slot
                </Link>
              </div>

              {loadingBookings ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#081c45]"></div>
                  <p className="mt-4 text-[#081c45] font-medium">Fetching your bookings...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 animate-fade-in">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Calendar className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#081c45] mb-2">No Consultations Found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    You haven&apos;t booked any consultations yet. Start exploring companies and book your first slot today!
                  </p>
                  <Link 
                    href="/User/HomePage" 
                    className="inline-flex items-center gap-2 text-[rgb(210,152,4)] font-bold hover:underline"
                  >
                    Browse Companies <TrendingUp className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {bookings.map((booking, idx) => (
                    <div 
                      key={booking.id || idx}
                      className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:border-[rgb(210,152,4)] transition-all group relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-6">
                        {/* Company Logo/Image */}
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center overflow-hidden border-2 border-gray-100 group-hover:border-[rgb(210,152,4)] transition-colors">
                          {booking.companyDetails?.logo ? (
                            <Image 
                              src={resolveImageUrl(booking.companyDetails.logo) || ""} 
                              alt="Company" 
                              width={64} 
                              height={64} 
                              className="w-full h-full object-cover" 
                              unoptimized
                            />
                          ) : (
                            <div className="text-[rgb(210,152,4)] font-bold text-xl">
                              {booking.companyDetails?.name?.charAt(0) || "C"}
                            </div>
                          )}
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                             <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                               booking.status === "cancelled" ? "bg-red-100 text-red-700" :
                               booking.status === "confirmed" ? "bg-green-100 text-green-700" :
                               "bg-blue-100 text-blue-700"
                             }`}>
                               {booking.status}
                             </span>
                             <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                               booking.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                             }`}>
                               {booking.paymentStatus === "paid" ? "Paid" : "Payment Pending"}
                             </span>
                             <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                               booking.serviceStatus === "completed" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-700"
                             }`}>
                               Service: {booking.serviceStatus === "completed" ? "Completed" : "In Progress"}
                             </span>
                             {booking.isRescheduled && (
                               <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 flex items-center gap-1">
                                 <RefreshCcw className="w-2.5 h-2.5" /> Rescheduled
                               </span>
                             )}
                             <span className="text-xs text-gray-400">ID: #{booking.id?.slice(-6).toUpperCase()}</span>
                          </div>
                          <h3 className="text-xl font-black text-[#081c45] mb-1 group-hover:text-[rgb(210,152,4)] transition-colors">
                            {booking.companyDetails?.name || "Premium Company"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.date).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </div>
                            <div className="flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              {booking.startTime} - {booking.endTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-50">
                          {(booking.status === "confirmed" || booking.paymentStatus === "paid") && 
                           booking.serviceStatus === "pending" && 
                           isBookingPast(booking.date, booking.endTime) && (
                            <button
                              onClick={() => handleMarkAsCompleted(booking.id)}
                              className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl hover:bg-green-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-green-200 animate-pulse"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Mark as Completed
                            </button>
                          )}

                          {booking.status === "confirmed" && booking.serviceStatus === "pending" && (
                            <>
                              <button 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all text-xs"
                                onClick={() => toast.info("Chat feature coming soon!")}
                              >
                                <MessageSquare size={14} /> Chat
                              </button>
                              <button 
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all text-xs"
                                onClick={() => toast.info("Video call feature coming soon!")}
                              >
                                <Video size={14} /> Video Call
                              </button>
                            </>
                          )}

                          {booking.serviceStatus === "completed" && (
                             <button 
                               className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500 text-white font-bold hover:bg-yellow-600 transition-all text-xs"
                               onClick={() => toast.info("Review feature coming soon!")}
                              >
                               <Star size={14} /> Review Service
                             </button>
                          )}

                          {booking.status !== "cancelled" && booking.serviceStatus === "pending" && (
                            <button 
                              className="px-4 py-2 rounded-xl border-2 border-gray-100 text-gray-700 font-bold hover:bg-gray-50 transition-all text-sm"
                              onClick={() => toast.info("Please contact support to cancel or reschedule.")}
                            >
                              Help
                            </button>
                          )}
                          
                          <Link
                            href={`/User/CompanyListing`}
                            className="px-4 py-2 border-2 border-gray-100 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                          >
                            View Company
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "favourites" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl font-bold text-[#081c45] mb-2">My Favourites</h1>
              <p className="text-gray-600 mb-8">Companies you have liked</p>

              {loadingFavourites ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#081c45]"></div>
                  <p className="mt-4 text-[#081c45] font-medium">Loading favourites...</p>
                </div>
              ) : favourites.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-gray-100 animate-fade-in">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-[#081c45] mb-2">No Favourites Yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    You haven&apos;t added any companies to your favourites. 
                  </p>
                  <Link 
                    href="/User/HomePage" 
                    className="inline-flex items-center gap-2 text-[rgb(210,152,4)] font-bold hover:underline"
                  >
                     Explore Companies <TrendingUp className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favourites.map((company, idx) => (
                    <div 
                      key={company.id || idx}
                      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all group"
                    >
                      <div className="relative h-40 bg-gray-200">
                         {company.profile?.brandIdentity?.logo ? (
                           <Image
                             src={resolveImageUrl(company.profile.brandIdentity.logo) || ""}
                             alt={company.name}
                             fill
                             className="object-cover"
                           />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                             <span className="text-4xl font-bold">{company.name?.charAt(0)}</span>
                           </div>
                         )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-[#081c45] mb-2 truncate">{company.name}</h3>
                        <p className="text-sm text-gray-500 mb-4 line-clamp-2">{company.profile?.overview || "No description available"}</p>
                        
                        <Link 
                          href={`/User/CompanyPage/${company.id}`}
                          className="block w-full text-center bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeSection === "settings" && (
            <div className="animate-fade-in">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#081c45] mb-6">
                Account Settings
              </h1>
              
              {/* Image Upload Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-[#081c45] mb-4">
                  Profile Photo
                </h3>
                
                {/* Inline Message */}
                {imageUploadMessage && (
                  <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                    imageUploadMessage.type === 'success' 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : imageUploadMessage.type === 'error'
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-blue-50 text-blue-800 border border-blue-200'
                  }`}>
                    {imageUploadMessage.type === 'success' ? (
                      <Check className="w-5 h-5" />
                    ) : imageUploadMessage.type === 'error' ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : (
                      <AlertCircle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{imageUploadMessage.message}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#EEB21B]">
                      {imagePreview ? (
                        <Image 
                          src={imagePreview} 
                          alt="Profile" 
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#081c45] to-[#1e40af] flex items-center justify-center text-white text-2xl font-bold">
                          {getInitials(profileData.name)}
                        </div>
                      )}
                    </div>
                    {(selectedImage || imagePreview) && (
                      <button
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                        title="Remove photo"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-3 mb-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 bg-[#081c45] text-white px-4 py-2 rounded-lg hover:bg-[#061633] transition-colors"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Photo
                      </button>
                      
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageSelect}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Supported: JPG, PNG, GIF, WEBP • Max 5MB
                    </p>
                  </div>
                </div>
                
                {/* Image Editor Modal */}
                {showImageEditor && selectedImage && imagePreview && (
                  <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl animate-modal-in">
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-[#081c45]">Crop Profile Picture</h3>
                          <button
                            onClick={handleCancelCrop}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>
                        
                        <div className="flex flex-col items-center mb-6">
                          <AvatarEditor
                            ref={editorRef}
                            image={imagePreview}
                            width={300}
                            height={300}
                            border={50}
                            borderRadius={150}
                            scale={editorScale}
                            position={editorPosition}
                            onPositionChange={setEditorPosition}
                            className="rounded-lg"
                          />
                          
                          <div className="mt-4 w-full max-w-md">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Zoom: {editorScale.toFixed(1)}
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="3"
                              step="0.1"
                              value={editorScale}
                              onChange={(e) => setEditorScale(parseFloat(e.target.value))}
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                          <button
                            onClick={handleCancelCrop}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            disabled={uploadingImage}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleCropAndUpload}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                          >
                            {uploadingImage ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Crop & Upload
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#081c45]">
                    Profile Information
                  </h3>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white shadow-lg px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <Edit className="w-4 h-4" /> Edit
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Full Name", value: profileData.name, icon: User, field: "name" },
                    { label: "Email", value: profileData.email, icon: Mail, field: "email" },
                    { label: "Phone", value: profileData.phone, icon: Phone, field: "phone" },
                    { label: "Location", value: profileData.location, icon: MapPin, field: "location" },
                    { label: "Bio", value: profileData.bio, icon: FileText, field: "bio" },
                  ].map((item) => (
                    <div key={item.field}>
                      <label className="text-sm font-semibold text-[#081c45] flex items-center gap-2 mb-1">
                        <item.icon className="w-4 h-4" />
                        {item.label}
                      </label>
                      <div className="flex items-center gap-2">
                        <div className={`border rounded-lg p-3.5 flex-1 ${
                          item.value ? 'text-[#081c45]' : 'text-gray-400'
                        }`}>
                          {item.value || <span>Not provided</span>}
                        </div>
                        {item.value && item.field !== 'email' && item.field !== 'name' && (
                          <button
                            onClick={() => handleDeleteField(item.field as keyof Profile)}
                            className="text-red-500 hover:text-red-700 p-2"
                            title={`Remove ${item.label.toLowerCase()}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
              
              {/* Change Password Section */}
              <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mt-6">
                 <h3 className="text-xl font-semibold text-[#081c45] mb-6 flex items-center gap-2">
                   <Lock className="w-5 h-5" />
                   Security and Login
                 </h3>
                 
                  <form onSubmit={handlePasswordChange} className="space-y-4 max-w-lg">
                    <div>
                      <label className="text-sm font-semibold text-[#081c45] mb-1 block">Current Password</label>
                      <div className="relative">
                        <input 
                          type={showPasswords.old ? "text" : "password"}
                          name="oldPassword"
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordInputChange}
                          className="w-full border border-gray-300 rounded-lg p-3 pr-10 text-[#081c45] focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="Enter current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('old')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.old ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#081c45] mb-1 block">New Password</label>
                      <div className="relative">
                        <input 
                          type={showPasswords.new ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordInputChange}
                          className={`w-full border rounded-lg p-3 pr-10 text-[#081c45] focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                            passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.newPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {passwordErrors.newPassword}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#081c45] mb-1 block">Confirm New Password</label>
                      <div className="relative">
                        <input 
                          type={showPasswords.confirm ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordInputChange}
                          className={`w-full border rounded-lg p-3 pr-10 text-[#081c45] focus:ring-2 focus:ring-blue-500 outline-none transition-all ${
                            passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Confirm new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      {passwordErrors.confirmPassword && (
                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {passwordErrors.confirmPassword}
                        </p>
                      )}
                    </div>
                    
                    <button
                      type="submit"
                      disabled={passwordLoading || !passwordForm.oldPassword || !passwordForm.newPassword || !!passwordErrors.newPassword || !!passwordErrors.confirmPassword}
                      className="bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-bold flex items-center gap-2 mt-4 shadow-lg active:scale-95 transform"
                    >
                      {passwordLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Updating Security...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          Update Password
                        </>
                      )}
                    </button>
                  </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal - Wider */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-modal-in">
            <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#081c45]">Edit Profile</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveChanges} className="p-8">
              <div className="space-y-6">
                {[
                  { label: "Full Name", field: "name", icon: User, required: true },
                  { 
                    label: "Email", 
                    field: "email", 
                    icon: Mail, 
                    required: true,
                    readOnly: true,
                    helperText: "Email cannot be changed"
                  },
                  { 
                    label: "Phone", 
                    field: "phone", 
                    icon: Phone, 
                    required: false,
                    helperText: "Enter 10-digit phone number (numbers only)"
                  },
                  { label: "Location", field: "location", icon: MapPin, required: false },
                  { 
                    label: "Bio", 
                    field: "bio", 
                    icon: FileText, 
                    required: false, 
                    textarea: true,
                    helperText: "Maximum 500 characters"
                  },
                ].map((item) => (
                  <div key={item.field}>
                    <label className="text-sm font-semibold text-[#081c45] flex items-center gap-2 mb-2">
                      <item.icon className="w-4 h-4" />
                      {item.label}
                      {item.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {item.textarea ? (
                      <textarea
                        value={(editForm[item.field as keyof Profile] as string) || ''}
                        onChange={(e) => handleInputChange(item.field as keyof Profile, e.target.value)}
                        className={`w-full border rounded-lg p-3 text-[#081c45] ${
                          formErrors[item.field] ? 'border-red-500' : 'border-gray-300'
                        } ${item.readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        rows={4}
                        placeholder={`Enter your ${item.label.toLowerCase()}...`}
                        readOnly={item.readOnly}
                        maxLength={item.field === 'bio' ? 500 : undefined}
                      />
                    ) : (
                      <input
                        type={item.field === 'email' ? 'email' : 'text'}
                        value={(editForm[item.field as keyof Profile] as string) || ''}
                        onChange={(e) => handleInputChange(item.field as keyof Profile, e.target.value)}
                        className={`w-full border rounded-lg p-3 text-[#081c45] ${
                          formErrors[item.field] ? 'border-red-500' : 'border-gray-300'
                        } ${item.readOnly ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                        placeholder={item.field === 'phone' ? '1234567890' : `Enter your ${item.label.toLowerCase()}...`}
                        readOnly={item.readOnly}
                        maxLength={item.field === 'name' ? 100 : item.field === 'email' ? 100 : item.field === 'phone' ? 10 : item.field === 'location' ? 100 : undefined}
                      />
                    )}
                    
                    {/* Helper text */}
                    {item.helperText && (
                      <p className="text-sm text-gray-500 mt-1">{item.helperText}</p>
                    )}
                    
                    {/* Character count for bio */}
                    {item.field === 'bio' && (
                      <p className="text-xs text-gray-500 text-right mt-1">
                        {((editForm[item.field as keyof Profile] as string) || '').length}/500 characters
                      </p>
                    )}
                    
                    {/* Error message */}
                    {formErrors[item.field] && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {formErrors[item.field]}
                      </p>
                    )}
                    
                    {/* Success message */}
                    {!formErrors[item.field] && editForm[item.field as keyof Profile] && (
                      <p className="text-green-500 text-sm mt-1 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {item.field === 'phone' && (editForm[item.field as keyof Profile] as string).length === 10 
                          ? 'Valid phone number' 
                          : 'Looks good!'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4 pt-8">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || Object.values(formErrors).some(error => !!error)}
                  className="flex-1 bg-gradient-to-r from-[#081c45] to-[#1e40af] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-medium flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes modal-in {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-modal-in { animation: modal-in 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default Dashboard;
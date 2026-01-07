'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Building, Users, Award, Calendar, Edit, Save, X, CheckCircle, Star, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { getProfile as apiGetProfile, saveProfile as apiSaveProfile } from '@/services/CompanyService';
import { toast } from 'react-toastify';

interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  categories: string[];
  services: string[];
  consultationFee: number;
  establishedYear: number;
  companySize: string;
  overview: string;
  projectsCompleted: number;
  happyCustomers: number;
  awardsWon: number;
  awardsRecognition: string;
  contactOptions: {
    chatSupport: boolean;
    videoCalls: boolean;
  };
  teamMembers: Array<{
    id: number;
    name: string;
    qualification: string;
    role: string;
    photo?: string;
  }>;
  projects: Array<{
    id: number;
    title: string;
    description: string;
    beforeImage?: string;
    afterImage?: string;
  }>;
  brandIdentity: {
    logo?: string;
    banner1?: string;
    banner2?: string;
    profilePicture?: string;
  };
}

const defaultCompanyProfile: CompanyProfile = {
  id: '1',
  name: 'Elite Construction & Design',
  email: 'contact@eliteconstruction.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, USA',
  categories: ['Residential', 'Commercial', 'Villas'],
  services: ['Architecture', 'Renovation', 'Interior Design'],
  consultationFee: 250,
  establishedYear: 2010,
  companySize: '51-200 employees',
  overview: 'Elite Construction & Design is a premier construction company specializing in high-end residential and commercial projects. With over a decade of experience, we combine innovative design with exceptional craftsmanship to bring our clients visions to life. Our team of certified architects and engineers ensures every project meets the highest standards of quality and safety.',
  projectsCompleted: 350,
  happyCustomers: 280,
  awardsWon: 15,
  awardsRecognition: 'Winner of the 2022 National Architecture Award, Certified Green Building Partner, ISO 9001:2015 Certified, Recognized by Construction Excellence Association for innovative design solutions and sustainable building practices.',
  contactOptions: {
    chatSupport: true,
    videoCalls: true,
  },
  teamMembers: [
    {
      id: 1,
      name: 'John Anderson',
      qualification: 'M.Arch, LEED AP',
      role: 'Lead Architect',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      qualification: 'B.Eng Civil, PMP',
      role: 'Project Manager',
      photo: 'https://images.unsplash.com/photo-1494790108755-2616b786d4d9?w-400&h=400&fit=crop&crop=face',
    },
    {
      id: 3,
      name: 'Michael Chen',
      qualification: 'M.Sc Structural Engineering',
      role: 'Structural Engineer',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    },
    {
      id: 4,
      name: 'Emma Rodriguez',
      qualification: 'B.Des Interior Design',
      role: 'Interior Designer',
      photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face',
    },
  ],
  projects: [
    {
      id: 1,
      title: 'Modern Luxury Villa',
      description: 'A stunning 5-bedroom villa with sustainable features, smart home technology, and panoramic views. Completed in 2022 with LEED Platinum certification.',
      beforeImage: 'https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg?auto=compress&cs=tinysrgb&w=600',
      afterImage: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: 2,
      title: 'Corporate Office Tower',
      description: '35-story commercial tower with innovative biophilic design, energy-efficient systems, and premium amenities. Completed in 2023.',
      beforeImage: 'https://images.pexels.com/photos/2607544/pexels-photo-2607544.jpeg?auto=compress&cs=tinysrgb&w=600',
      afterImage: 'https://images.pexels.com/photos/1329711/pexels-photo-1329711.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      id: 3,
      title: 'Historic Building Renovation',
      description: 'Complete restoration and modernization of a 19th-century heritage building while preserving its architectural integrity.',
      beforeImage: 'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600',
      afterImage: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ],
  brandIdentity: {
    logo: 'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=400&fit=crop',
    banner1: 'https://images.pexels.com/photos/221024/pexels-photo-221024.jpeg?auto=compress&cs=tinysrgb&w=1200',
    banner2: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1200',
    profilePicture: 'https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=400&h=400&fit=crop',
  },
};

export default function CompanyProfilePage() {
  const [profile, setProfile] = useState<CompanyProfile>(defaultCompanyProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<CompanyProfile>(defaultCompanyProfile);
  const [isLoading, setIsLoading] = useState(false);

  // Category and service options
  const categoryOptions = ['Residential', 'Commercial', 'Villas', 'Industrial', 'Hospitality'];
  const serviceOptions = ['Architecture', 'Renovation', 'Interior Design', 'Construction', 'Project Management', 'Consultation'];
  const companySizeOptions = ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees'];

  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          toast.error("User not found. Please log in again.");
          return;
        }
        
        const user = JSON.parse(storedUser);
        const companyId = user.id || user._id;

        const data = await apiGetProfile(companyId);
        
        if (data && data.profile) {
          const mappedProfile: CompanyProfile = {
            id: companyId,
            name: data.name || data.profile.companyName || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            ...data.profile,
            brandIdentity: data.profile.brandIdentity || defaultCompanyProfile.brandIdentity
          };
          setProfile(mappedProfile);
          setTempProfile(mappedProfile);
        } else {
          // If no profile, initialize with basic info from user object
          const initialProfile = {
            ...defaultCompanyProfile,
            id: companyId,
            name: data.name || user.name || '',
            email: data.email || user.email || '',
          };
          setProfile(initialProfile);
          setTempProfile(initialProfile);
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Failed to fetch profile";
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditClick = () => {
    setTempProfile(profile);
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;
      
      const user = JSON.parse(storedUser);
      const companyId = user.id || user._id;

      const profileData = {
        companyName: tempProfile.name,
        categories: tempProfile.categories,
        services: tempProfile.services,
        consultationFee: Number(tempProfile.consultationFee),
        establishedYear: Number(tempProfile.establishedYear),
        companySize: tempProfile.companySize,
        location: tempProfile.location,
        overview: tempProfile.overview,
        projectsCompleted: Number(tempProfile.projectsCompleted),
        happyCustomers: Number(tempProfile.happyCustomers),
        awardsWon: Number(tempProfile.awardsWon),
        awardsRecognition: tempProfile.awardsRecognition,
        contactOptions: tempProfile.contactOptions,
        teamMembers: tempProfile.teamMembers,
        projects: tempProfile.projects,
        brandIdentity: tempProfile.brandIdentity
      };

      await apiSaveProfile(companyId, profileData);
      setProfile(tempProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update profile";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof CompanyProfile, value: string | number | string[] | boolean | object) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContactOptionChange = (option: keyof CompanyProfile['contactOptions']) => {
    setTempProfile(prev => ({
      ...prev,
      contactOptions: {
        ...prev.contactOptions,
        [option]: !prev.contactOptions[option],
      },
    }));
  };

  const handleTeamMemberChange = (id: number, field: keyof CompanyProfile['teamMembers'][0], value: string) => {
    setTempProfile(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      ),
    }));
  };

  const handleProjectChange = (id: number, field: keyof CompanyProfile['projects'][0], value: string) => {
    setTempProfile(prev => ({
      ...prev,
      projects: prev.projects.map(project =>
        project.id === id ? { ...project, [field]: value } : project
      ),
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setTempProfile(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleServiceToggle = (service: string) => {
    setTempProfile(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service],
    }));
  };

  // Statistics Cards Component
  const StatCard = ({ icon: Icon, value, label, color = 'blue' }: { icon: React.ElementType, value: string | number, label: string, color?: string }) => {
    const colorClasses = {
      blue: 'bg-blue-50 text-blue-600 border-blue-100',
      green: 'bg-green-50 text-green-600 border-green-100',
      amber: 'bg-amber-50 text-amber-600 border-amber-100',
      purple: 'bg-purple-50 text-purple-600 border-purple-100',
    };

    return (
      <div className={`p-6 rounded-xl border ${colorClasses[color as keyof typeof colorClasses]}`}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-lg bg-white">
            <Icon size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-sm font-medium opacity-80">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  // Status Badge Component
  const StatusBadge = ({ active, label }: { active: boolean, label: string }) => (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
      {active ? <CheckCircle size={14} /> : <X size={14} />}
      {label}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
              <Image 
                src={tempProfile.brandIdentity.logo || 'https://via.placeholder.com/400x400'} 
                alt="Logo" 
                width={96} 
                height={96} 
                className="w-full h-full object-contain" 
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building size={16} />
                  <span>Est. {profile.establishedYear}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 -mt-12 relative z-10">
        {/* Header Actions */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex flex-wrap gap-2">
            {profile.categories.map(category => (
              <span key={category} className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                {category}
              </span>
            ))}
          </div>
          {!isEditing ? (
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Edit size={20} />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleCancelClick}
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <X size={20} />
                Cancel
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-8">
            {/* Company Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building size={20} />
                  Company Overview
                </h2>
                {isEditing && (
                  <span className="text-sm text-blue-600 font-medium">Editing</span>
                )}
              </div>
              {isEditing ? (
                <textarea
                  value={tempProfile.overview}
                  onChange={(e) => handleInputChange('overview', e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  placeholder="Tell us about your company..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {profile.overview}
                </p>
              )}
            </div>

            {/* Services Offered */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <CheckCircle size={20} />
                Services Offered
              </h2>
              {isEditing ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Select services your company offers:</p>
                  <div className="flex flex-wrap gap-3">
                    {serviceOptions.map(service => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleServiceToggle(service)}
                        className={`px-4 py-2 rounded-lg border transition-colors ${tempProfile.services.includes(service)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {service}
                        {tempProfile.services.includes(service) && (
                          <CheckCircle size={16} className="inline ml-2" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {profile.services.map(service => (
                    <span key={service} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users size={20} />
                  Our Team
                </h2>
                {isEditing && (
                  <span className="text-sm text-blue-600 font-medium">Editing</span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {tempProfile.teamMembers.map(member => (
                  <div key={member.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <Image
                        src={member.photo || 'https://via.placeholder.com/64x64'}
                        alt={member.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(member.id, 'name', e.target.value)}
                            className="w-full mb-2 px-3 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                            placeholder="Name"
                          />
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(member.id, 'role', e.target.value)}
                            className="w-full mb-2 px-3 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                            placeholder="Role"
                          />
                          <input
                            type="text"
                            value={member.qualification}
                            onChange={(e) => handleTeamMemberChange(member.id, 'qualification', e.target.value)}
                            className="w-full px-3 py-1 border border-gray-300 rounded text-gray-900 text-sm"
                            placeholder="Qualification"
                          />
                        </>
                      ) : (
                        <>
                          <h3 className="font-bold text-gray-900 mb-1">{member.name}</h3>
                          <p className="text-blue-600 text-sm font-medium mb-1">{member.role}</p>
                          <p className="text-gray-600 text-sm">{member.qualification}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Award size={20} />
                  Featured Projects
                </h2>
                {isEditing && (
                  <span className="text-sm text-blue-600 font-medium">Editing</span>
                )}
              </div>
              <div className="space-y-6">
                {tempProfile.projects.map(project => (
                  <div key={project.id} className="border border-gray-200 rounded-xl p-5">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={project.title}
                          onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)}
                          className="w-full mb-3 px-3 py-2 border border-gray-300 rounded text-lg font-bold text-gray-900"
                          placeholder="Project Title"
                        />
                        <textarea
                          value={project.description}
                          onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)}
                          rows={3}
                          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded text-gray-900"
                          placeholder="Project description..."
                        />
                      </>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{project.title}</h3>
                        <p className="text-gray-700 mb-4">{project.description}</p>
                      </>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">Before</div>
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={project.beforeImage || 'https://via.placeholder.com/600x400'}
                            alt="Before"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-2">After</div>
                        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                          <Image
                            src={project.afterImage || 'https://via.placeholder.com/600x400'}
                            alt="After"
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Company Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Building size={20} />
                Company Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <p className="text-gray-900 font-medium">{profile.email}</p>
                    <span className="text-xs text-gray-500">(Not editable)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={tempProfile.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Phone size={16} className="text-gray-400" />
                      <p className="text-gray-900 font-medium">{profile.phone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempProfile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-400" />
                      <p className="text-gray-900 font-medium">{profile.location}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categories</label>
                  {isEditing ? (
                    <div className="space-y-2">
                      {categoryOptions.map(category => (
                        <div key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`cat-${category}`}
                            checked={tempProfile.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          />
                          <label htmlFor={`cat-${category}`} className="ml-2 text-gray-900 text-sm">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile.categories.map(category => (
                        <span key={category} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Size</label>
                  {isEditing ? (
                    <select
                      value={tempProfile.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                    >
                      {companySizeOptions.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-900 font-medium">{profile.companySize}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={tempProfile.establishedYear}
                      onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value))}
                      min="1900"
                      max="2024"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-gray-900 font-medium">{profile.establishedYear}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee</label>
                  {isEditing ? (
                    <div className="relative">
                      <input
                        type="number"
                        value={tempProfile.consultationFee}
                        onChange={(e) => handleInputChange('consultationFee', parseFloat(e.target.value))}
                        min="0"
                        step="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 pl-8"
                      />
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    </div>
                  ) : (
                    <p className="text-gray-900 font-medium">${profile.consultationFee}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <StatCard
                icon={Award}
                value={profile.projectsCompleted}
                label="Projects Completed"
                color="blue"
              />
              <StatCard
                icon={Star}
                value={profile.happyCustomers}
                label="Happy Customers"
                color="green"
              />
              <StatCard
                icon={Award}
                value={profile.awardsWon}
                label="Awards Won"
                color="amber"
              />
            </div>

            {/* Contact Options */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Phone size={20} />
                Contact Options
              </h2>
              <div className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Chat Support</p>
                        <p className="text-sm text-gray-600">Enable instant messaging</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleContactOptionChange('chatSupport')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempProfile.contactOptions.chatSupport ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempProfile.contactOptions.chatSupport ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Video Calls</p>
                        <p className="text-sm text-gray-600">Schedule video consultations</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleContactOptionChange('videoCalls')}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tempProfile.contactOptions.videoCalls ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tempProfile.contactOptions.videoCalls ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <StatusBadge
                      active={profile.contactOptions.chatSupport}
                      label="Chat Support Available"
                    />
                    <StatusBadge
                      active={profile.contactOptions.videoCalls}
                      label="Video Calls Available"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Awards & Recognition */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award size={20} />
                Awards & Recognition
              </h2>
              {isEditing ? (
                <textarea
                  value={tempProfile.awardsRecognition}
                  onChange={(e) => handleInputChange('awardsRecognition', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                  placeholder="List your awards, certifications, and recognitions..."
                />
              ) : (
                <p className="text-gray-700 whitespace-pre-line text-sm">
                  {profile.awardsRecognition}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface TeamMember {
  id: number;
  name: string;
  qualification: string;
  role: string;
  photo?: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  beforeImage?: string;
  afterImage?: string;
}

export default function CompanyProfileManagement() {
  // Form state
  const [companyName, setCompanyName] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [consultationFee, setConsultationFee] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [companySize, setCompanySize] = useState('1-10 employees');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [overview, setOverview] = useState('');
  const [projectsCompleted, setProjectsCompleted] = useState('');
  const [happyCustomers, setHappyCustomers] = useState('');
  const [awardsWon, setAwardsWon] = useState('');
  const [awardsRecognition, setAwardsRecognition] = useState('');
  const [chatSupport, setChatSupport] = useState(true);
  const [videoCalls, setVideoCalls] = useState(false);
  
  // Dynamic content state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: 1, name: '', qualification: '', role: '' }
  ]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, title: '', description: '', beforeImage: '', afterImage: '' }
  ]);
  const [editingMode, setEditingMode] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error' | 'warning' | 'info'} | null>(null);

  // Category options
  const categoryOptions = ['Residential', 'Commercial', 'Villas'];
  const serviceOptions = ['Architecture', 'Renovation', 'Interior Design'];
  const companySizeOptions = ['1-10 employees', '11-50 employees', '51-200 employees', '200+ employees'];

  // Handle category selection
  const toggleCategory = (category: string) => {
    setCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Handle service selection
  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  // Team member functions
  const addTeamMember = () => {
    const newId = teamMembers.length > 0 ? Math.max(...teamMembers.map(m => m.id)) + 1 : 1;
    setTeamMembers([...teamMembers, { id: newId, name: '', qualification: '', role: '' }]);
    showNotification('Team member added', 'success');
  };

  const removeTeamMember = (id: number) => {
    if (teamMembers.length > 1) {
      if (window.confirm('Are you sure you want to remove this team member?')) {
        setTeamMembers(teamMembers.filter(member => member.id !== id));
        showNotification('Team member removed successfully', 'success');
      }
    } else {
      alert('At least one team member is required.');
    }
  };

  const updateTeamMember = (id: number, field: keyof TeamMember, value: string) => {
    setTeamMembers(teamMembers.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  // Project functions
  const addProject = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    setProjects([...projects, { id: newId, title: '', description: '', beforeImage: '', afterImage: '' }]);
    showNotification('Project added', 'success');
  };

  const removeProject = (id: number) => {
    if (projects.length > 1) {
      if (window.confirm('Are you sure you want to remove this project?')) {
        setProjects(projects.filter(project => project.id !== id));
        showNotification('Project removed successfully', 'success');
      }
    } else {
      alert('At least one project is required.');
    }
  };

  const updateProject = (id: number, field: keyof Project, value: string) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, [field]: value } : project
    ));
  };

  // File upload handlers
  const handleFileUpload = (type: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Uploading ${type}:`, file.name);
      showNotification(`${type} uploaded successfully`, 'success');
    }
  };

  // Main action functions
  const toggleEditProfile = () => {
    setEditingMode(!editingMode);
    showNotification(editingMode ? 'Profile changes saved successfully' : 'Profile is now in edit mode', 'success');
  };

  const previewProfile = () => {
    showNotification('Opening profile preview...', 'info');
    setTimeout(() => {
      alert('Profile preview would open here (Demo mode)');
    }, 1000);
  };

  const saveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showNotification('Profile saved successfully!', 'success');
    // Here you would typically send data to your backend
  };

  const deleteProfile = () => {
    if (window.confirm('Are you sure you want to delete this entire profile? This action cannot be undone.')) {
      if (window.confirm('This will permanently delete all company data, team members, and projects. Are you absolutely sure?')) {
        showNotification('Profile deletion initiated...', 'warning');
        setTimeout(() => {
          alert('Profile would be deleted (Demo mode)');
        }, 2000);
      }
    }
  };

  // Notification system
  const showNotification = (message: string, type: 'success' | 'error' | 'warning' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // Checkbox styling helper
  const getCheckboxClass = (isSelected: boolean) => {
    return isSelected 
      ? 'border-company-gold bg-gradient-to-r from-company-blue-dark to-company-blue-light'
      : 'border-gray-300';
  };

  const getCheckIconClass = (isSelected: boolean) => {
    return isSelected ? 'opacity-100' : 'opacity-0';
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Company <span className="text-transparent bg-clip-text bg-gradient-to-r from-company-blue-dark to-company-blue-light">Profile</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Showcase your construction and design expertise to potential clients
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={saveProfile} className="space-y-12">
          {/* Logo & Banner Upload Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-image text-company-gold mr-3"></i>
              Brand Identity
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700">Company Logo</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-company-gold transition-colors duration-300 cursor-pointer group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('logo', e)}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto h-24 w-24 bg-gradient-to-br from-company-blue-dark to-company-blue-light rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className="fas fa-upload text-white text-2xl"></i>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Upload your logo</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Banner Upload 1 */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700">Banner Image 1</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-company-gold transition-colors duration-300 cursor-pointer group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('banner1', e)}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-32 bg-gradient-to-r from-company-blue-dark to-company-blue-light rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <i className="fas fa-panoramic text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Upload banner image 1</p>
                      <p className="text-sm text-gray-500">Recommended: 1920x600px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Banner Upload 2 */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700">Banner Image 2</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-company-gold transition-colors duration-300 cursor-pointer group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('banner2', e)}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-32 bg-gradient-to-r from-company-blue-dark to-company-blue-light rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <i className="fas fa-panoramic text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Upload banner image 2</p>
                      <p className="text-sm text-gray-500">Recommended: 1920x600px</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Profile Pic Upload */}
              <div className="space-y-4">
                <label className="block text-lg font-semibold text-gray-700">Company Profile Picture</label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-company-gold transition-colors duration-300 cursor-pointer group">
                  <input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                    accept="image/*"
                    onChange={(e) => handleFileUpload('profile picture', e)}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto h-20 w-32 bg-gradient-to-r from-company-blue-dark to-company-blue-light rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                      <i className="fas fa-panoramic text-white text-xl"></i>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Company Profile Picture</p>
                      <p className="text-sm text-gray-500">Recommended: 1920x600px</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Basic Information Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-building text-company-gold mr-3"></i>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Company Name */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name *</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="Enter company name"
                />
              </div>

              {/* Categories */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Categories (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryOptions.map((category) => (
                    <label key={category} className="relative flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={categories.includes(category)}
                        onChange={() => toggleCategory(category)}
                      />
                      <div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center group-hover:border-company-gold transition-colors duration-300 ${getCheckboxClass(categories.includes(category))}`}>
                        <i className={`fas fa-check text-white text-sm transition-opacity ${getCheckIconClass(categories.includes(category))}`}></i>
                      </div>
                      <span className="text-gray-700 font-medium">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Services Offered */}
              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-4">Services Offered (Select multiple)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {serviceOptions.map((service) => (
                    <label key={service} className="relative flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="sr-only"
                        checked={services.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      <div className={`w-6 h-6 border-2 rounded-md mr-3 flex items-center justify-center group-hover:border-company-gold transition-colors duration-300 ${getCheckboxClass(services.includes(service))}`}>
                        <i className={`fas fa-check text-white text-sm transition-opacity ${getCheckIconClass(services.includes(service))}`}></i>
                      </div>
                      <span className="text-gray-700 font-medium">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Consultation Fee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Consultation Fee*</label>
                <input 
                  type="number" 
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="Enter consultation fee"
                />
              </div>

              {/* Established Year */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Established Year*</label>
                <input 
                  type="number" 
                  min="1900" 
                  max="2024"
                  value={establishedYear}
                  onChange={(e) => setEstablishedYear(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="2020"
                />
              </div>

              {/* Company Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size *</label>
                <select 
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                >
                  {companySizeOptions.map((size) => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="City, Country"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="company@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>

          {/* Company Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-file-alt text-company-gold mr-3"></i>
              Company Overview
            </h2>
            <textarea 
              rows={8}
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
              placeholder="Tell us about your company's mission, values, and what makes you unique in the construction and design industry..."
            />
          </div>

          {/* Contact Options */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-phone text-company-gold mr-3"></i>
              Contact Options
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <i className="fas fa-comments text-company-blue-light text-xl mr-4"></i>
                    <div>
                      <h3 className="font-semibold text-gray-900">Chat Support</h3>
                      <p className="text-sm text-gray-600">Enable instant messaging</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 text-sm font-medium ${chatSupport ? 'text-green-600' : 'text-gray-500'}`}>
                      {chatSupport ? 'Enabled' : 'Disabled'}
                    </span>
                    <div 
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${chatSupport ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => setChatSupport(!chatSupport)}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${chatSupport ? 'translate-x-6' : ''}`}></div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center">
                    <i className="fas fa-video text-company-blue-light text-xl mr-4"></i>
                    <div>
                      <h3 className="font-semibold text-gray-900">Video Calls</h3>
                      <p className="text-sm text-gray-600">Admin verification required</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`mr-2 text-sm font-medium ${videoCalls ? 'text-green-600' : 'text-gray-500'}`}>
                      {videoCalls ? 'Enabled' : 'Disabled'}
                    </span>
                    <div 
                      className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${videoCalls ? 'bg-green-500' : 'bg-gray-300'}`}
                      onClick={() => setVideoCalls(!videoCalls)}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${videoCalls ? 'translate-x-6' : ''}`}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <img 
                  src="https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=500" 
                  alt="Customer Support" 
                  className="rounded-xl shadow-lg w-full h-48 object-cover"
                />
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-chart-bar text-company-gold mr-3"></i>
              Company Statistics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Projects Completed</label>
                <input 
                  type="number" 
                  min="0"
                  value={projectsCompleted}
                  onChange={(e) => setProjectsCompleted(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Happy Customers</label>
                <input 
                  type="number" 
                  min="0"
                  value={happyCustomers}
                  onChange={(e) => setHappyCustomers(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Awards Won</label>
                <input 
                  type="number" 
                  min="0"
                  value={awardsWon}
                  onChange={(e) => setAwardsWon(e.target.value)}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Team Members Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-users text-company-gold mr-3"></i>
              Team Members
            </h2>
            
            <div className="space-y-6">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-member p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
                    <div className="text-center">
                      <div className="relative inline-block">
                        <div className="w-24 h-24 bg-gradient-to-br from-company-blue-dark to-company-blue-light rounded-full flex items-center justify-center cursor-pointer group hover:scale-105 transition-transform duration-300">
                          <i className="fas fa-user-plus text-white text-2xl group-hover:scale-110 transition-transform duration-300"></i>
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(`team member ${member.id} photo`, e)}
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Upload Photo</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                      <input 
                        type="text" 
                        value={member.name}
                        onChange={(e) => updateTeamMember(member.id, 'name', e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                        placeholder="Full Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Qualification</label>
                      <input 
                        type="text" 
                        value={member.qualification}
                        onChange={(e) => updateTeamMember(member.id, 'qualification', e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                        placeholder="B.Arch, M.Eng, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                      <input 
                        type="text" 
                        value={member.role}
                        onChange={(e) => updateTeamMember(member.id, 'role', e.target.value)}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                        placeholder="Senior Architect"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => removeTeamMember(member.id)}
                    className="mt-4 text-red-600 hover:text-red-800 font-medium"
                  >
                    <i className="fas fa-trash mr-1"></i> Remove Member
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addTeamMember}
              className="mt-6 bg-gradient-to-r from-company-blue-dark to-company-blue-light text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-plus mr-2"></i> Add Team Member
            </button>
          </div>

          {/* Projects/Success Stories */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-trophy text-company-gold mr-3"></i>
              Projects & Success Stories
            </h2>
            
            <div className="space-y-8">
              {projects.map((project) => (
                <div key={project.id} className="project-item p-6 border border-gray-200 rounded-xl bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Title</label>
                        <input 
                          type="text" 
                          value={project.title}
                          onChange={(e) => updateProject(project.id, 'title', e.target.value)}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                          placeholder="Modern Villa Construction"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Description</label>
                        <textarea 
                          rows={4}
                          value={project.description}
                          onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                          className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
                          placeholder="Describe the project details, challenges overcome, and outcomes achieved..."
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Before Image</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-company-gold transition-colors duration-300 cursor-pointer">
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(`project ${project.id} before image`, e)}
                          />
                          <i className="fas fa-image text-gray-400 text-3xl mb-2"></i>
                          <p className="text-sm text-gray-600">Upload Before Image</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">After Image</label>
                        <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-company-gold transition-colors duration-300 cursor-pointer">
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept="image/*"
                            onChange={(e) => handleFileUpload(`project ${project.id} after image`, e)}
                          />
                          <i className="fas fa-image text-gray-400 text-3xl mb-2"></i>
                          <p className="text-sm text-gray-600">Upload After Image</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => removeProject(project.id)}
                    className="mt-4 text-red-600 hover:text-red-800 font-medium"
                  >
                    <i className="fas fa-trash mr-1"></i> Remove Project
                  </button>
                </div>
              ))}
            </div>
            
            <button 
              type="button" 
              onClick={addProject}
              className="mt-6 bg-gradient-to-r from-company-blue-dark to-company-blue-light text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <i className="fas fa-plus mr-2"></i> Add Project
            </button>
          </div>

          {/* Awards & Recognition */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
              <i className="fas fa-medal text-company-gold mr-3"></i>
              Awards & Recognition
            </h2>
            <textarea 
              rows={6}
              value={awardsRecognition}
              onChange={(e) => setAwardsRecognition(e.target.value)}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-company-blue-light focus:border-transparent transition-all duration-300 ${editingMode ? 'ring-2 ring-company-gold' : ''}`}
              placeholder="List your awards, certifications, recognitions, and achievements in the construction and design industry..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button 
              type="button" 
              onClick={toggleEditProfile}
              className="w-full sm:w-auto bg-gradient-to-r from-company-gold to-yellow-500 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <i className={`fas ${editingMode ? 'fa-save' : 'fa-edit'} mr-3`}></i>
              {editingMode ? 'Save All Changes' : 'Edit Profile'}
            </button>
            
            <button 
              type="submit"
              className="w-full sm:w-auto bg-gradient-to-r from-company-blue-dark to-company-blue-light text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <i className="fas fa-save mr-3"></i>
              Save Profile
            </button>
            
            <button 
              type="button" 
              onClick={previewProfile}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <i className="fas fa-eye mr-3"></i>
              Preview Profile
            </button>
            
            <button 
              type="button" 
              onClick={deleteProfile}
              className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 text-white px-12 py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
            >
              <i className="fas fa-trash mr-3"></i>
              Delete Profile
            </button>
          </div>
        </form>

        {/* Showcase Images */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">Industry Excellence Showcase</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="relative overflow-hidden rounded-xl shadow-lg group">
              <img 
                src="https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Modern Architecture" 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold">Modern Architecture</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg group">
              <img 
                src="https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Interior Design" 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold">Luxury Interiors</p>
              </div>
            </div>
            
            <div className="relative overflow-hidden rounded-xl shadow-lg group">
              <img 
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600" 
                alt="Construction" 
                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                <p className="text-white font-semibold">Quality Construction</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-500 text-white' :
          notification.type === 'error' ? 'bg-red-500 text-white' :
          notification.type === 'warning' ? 'bg-yellow-500 text-black' :
          'bg-blue-500 text-white'
        }`}>
          <div className="flex items-center">
            <i className={`fas ${
              notification.type === 'success' ? 'fa-check-circle' :
              notification.type === 'error' ? 'fa-exclamation-circle' :
              notification.type === 'warning' ? 'fa-exclamation-triangle' :
              'fa-info-circle'
            } mr-3`}></i>
            <span>{notification.message}</span>
            <button 
              onClick={() => setNotification(null)} 
              className="ml-4 text-lg"
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Add Tailwind config and Font Awesome in your global CSS or layout */}
      <style jsx global>{`
        :root {
          --company-blue-dark: rgb(8, 28, 69);
          --company-blue-light: rgb(30, 64, 175);
          --company-gold: rgb(210, 152, 4);
        }
      `}</style>
    </div>
  );
}
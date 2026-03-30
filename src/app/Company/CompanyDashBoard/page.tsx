"use client";

import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement, Filler } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import Sidebar from '@/components/company/SideBarLayout';
import SlotManagement from '../SlotManagment/page';
import CompanyBookings from '../Bookings/page';
import CompanyProfilePage from '../CompanyProfile/page';
import CompanySubscriptionPage from '../Subscription/page';
import CompanyWalletPage from '../Wallet/page';
import CompanyReviewsPage from '../Reviews/page';
import NotificationBell from '@/components/notifications/NotificationBell';
import Image from 'next/image';
import { resolveImageUrl } from '@/utils/urlHelper';
import CompanyMessagesPage from '../Messages/page';
import { useRouter } from 'next/navigation';
import { Booking } from '@/types/BookingTypes';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title,
  PointElement,
  LineElement,
  Filler
);

interface IDashboardStats {
  totalConsultations: number;
  completedProjects: number;
  monthlyEarnings: number;
  averageRating: number;
  statusBreakdown: { status: string; count: number }[];
  revenueTrends: { month: string; amount: number }[];
  walletBalance: number;
  isSubscribed: boolean;
  documentStatus: string;
}

interface WalletInfo {
  balance: number;
  transactions?: {
    id: string;
    amount: number;
    type: string;
    date: string;
    description: string;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({ 
    id: '', 
    name: 'Elite Properties Ltd.', 
    type: 'Company Account', 
    initials: 'EP', 
    isSubscribed: false,
    logo: ''
  });
  const [dashboardStats, setDashboardStats] = useState<IDashboardStats | null>(null);
  const [realtimeActivities, setRealtimeActivities] = useState<Booking[]>([]);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);

  // Fetch user info on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo(prev => ({
        ...prev,
        id: user.id || '',
        name: user.name || 'Elite Properties Ltd.',
        initials: (user.name || 'E').charAt(0).toUpperCase(),
        isSubscribed: user.isSubscribed || false
      }));

      // Fetch data
      import('@/services/CompanyService').then(({ getDashboardStats, getMyProfile, getCompanyBookings, getWallet }) => {
        getDashboardStats().then(stats => {
          setDashboardStats(stats);
          if (stats.isSubscribed !== undefined) {
            setUserInfo(prev => ({ ...prev, isSubscribed: stats.isSubscribed }));
          }
        }).catch(_err => {
          console.error("Fetch dashboard stats failed", _err);
        });

        getCompanyBookings(1, 5).then(data => {
          const bookings = Array.isArray(data) ? data : (data?.bookings || []);
          setRealtimeActivities(bookings);
        }).catch(_err => console.error("Fetch recent activities failed", _err));

        getWallet().then(data => {
          setWalletInfo(data);
        }).catch(_err => console.error("Fetch wallet failed", _err));

        // Sync profile for isSubscribed and Logo
        getMyProfile().then(profile => {
          if (profile) {
            setUserInfo(prev => ({ 
              ...prev, 
              isSubscribed: !!profile.isSubscribed,
              logo: (profile.profile?.brandIdentity?.logo || profile.profileImage || '') as string
            }));
            // Update localStorage if changed
            if (profile.isSubscribed !== user.isSubscribed) {
              const newUser = { ...user, isSubscribed: !!profile.isSubscribed };
              localStorage.setItem('user', JSON.stringify(newUser));
            }
          }
        }).catch(_err => {
          console.error("Sync profile failed", _err);
        });
      });
    } else {
      router.push('/signup?show=login&userType=company');
    }
  }, [router]);

  // Chart data
  const earningsData = {
    labels: dashboardStats?.revenueTrends?.length 
      ? dashboardStats.revenueTrends.map(t => t.month) 
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Earnings (₹)',
        data: dashboardStats?.revenueTrends?.length 
          ? dashboardStats.revenueTrends.map(t => t.amount) 
          : [0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(30, 64, 175, 0.8)',
        borderRadius: 8,
      }
    ]
  };

  const bookingStatusData = {
    labels: dashboardStats?.statusBreakdown?.length 
      ? dashboardStats.statusBreakdown.map(s => s.status.charAt(0).toUpperCase() + s.status.slice(1)) 
      : ['Completed', 'Pending', 'Cancelled'],
    datasets: [
      {
        data: dashboardStats?.statusBreakdown?.length 
          ? dashboardStats.statusBreakdown.map(s => s.count) 
          : [0, 0, 0],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
        borderWidth: 0,
      }
    ]
  };


  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        }
      }
    },
    cutout: '70%',
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const stats = [
    {
      title: 'Total Consultations',
      value: dashboardStats?.totalConsultations || '0',
      change: 'Lifetime',
      icon: 'calendar',
      color: 'blue',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Monthly Earnings',
      value: `₹${(dashboardStats?.monthlyEarnings || 0).toLocaleString()}`,
      change: 'This Month',
      icon: 'currency',
      color: 'green',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Average Rating',
      value: (dashboardStats?.averageRating || 0).toFixed(1),
      change: `${(dashboardStats?.averageRating || 0).toFixed(1)}/5`,
      icon: 'star',
      color: 'yellow',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Completed Projects',
      value: dashboardStats?.completedProjects || '0',
      change: 'Delivered',
      icon: 'building',
      color: 'purple',
      bgColor: 'bg-purple-100'
    }
  ];

  // Derived Stats
  const cancelledCount = dashboardStats?.statusBreakdown?.find(s => s.status.toLowerCase() === 'cancelled')?.count || 0;
  const completedCount = dashboardStats?.statusBreakdown?.find(s => s.status.toLowerCase() === 'completed')?.count || 0;
  const pendingCount = dashboardStats?.statusBreakdown?.find(s => ['pending', 'scheduled'].includes(s.status.toLowerCase()))?.count || 0;
  const totalBookings = dashboardStats?.totalConsultations || (cancelledCount + completedCount + pendingCount) || 1;
  const cancellationRate = ((cancelledCount / totalBookings) * 100).toFixed(1);

  const dynamicProjectStatus = [
    { name: 'Completed', percentage: Math.round((completedCount / totalBookings) * 100), color: 'bg-green-500' },
    { name: 'Pending', percentage: Math.round((pendingCount / totalBookings) * 100), color: 'bg-yellow-500' },
    { name: 'Cancelled', percentage: Math.round((cancelledCount / totalBookings) * 100), color: 'bg-red-500' },
  ];

  const processedActivities = realtimeActivities.map((b: Booking) => {
    const status = String(b.status).toLowerCase();
    const isCompleted = status === 'completed';
    const isCancelled = status === 'cancelled';
    
    return {
      title: `Appointment ${b.status}` as string,
      description: `${b.userDetails?.name || 'A customer'} for ${b.startTime || 'the session'}` as string,
      time: new Date(b.date).toLocaleDateString() as string,
      icon: (isCompleted ? 'check' : isCancelled ? 'x' : 'calendar') as 'check' | 'x' | 'calendar',
      bgColor: (isCompleted ? 'bg-green-100' : isCancelled ? 'bg-red-100' : 'bg-blue-100') as string
    };
  });

  interface ActivityItem {
    title: string;
    description: string;
    time: string;
    icon: 'check' | 'x' | 'calendar';
    bgColor: string;
  }

  const finalRecentActivities: ActivityItem[] = processedActivities.length > 0 ? processedActivities : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
          font-family: 'Inter', sans-serif;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, rgb(8, 28, 69) 0%, rgb(30, 64, 175) 100%);
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .fade-in {
          animation: fadeIn 0.6s ease-in-out;
        }
        
        .slide-up {
          animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.320, 1);
        }
        
        .scale-in {
          animation: scaleIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 5px rgba(210, 152, 4, 0.5); }
          50% { box-shadow: 0 0 20px rgba(210, 152, 4, 0.8), 0 0 30px rgba(210, 152, 4, 0.6); }
        }
        
        .btn-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .btn-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(8, 28, 69, 0.3);
        }
        
        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .status-pending {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }
        
        .status-completed {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .status-cancelled {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        .status-approved {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        
        .nav-item {
          transition: all 0.3s ease;
        }
        
        .nav-item:hover {
          background: rgba(210, 152, 4, 0.1);
          border-left: 4px solid rgb(210, 152, 4);
        }
        
        .nav-item.active {
          background: rgba(210, 152, 4, 0.2);
          border-left: 4px solid rgb(210, 152, 4);
        }
        
        .progress-bar {
          background: linear-gradient(90deg, rgb(210, 152, 4), rgb(255, 193, 7));
        }
        
        .chart-container {
          position: relative;
          height: 300px;
        }
        
        @media (max-width: 768px) {
          .chart-container {
            height: 250px;
          }
        }
        
        .bg-gold {
          background-color: rgb(210, 152, 4);
        }
        
        .text-gold {
          color: rgb(210, 152, 4);
        }
        
        .border-gold {
          border-color: rgb(210, 152, 4);
        }
      `}</style>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Using your existing component */}
        <Sidebar 
          onNavigate={handleNavigation}
          activeSection={activeSection}
          userInfo={userInfo}
        />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-4">
                <button 
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                </button>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
                    {activeSection === 'overview' && 'Dashboard Overview'}
                    {activeSection === 'Slots' && 'Slot Management'}
                    {activeSection === 'bookings' && 'Bookings'}
                    {activeSection === 'profile' && 'Company Profile'}
                    {activeSection === 'subscription' && 'Subscription'}
                    {activeSection === 'wallet' && 'Wallet'}
                    {activeSection === 'reviews' && 'Reviews'}
                    {activeSection === 'messages' && 'Messages'}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600">Welcome back, {userInfo.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4">
                {userInfo.isSubscribed ? (
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-green-100 px-2 sm:px-3 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full pulse-glow"></div>
                    <span className="text-xs sm:text-sm font-medium text-green-700">Premium Partner</span>
                  </div>
                ) : (
                  <div 
                    className="flex items-center space-x-1 sm:space-x-2 bg-gray-100 px-2 sm:px-3 py-1 rounded-full cursor-pointer hover:bg-gray-200 transition-colors"
                    onClick={() => setActiveSection('subscription')}
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">Basic Plan</span>
                  </div>
                )}
                
                <NotificationBell 
                   currentUser={{ id: userInfo.id, role: 'company' }} 
                   scrolled={true} 
                />

                <div 
                   className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                   onClick={() => setActiveSection('profile')}
                 >
                   {userInfo.logo ? (
                     <Image 
                       src={resolveImageUrl(userInfo.logo) || ""} 
                       alt="Logo" 
                       width={40} 
                       height={40} 
                       className="w-full h-full object-cover"
                       unoptimized
                     />
                   ) : (
                     <span className="text-white font-semibold text-sm sm:text-base">{userInfo.initials}</span>
                   )}
                 </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-3 sm:p-4 md:p-6">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="fade-in">
                <div className="mb-4 sm:mb-6 md:mb-8">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Overview</h2>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">Your business performance at a glance</p>
                </div>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
                  {stats.map((item, index) => (
                    <div key={index} className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg card-hover fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                          <svg className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {item.icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>}
                            {item.icon === 'currency' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>}
                            {item.icon === 'star' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>}
                            {item.icon === 'building' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>}
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm text-green-600 font-medium">{item.change}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">{item.value}</h3>
                      <p className="text-xs sm:text-sm text-gray-600">{item.title}</p>
                    </div>
                  ))}
                </div>
                
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg slide-up">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Earnings Overview</h3>
                    <div className="h-48 sm:h-64 md:h-72">
                      <Bar data={earningsData} options={chartOptions} />
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg slide-up">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Booking Status</h3>
                    <div className="h-48 sm:h-64 md:h-72">
                      <Doughnut data={bookingStatusData} options={doughnutOptions} />
                    </div>
                  </div>
                </div>
                
                {/* Project Status & Recent Activities */}
                {/* Project Status & Recent Activities */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Project Status */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg scale-in">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-4">Booking Distributions</h3>
                    <div className="space-y-4">
                      {dynamicProjectStatus.map((project, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-xs sm:text-sm mb-1">
                            <span className="text-gray-600">{project.name}</span>
                            <span className="font-medium">{project.percentage}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`${project.color} h-2 rounded-full transition-all duration-500`}
                              style={{ width: `${project.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Activities */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg scale-in">
                    <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-4">Recent Activities</h3>
                    <div className="space-y-3 sm:space-y-4">
                      {finalRecentActivities.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {activity.icon === 'check' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>}
                                {activity.icon === 'x' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>}
                                {activity.icon === 'calendar' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>}
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-xs sm:text-sm">{activity.title}</p>
                              <p className="text-xs text-gray-600">{activity.description}</p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      ))}
                      {finalRecentActivities.length === 0 && (
                        <div className="text-center py-8 text-gray-500 text-sm italic">No recent activities available</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Stats Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mt-6">
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg scale-in">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800">Cancellation Rate</h4>
                      <span className="text-xl sm:text-2xl">📊</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${cancellationRate}%` }}></div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-600">{cancellationRate}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{cancelledCount} cancelled out of {totalBookings} bookings</p>
                  </div>
                  
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg scale-in">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800">Refund Status</h4>
                      <span className="text-xl sm:text-2xl">💰</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Total Escrow</span>
                        <span className="font-medium text-green-600">₹{(walletInfo?.balance || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Recent Payouts</span>
                        <span className="font-medium text-yellow-600">₹{(dashboardStats?.monthlyEarnings || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg scale-in">
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <h4 className="text-sm sm:text-base font-semibold text-gray-800">This Month</h4>
                      <span className="text-xl sm:text-2xl">📈</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">New Bookings</span>
                        <span className="font-medium text-blue-600">{totalBookings}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-600">Revenue</span>
                        <span className="font-medium text-green-600">₹{(dashboardStats?.monthlyEarnings || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Sections */}
            {activeSection === 'Slots' && (
              <div className="fade-in">
                <SlotManagement />
              </div>
            )}

            {activeSection === 'bookings' && (
              <div className="fade-in">
                <CompanyBookings />
              </div>
            )}

            {activeSection === 'profile' && (
              <div className="fade-in">
                <CompanyProfilePage />
              </div>
            )}

            {activeSection === 'subscription' && (
              <div className="fade-in">
                <CompanySubscriptionPage />
              </div>
            )}

            {activeSection === 'wallet' && (
              <div className="fade-in">
                <CompanyWalletPage />
              </div>
            )}

            {activeSection === 'reviews' && (
              <div className="fade-in">
                <CompanyReviewsPage />
              </div>
            )}

            {activeSection === 'messages' && (
              <div className="fade-in">
                <CompanyMessagesPage />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
// app/admin/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  ClockIcon,
  ChartBarIcon,
  StarIcon,
  CheckCircleIcon,
  ArrowUpIcon
} from '@heroicons/react/24/outline';
import { FaChartLine, FaCrown, FaUserPlus, FaBuilding, FaCalendar, FaStar } from 'react-icons/fa';
import Image from 'next/image';
import { getDashboardStats } from '@/services/AdminService';

interface UserGrowth {
  users: { month: string; count: number }[];
  companies: { month: string; count: number }[];
}

interface RevenueBreakdown {
  label: string;
  value: number;
}

interface DashboardActivity {
  icon: string;
  title: string;
  description: string;
  time: string;
}

interface DashboardData {
  totalUsers: number;
  totalCompanies: number;
  totalBookings: number;
  pendingVerifications: number;
  grossRevenue: number;
  netRevenue: number;
  activeSubscriptions: {
    users: number;
    companies: number;
  };
  userGrowth: UserGrowth;
  revenueBreakdown: RevenueBreakdown[];
  recentActivities: DashboardActivity[];
}

export default function AdminDashboard() {
  const userGrowthChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartRef = useRef<HTMLCanvasElement>(null);
  const chartInstances = useRef<{ userGrowth?: Chart; revenue?: Chart }>({});
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsData = await getDashboardStats();
      setData(statsData);
      setError(null);
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Error fetching dashboard stats:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!data) return;

    const currentCharts = chartInstances.current;

    // Initialize/Update User Growth Chart
    if (userGrowthChartRef.current) {
      if (currentCharts.userGrowth) {
        currentCharts.userGrowth.destroy();
      }
      
      const ctx = userGrowthChartRef.current.getContext('2d');
      if (ctx) {
        currentCharts.userGrowth = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.userGrowth.users.map((g) => g.month),
            datasets: [
              {
                label: 'Users',
                data: data.userGrowth.users.map((g) => g.count),
                borderColor: 'rgb(30,64,175)',
                backgroundColor: 'rgba(30,64,175,0.1)',
                tension: 0.4,
                fill: true
              },
              {
                label: 'Companies',
                data: data.userGrowth.companies.map((g) => g.count),
                borderColor: 'rgb(210,152,4)',
                backgroundColor: 'rgba(210,152,4,0.1)',
                tension: 0.4,
                fill: true
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'top' } },
            scales: { y: { beginAtZero: true } }
          }
        });
      }
    }

    // Initialize/Update Revenue Chart
    if (revenueChartRef.current) {
      if (currentCharts.revenue) {
        currentCharts.revenue.destroy();
      }

      const ctx = revenueChartRef.current.getContext('2d');
      if (ctx) {
        currentCharts.revenue = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: data.revenueBreakdown.map((r) => r.label),
            datasets: [{
              data: data.revenueBreakdown.map((r) => r.value),
              backgroundColor: [
                'rgb(30,64,175)',
                'rgb(210,152,4)',
                'rgb(34,197,94)',
                'rgb(168,85,247)'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { position: 'bottom' } }
          }
        });
      }
    }

    return () => {
      if (currentCharts.userGrowth) currentCharts.userGrowth.destroy();
      if (currentCharts.revenue) currentCharts.revenue.destroy();
    };
  }, [data]);

  // Auto-refresh logic (Move UP to avoid conditional hook errors)
  useEffect(() => {
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Map icons for activities
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FaUserPlus': return FaUserPlus;
      case 'FaBuilding': return FaBuilding;
      case 'FaCalendar': return FaCalendar;
      default: return FaStar;
    }
  };

  const getBgColor = (iconName: string) => {
    switch (iconName) {
      case 'FaUserPlus': return 'bg-green-100';
      case 'FaBuilding': return 'bg-blue-100';
      case 'FaCalendar': return 'bg-yellow-100';
      default: return 'bg-purple-100';
    }
  };

  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case 'FaUserPlus': return 'text-green-600';
      case 'FaBuilding': return 'text-blue-600';
      case 'FaCalendar': return 'text-yellow-600';
      default: return 'text-purple-600';
    }
  };

  // Auto-refresh logic (Move UP to avoid conditional hook errors)
  useEffect(() => {
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchData}
            className="px-6 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-colors"
            suppressHydrationWarning={true}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Pre-process display data
  const stats = data ? [
    {
      title: 'Total Users (Homeowners)',
      value: data.totalUsers.toLocaleString(),
      change: 'Lifetime',
      icon: UsersIcon,
      bgColor: 'custom-gradient',
      image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
      imageAlt: 'Homeowners'
    },
    {
      title: 'Total Companies (Builders)',
      value: data.totalCompanies.toLocaleString(),
      change: 'Lifetime',
      icon: BuildingOfficeIcon,
      bgColor: 'custom-gradient',
      image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg',
      imageAlt: 'Construction companies'
    },
    {
      title: 'Total Bookings (Slots)',
      value: data.totalBookings.toLocaleString(),
      change: 'Lifetime',
      icon: CalendarIcon,
      bgColor: 'custom-gradient',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg',
      imageAlt: 'Bookings'
    },
    {
      title: 'Pending Verifications',
      value: data.pendingVerifications.toLocaleString(),
      change: 'Urgent',
      icon: ClockIcon,
      bgColor: 'bg-yellow-500',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg',
      imageAlt: 'Pending verifications',
      urgent: true
    }
  ] : [];

  const activities = data ? data.recentActivities.map((act) => ({
    icon: getIcon(act.icon),
    bgColor: getBgColor(act.icon),
    iconColor: getIconColor(act.icon),
    title: act.title,
    description: act.description,
    time: act.time
  })) : [];

  const quickActions = [
    {
      title: 'Review Verifications',
      description: `${data?.pendingVerifications || 0} pending approvals`,
      icon: CheckCircleIcon,
      bgColor: 'custom-gradient',
      textColor: 'text-white',
      descriptionColor: 'text-blue-100'
    },
    {
      title: 'Feature Companies',
      description: 'Manage featured listings',
      icon: StarIcon,
      bgColor: 'gold-bg',
      textColor: 'text-white',
      descriptionColor: 'text-yellow-100'
    },
    {
      title: 'Manage Users',
      description: 'User administration',
      icon: UsersIcon,
      bgColor: 'bg-gray-800',
      textColor: 'text-white',
      descriptionColor: 'text-gray-300',
      hover: 'hover:bg-gray-700'
    },
    {
      title: 'View Reports',
      description: 'Detailed analytics',
      icon: ChartBarIcon,
      bgColor: 'bg-green-500',
      textColor: 'text-white',
      descriptionColor: 'text-green-100',
      hover: 'hover:bg-green-600'
    }
  ];


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8 fade-in">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="w-full lg:w-auto">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-2 sm:mb-4">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-base sm:text-lg">
                Comprehensive overview of platform performance and key metrics
              </p>
            </div>
            <div className="w-full lg:w-auto flex justify-start lg:justify-end">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32">
                <Image
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                  alt="Dashboard analytics"
                  fill
                  className="object-cover rounded-xl shadow-lg"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Key Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12 fade-in">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-card rounded-xl sm:rounded-2xl p-4 sm:p-6 custom-shadow custom-hover"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                  stat.urgent 
                    ? 'text-yellow-600 bg-yellow-100' 
                    : 'text-green-500 bg-green-100'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">{stat.value}</h3>
              <p className="text-gray-600 text-xs sm:text-sm">{stat.title}</p>
              <div className="mt-3 sm:mt-4 relative w-full h-16 sm:h-20">
                <Image
                  src={stat.image}
                  alt={stat.imageAlt}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 fade-in">
          {/* Revenue Overview */}
          <div className="revenue-card rounded-xl sm:rounded-2xl p-6 sm:p-8 custom-shadow text-white">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Revenue Overview</h2>
                <p className="text-blue-100 text-sm sm:text-base">Monthly performance metrics</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <FaChartLine className="text-xl sm:text-2xl" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">₹{(data?.grossRevenue || 0).toLocaleString()}</h3>
                <p className="text-blue-100 text-xs sm:text-sm">Gross Volume</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 mr-1" />
                  <span className="text-green-300 text-xs sm:text-sm">Verified</span>
                </div>
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">₹{(data?.netRevenue || 0).toLocaleString()}</h3>
                <p className="text-blue-100 text-xs sm:text-sm">Platform Earnings</p>
                <div className="flex items-center mt-1 sm:mt-2">
                  <ArrowUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-300 mr-1" />
                  <span className="text-green-300 text-xs sm:text-sm">Net Commission</span>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 relative w-full h-24 sm:h-32">
              <Image
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg"
                alt="Revenue growth"
                fill
                className="object-cover rounded-lg opacity-80"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Active Subscriptions */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 custom-shadow">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Active Subscriptions</h2>
                <p className="text-gray-600 text-sm sm:text-base">Current subscription status</p>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 gold-bg rounded-xl flex items-center justify-center">
                <FaCrown className="text-white text-xl sm:text-2xl" />
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* User Subscriptions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 custom-gradient rounded-lg flex items-center justify-center flex-shrink-0">
                    <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">User Subscriptions</h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">Premium homeowner plans</p>
                  </div>
                </div>
                <div className="text-left sm:text-right ml-13 sm:ml-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{data?.activeSubscriptions?.users || 0}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Total active</p>
                </div>
              </div>

              {/* Company Subscriptions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 gold-bg rounded-lg flex items-center justify-center flex-shrink-0">
                    <BuildingOfficeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">Company Subscriptions</h4>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">Builder premium plans</p>
                  </div>
                </div>
                <div className="text-left sm:text-right ml-13 sm:ml-0">
                  <p className="text-xl sm:text-2xl font-bold text-gray-800">{data?.activeSubscriptions?.companies || 0}</p>
                  <p className="text-xs sm:text-sm text-gray-400">Total active</p>
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 relative w-full h-24 sm:h-32">
              <Image
                src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg"
                alt="Premium subscriptions"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 fade-in">
          {/* User Growth Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 custom-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">User Growth</h2>
                <p className="text-gray-600 text-sm sm:text-base">Monthly user acquisition trends</p>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-xs sm:text-sm custom-gradient text-white rounded-lg" suppressHydrationWarning={true}>6M</button>
                <button className="px-3 py-1 text-xs sm:text-sm text-gray-600 bg-gray-100 rounded-lg" suppressHydrationWarning={true}>1Y</button>
              </div>
            </div>
            <div className="relative h-64 sm:h-72 lg:h-80">
              <canvas ref={userGrowthChartRef}></canvas>
            </div>
          </div>

          {/* Revenue Breakdown Chart */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 custom-shadow">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Revenue Breakdown</h2>
                <p className="text-gray-600 text-sm sm:text-base">Revenue sources distribution</p>
              </div>
              <div className="w-3 h-3 sm:w-4 sm:h-4 gold-bg rounded-full pulse-animation"></div>
            </div>
            <div className="relative h-64 sm:h-72 lg:h-80">
              <canvas ref={revenueChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 fade-in">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 custom-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Recent Activity</h2>
                <p className="text-gray-600 text-sm sm:text-base">Latest platform activities</p>
              </div>
              <button className="custom-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity w-full sm:w-auto" suppressHydrationWarning={true}>
                View All
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {activities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl custom-hover"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${activity.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className={`${activity.iconColor} text-sm sm:text-base`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{activity.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 custom-shadow">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">Quick Actions</h2>
              <p className="text-gray-600 text-sm sm:text-base">Common administrative tasks</p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    className={`w-full ${action.bgColor} ${action.textColor} p-3 sm:p-4 rounded-xl font-medium transition-all duration-200 text-left group ${
                      action.hover || 'hover:opacity-90'
                    }`}
                    suppressHydrationWarning={true}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm sm:text-base truncate">{action.title}</p>
                        <p className={`${action.descriptionColor} text-xs sm:text-sm truncate`}>
                          {action.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 sm:mt-6 relative w-full h-24 sm:h-28 lg:h-32">
              <Image
                src="https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg"
                alt="Admin actions"
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-gradient {
          background: linear-gradient(135deg, rgb(8,28,69) 0%, rgb(30,64,175) 100%);
        }
        .gold-color {
          color: rgb(210,152,4);
        }
        .gold-bg {
          background-color: rgb(210,152,4);
        }
        .gold-border {
          border-color: rgb(210,152,4);
        }
        .custom-shadow {
          box-shadow: 0 10px 30px rgba(8,28,69,0.1);
        }
        .custom-hover {
          transition: all 0.3s ease;
        }
        .custom-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(8,28,69,0.15);
        }
        .fade-in {
          animation: fadeIn 0.6s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%);
          backdrop-filter: blur(10px);
        }
        .revenue-card {
          background: linear-gradient(135deg, rgb(8,28,69) 0%, rgb(30,64,175) 100%);
        }
        .gold-card {
          background: linear-gradient(135deg, rgb(210,152,4) 0%, rgb(255,193,7) 100%);
        }
      `}</style>
    </div>
  );
}
"use client";

import React, { useEffect, useRef, MouseEvent, useState } from 'react';
import { Chart, registerables } from 'chart.js';
import Sidebar from '@/components/company/SideBarLayout';
import SlotManagement from '../SlotManagment/page';
import CompanyBookings from '../Bookings/page';
import CompanyProfilePage from '../CompanyProfile/page';
import { useRouter } from 'next/navigation';

// Register Chart.js components
Chart.register(...registerables);

const CompanyDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [userInfo, setUserInfo] = useState({ name: 'Loading...', type: 'Company Account', initials: '?' });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserInfo({
        name: user.name || 'Company Name',
        type: 'Company Account',
        initials: (user.name || 'C').charAt(0).toUpperCase()
      });
    } else {
      router.push('/Login');
    }
  }, [router]);
  
  const revenueChartRef = useRef<HTMLCanvasElement>(null);
  const departmentChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartInstance = useRef<Chart | null>(null);
  const departmentChartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Initialize charts
    initializeCharts();

    // Cleanup function
    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
      if (departmentChartInstance.current) {
        departmentChartInstance.current.destroy();
      }
    };
  }, []);

  const initializeCharts = () => {
    // Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      if (ctx) {
        revenueChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
              label: 'Revenue (₹ Millions)',
              data: [1.8, 2.2, 2.8, 3.4],
              borderColor: 'rgb(210, 152, 4)',
              backgroundColor: 'rgba(210, 152, 4, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: false,
                ticks: {
                  callback: function(value) {
                    return '₹' + value + 'M';
                  }
                }
              }
            }
          }
        });
      }
    }

    // Department Chart
    if (departmentChartRef.current) {
      const ctx = departmentChartRef.current.getContext('2d');
      if (ctx) {
        departmentChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Development', 'Sales', 'Marketing', 'Operations', 'Support', 'Management'],
            datasets: [{
              data: [12, 8, 6, 10, 8, 4],
              backgroundColor: [
                'rgb(59, 130, 246)',
                'rgb(16, 185, 129)',
                'rgb(245, 158, 11)',
                'rgb(139, 92, 246)',
                'rgb(239, 68, 68)',
                'rgb(99, 102, 241)'
              ],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom' as const,
                labels: {
                  padding: 20,
                  usePointStyle: true
                }
              }
            }
          }
        });
      }
    }
  };

  const handleNavigation = (section: string) => {
    setActiveSection(section);
    // You can add additional logic here for navigation
    console.log(`Navigated to: ${section}`);
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹8.2M',
      description: 'Year to date',
      trend: '+24%',
      icon: (
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
        </svg>
      ),
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Projects',
      value: '24',
      description: 'Across 8 cities',
      trend: '+15%',
      icon: (
        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
        </svg>
      ),
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Team Members',
      value: '48',
      description: '6 departments',
      trend: '+8%',
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.197a6 6 0 00-6-6M3 21v-1a6 6 0 016-6"></path>
        </svg>
      ),
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Client Satisfaction',
      value: '94%',
      description: 'Based on 320 reviews',
      trend: '4.9/5',
      icon: (
        <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      bgColor: 'bg-yellow-100'
    }
  ];

  const projectStatus = [
    { name: 'Commercial', percentage: 85, color: 'bg-blue-500' },
    { name: 'Residential', percentage: 72, color: 'bg-green-500' },
    { name: 'Industrial', percentage: 63, color: 'bg-yellow-500' },
    { name: 'Retail', percentage: 91, color: 'bg-purple-500' }
  ];

  const recentActivities = [
    {
      title: 'New project signed',
      description: 'Commercial complex in Mumbai',
      time: '2 hours ago',
      icon: (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
        </svg>
      ),
      bgColor: 'bg-green-100'
    },
    {
      title: 'New team members joined',
      description: '3 senior architects added',
      time: '1 day ago',
      icon: (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 1.197a6 6 0 00-6-6M3 21v-1a6 6 0 016-6"></path>
        </svg>
      ),
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Client review received',
      description: '5-star rating from TechCorp Ltd.',
      time: '2 days ago',
      icon: (
        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
        </svg>
      ),
      bgColor: 'bg-yellow-100'
    }
  ];

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    // Add scale animation on card click
    const card = e.currentTarget;
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  };

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
          0%, 100% { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
          50% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6); }
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
        
        .stat-trend-up {
          color: rgb(34, 197, 94);
        }
      `}</style>

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar - Now using the reusable component */}
        <Sidebar 
          onNavigate={handleNavigation}
          activeSection={activeSection}
          userInfo={userInfo}
        />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Dashboard Header */}
          <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Company Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {userInfo.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 bg-green-100 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
                  <span className="text-sm font-medium text-green-700">Premium Partner</span>
                </div>
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">EP</span>
                </div>
              </div>
            </div>
          </header>
          
          {/* Dashboard Content */}
          <main className="p-6">
            {activeSection === 'overview' && (
              <div className="fade-in">
                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      onClick={handleCardClick}
                      className="bg-white rounded-2xl p-6 shadow-lg card-hover cursor-pointer transition-all duration-300 hover:-translate-y-1"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                          {stat.icon}
                        </div>
                        <span className="text-sm stat-trend-up font-medium">{stat.trend}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                      <p className="text-gray-600 text-sm">{stat.title}</p>
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-sm text-gray-500">{stat.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Revenue Chart */}
                <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Revenue Growth</h3>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-gradient-primary text-white rounded-lg">
                        Quarterly
                      </button>
                      <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                        Yearly
                      </button>
                    </div>
                  </div>
                  <div className="chart-container">
                    <canvas ref={revenueChartRef} id="revenueChart"></canvas>
                  </div>
                </div>
                
                {/* Project Status & Department Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Project Status */}
                  <div className="bg-white rounded-2xl p-6 shadow-lg scale-in">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Project Status</h3>
                    <div className="space-y-4">
                      {projectStatus.map((project, index) => (
                        <div key={index}>
                          <div className="flex justify-between text-sm mb-1">
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
                  
                  {/* Department Performance */}
                  <div 
                    className="bg-white rounded-2xl p-6 shadow-lg scale-in"
                    style={{ animationDelay: '0.1s' }}
                  >
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Department Performance</h3>
                    <div className="chart-container">
                      <canvas ref={departmentChartRef} id="departmentChart"></canvas>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activities */}
                <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h3>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-4">
                          <div className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}>
                            {activity.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

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

            {activeSection !== 'overview' && activeSection !== 'Slots' && activeSection !== 'bookings' && activeSection !== 'profile' && (
              <div className="flex items-center justify-center h-64 bg-white rounded-2xl shadow-lg fade-in">
                <p className="text-gray-400 text-lg">Section &quot;{activeSection}&quot; is under construction.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
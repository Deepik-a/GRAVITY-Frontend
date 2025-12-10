'use client';

import React, { useState } from 'react';


const AdminDashboard: React.FC = () => {
  const [activeItem, setActiveItem] = useState('Overview');

  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const refreshData = () => {
    console.log('Refreshing dashboard data...');
    // This would typically call an API endpoint to refresh data
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8 fade-in">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600 text-lg">Comprehensive overview of platform performance and key metrics</p>
              </div>
              <div className="mt-4 lg:mt-0">
                <img 
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" 
                  alt="Dashboard analytics" 
                  className="w-32 h-32 object-cover rounded-xl shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 fade-in">
            {/* Total Users Card */}
            <div className="stat-card rounded-2xl p-6 custom-shadow custom-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 custom-gradient rounded-xl flex items-center justify-center">
                  <i className="fas fa-users text-white text-xl"></i>
                </div>
                <span className="text-green-500 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">+12.5%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">24,847</h3>
              <p className="text-gray-600 text-sm">Total Users (Homeowners)</p>
              <div className="mt-4">
                <img 
                  src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg" 
                  alt="Homeowners" 
                  className="w-full h-20 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Total Companies Card */}
            <div className="stat-card rounded-2xl p-6 custom-shadow custom-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 custom-gradient rounded-xl flex items-center justify-center">
                  <i className="fas fa-building text-white text-xl"></i>
                </div>
                <span className="text-green-500 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">+8.3%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">1,247</h3>
              <p className="text-gray-600 text-sm">Total Companies (Builders)</p>
              <div className="mt-4">
                <img 
                  src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg" 
                  alt="Construction companies" 
                  className="w-full h-20 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Total Bookings Card */}
            <div className="stat-card rounded-2xl p-6 custom-shadow custom-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 custom-gradient rounded-xl flex items-center justify-center">
                  <i className="fas fa-calendar-check text-white text-xl"></i>
                </div>
                <span className="text-green-500 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">+15.7%</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">8,934</h3>
              <p className="text-gray-600 text-sm">Total Bookings (Slots)</p>
              <div className="mt-4">
                <img 
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg" 
                  alt="Bookings" 
                  className="w-full h-20 object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Pending Verifications Card */}
            <div className="stat-card rounded-2xl p-6 custom-shadow custom-hover">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center pulse-animation">
                  <i className="fas fa-clock text-white text-xl"></i>
                </div>
                <span className="text-yellow-600 text-sm font-medium bg-yellow-100 px-2 py-1 rounded-full">Urgent</span>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">47</h3>
              <p className="text-gray-600 text-sm">Pending Verifications</p>
              <div className="mt-4">
                <img 
                  src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg" 
                  alt="Pending verifications" 
                  className="w-full h-20 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Revenue Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 fade-in">
            {/* Revenue Overview */}
            <div className="revenue-card rounded-2xl p-8 custom-shadow text-white">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Revenue Overview</h2>
                  <p className="text-blue-100">Monthly performance metrics</p>
                </div>
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <i className="fas fa-chart-line text-2xl"></i>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-3xl font-bold mb-2">₹2.4M</h3>
                  <p className="text-blue-100 text-sm">Gross Revenue</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-arrow-up text-green-300 mr-1"></i>
                    <span className="text-green-300 text-sm">+18.2%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold mb-2">₹2.1M</h3>
                  <p className="text-blue-100 text-sm">Net Revenue</p>
                  <div className="flex items-center mt-2">
                    <i className="fas fa-arrow-up text-green-300 mr-1"></i>
                    <span className="text-green-300 text-sm">+16.5%</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <img 
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg" 
                  alt="Revenue growth" 
                  className="w-full h-32 object-cover rounded-lg opacity-80"
                />
              </div>
            </div>

            {/* Active Subscriptions */}
            <div className="bg-white rounded-2xl p-8 custom-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Active Subscriptions</h2>
                  <p className="text-gray-600">Current subscription status</p>
                </div>
                <div className="w-16 h-16 gold-bg rounded-xl flex items-center justify-center">
                  <i className="fas fa-crown text-white text-2xl"></i>
                </div>
              </div>

              <div className="space-y-6">
                {/* User Subscriptions */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 custom-gradient rounded-lg flex items-center justify-center">
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">User Subscriptions</h4>
                      <p className="text-sm text-gray-500">Premium homeowner plans</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">3,247</p>
                    <p className="text-sm text-green-600">+5.2%</p>
                  </div>
                </div>

                {/* Company Subscriptions */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 gold-bg rounded-lg flex items-center justify-center">
                      <i className="fas fa-building text-white"></i>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Company Subscriptions</h4>
                      <p className="text-sm text-gray-500">Builder premium plans</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">892</p>
                    <p className="text-sm text-green-600">+12.8%</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <img 
                  src="https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg" 
                  alt="Premium subscriptions" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Analytics Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 fade-in">
            {/* User Growth Chart */}
            <div className="bg-white rounded-2xl p-8 custom-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">User Growth</h2>
                  <p className="text-gray-600">Monthly user acquisition trends</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm custom-gradient text-white rounded-lg">6M</button>
                  <button className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg">1Y</button>
                </div>
              </div>
              <div className="chart-container">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="User growth chart"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>

            {/* Revenue Breakdown Chart */}
            <div className="bg-white rounded-2xl p-8 custom-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Revenue Breakdown</h2>
                  <p className="text-gray-600">Revenue sources distribution</p>
                </div>
                <div className="w-4 h-4 gold-bg rounded-full pulse-animation"></div>
              </div>
              <div className="chart-container">
                <img 
                  src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                  alt="Revenue breakdown chart"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Recent Activity & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-8 custom-shadow">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Recent Activity</h2>
                  <p className="text-gray-600">Latest platform activities</p>
                </div>
                <button className="custom-gradient text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {/* Activity Item 1 */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl custom-hover">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-user-plus text-green-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">New User Registration</h4>
                    <p className="text-sm text-gray-500">Rajesh Kumar joined as a homeowner</p>
                  </div>
                  <span className="text-xs text-gray-400">2 min ago</span>
                </div>

                {/* Activity Item 2 */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl custom-hover">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-building text-blue-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Company Verification</h4>
                    <p className="text-sm text-gray-500">Skyline Builders submitted documents</p>
                  </div>
                  <span className="text-xs text-gray-400">15 min ago</span>
                </div>

                {/* Activity Item 3 */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl custom-hover">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-calendar text-yellow-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">New Booking</h4>
                    <p className="text-sm text-gray-500">Site visit scheduled for tomorrow</p>
                  </div>
                  <span className="text-xs text-gray-400">1 hour ago</span>
                </div>

                {/* Activity Item 4 */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl custom-hover">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-crown text-purple-600"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">Premium Subscription</h4>
                    <p className="text-sm text-gray-500">Metro Constructions upgraded to premium</p>
                  </div>
                  <span className="text-xs text-gray-400">3 hours ago</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-8 custom-shadow">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Quick Actions</h2>
                <p className="text-gray-600">Common administrative tasks</p>
              </div>

              <div className="space-y-4">
                <button 
                  className="w-full custom-gradient text-white p-4 rounded-xl font-medium hover:opacity-90 transition-opacity text-left"
                  onClick={refreshData}
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-check-circle text-xl"></i>
                    <div>
                      <p className="font-semibold">Review Verifications</p>
                      <p className="text-sm text-blue-100">47 pending approvals</p>
                    </div>
                  </div>
                </button>

                <button className="w-full gold-bg text-white p-4 rounded-xl font-medium hover:opacity-90 transition-opacity text-left">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-star text-xl"></i>
                    <div>
                      <p className="font-semibold">Feature Companies</p>
                      <p className="text-sm text-yellow-100">Manage featured listings</p>
                    </div>
                  </div>
                </button>

                <button className="w-full bg-gray-800 text-white p-4 rounded-xl font-medium hover:bg-gray-700 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-users text-xl"></i>
                    <div>
                      <p className="font-semibold">Manage Users</p>
                      <p className="text-sm text-gray-300">User administration</p>
                    </div>
                  </div>
                </button>

                <button className="w-full bg-green-500 text-white p-4 rounded-xl font-medium hover:bg-green-600 transition-colors text-left">
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-chart-bar text-xl"></i>
                    <div>
                      <p className="font-semibold">View Reports</p>
                      <p className="text-sm text-green-100">Detailed analytics</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6">
                <img 
                  src="https://images.pexels.com/photos/3184394/pexels-photo-3184394.jpeg" 
                  alt="Admin actions" 
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
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
        .chart-container {
          position: relative;
          height: 300px;
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
};

export default AdminDashboard;
'use client';

import React, { useState } from 'react'; // Added useState
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

interface SidebarProps {
  onItemClick?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onItemClick }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // State for mobile menu

  const menuItems = [
    { name: 'Overview', icon: 'fas fa-chart-line', route: '/Admin/AdminDashBoard' },
    { name: 'User Management', icon: 'fas fa-users', route: '/Admin/UserManagment' },
    { name: 'Companies', icon: 'fas fa-building', route: '/Admin/CompanyManagment' },
    { name: 'Bookings', icon: 'fas fa-calendar-check', route: '/Admin/Bookings' },
    { name: 'Revenue', icon: 'fas fa-money-bill-wave', route: '/Admin/Revenue' },
    { name: 'Verifications', icon: 'fas fa-id-card', route: '/Admin/Verifications' },
    { name: 'Settings', icon: 'fas fa-cog', route: '/Admin/Settings' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* --- 1. Mobile Toggle Button --- */}
      <button 
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#1E40AF] text-white rounded-lg shadow-lg focus:outline-none"
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
      </button>

      {/* --- 2. Mobile Overlay (Blur effect when open) --- */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden" 
          onClick={toggleSidebar}
        ></div>
      )}

      {/* --- 3. The Sidebar --- */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col h-screen
      `}>
        <div className="p-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent">
            <i className="fas fa-crown text-[#D29804] mr-2"></i>Admin Dashboard
          </h1>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.route;
              return (
                <li
                  key={item.name}
                  className={`navigation-item px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'active text-[#1E40AF] bg-gradient-to-r from-[#081C45]/20 to-[#1E40AF]/20 border-l-4 border-[#1E40AF]'
                      : 'text-gray-800 hover:bg-[#081C45]/10'
                  }`}
                  onClick={() => {
                    onItemClick?.(item.name);
                    router.push(item.route);
                    setIsOpen(false); // Close sidebar on mobile after clicking
                  }}
                >
                  <i className={`${item.icon} mr-3 w-5`}></i>
                  {item.name}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center px-4 py-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <Image src="/assets/AlternativeSignUpImage.jpg" alt="Admin" width={40} height={40} />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="font-medium text-gray-800 truncate">Alex Morgan</p>
              <p className="text-sm text-gray-600">Administrator</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
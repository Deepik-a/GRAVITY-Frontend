'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'User Management', onItemClick }) => {
  const router = useRouter();

  const menuItems = [
    { name: 'Overview', icon: 'fas fa-chart-line', route: '/Admin/AdminDashBoard' },
    { name: 'User Management', icon: 'fas fa-users', route: '/Admin/UserManagment' },
    { name: 'Companies', icon: 'fas fa-building', route: '/Admin/CompanyManagment' },
    { name: 'Bookings', icon: 'fas fa-calendar-check', route: '/Admin/Bookings' },
    { name: 'Revenue', icon: 'fas fa-money-bill-wave', route: '/Admin/Revenue' },
    { name: 'Verifications', icon: 'fas fa-id-card', route: '/Admin/Verifications' },
    { name: 'Settings', icon: 'fas fa-cog', route: '/Admin/Settings' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg hidden md:flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent">
          <i className="fas fa-crown text-[#D29804] mr-2"></i>Admin Dashboard
        </h1>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li
              key={item.name}
              className={`navigation-item px-4 py-3 rounded-lg font-medium cursor-pointer transition-all duration-300 ${
                activeItem === item.name
                  ? 'active text-[#1E40AF] bg-gradient-to-r from-[#081C45]/20 to-[#1E40AF]/20 border-l-4 border-[#1E40AF]'
                  : 'text-gray-800 hover:bg-[#081C45]/10'
              }`}
              onClick={() => {
                onItemClick?.(item.name);
                router.push(item.route); // 🔥 Navigate to route
              }}
            >
              <i className={`${item.icon} mr-3`}></i>
              {item.name}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center px-4 py-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <Image src="/assets/AlternativeSignUpImage.jpg" alt="Admin" width={40} height={40} />
          </div>
          <div className="ml-3">
            <p className="font-medium text-gray-800">Alex Morgan</p>
            <p className="text-sm text-gray-600">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

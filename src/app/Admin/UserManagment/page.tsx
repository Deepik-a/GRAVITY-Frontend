'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getUsers } from '../../../services/AdminService';
import { Profile } from '../../../types/authTypes'; // adjust path as needed


const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [activeTab, setActiveTab] = useState<string>('All Users');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // const tabs = ['All Users', 'Verified', 'Pending', 'Blocked', 'Premium', 'Free Plan'];

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const apiUsers: Profile[] = await getUsers();
        setUsers(apiUsers);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Search filter
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-gray-50">
    

      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
          <button className="p-2 rounded-lg bg-gray-100">
            <i className="fas fa-bars text-[#1E40AF]"></i>
          </button>
          <h1 className="text-lg font-bold bg-gradient-to-r from-[#081C45] to-[#1E40AF] bg-clip-text text-transparent">
            <i className="fas fa-crown text-[#D29804] mr-2"></i>User Management
          </h1>
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <Image
              src="/assets/AlternativeSignUpImage.jpg"
              alt="Admin"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-700">Manage homeowners and their accounts</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent text-gray-900"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-500"></i>
              </div> */}
              {/* <button className="bg-gradient-to-r from-[#081C45] to-[#1E40AF] hover:from-[#1E40AF] hover:to-[#081C45] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl">
                <i className="fas fa-filter mr-2"></i> Filters
              </button> */}
            </div>
          </div>

          {/* Tabs */}
          <div className="overflow-x-auto mb-6">
            {/* <div className="flex space-x-2 min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  className={`tab-button whitespace-nowrap transition-all duration-300 px-3 py-2 rounded-lg font-medium ${
                    activeTab === tab
                      ? 'active bg-gradient-to-r from-[#081C45] to-[#1E40AF] text-white shadow-lg'
                      : 'text-gray-800 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div> */}
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl shadow-md mb-6 md:mb-8 overflow-hidden border border-gray-100">
            {loading ? (
              <p className="p-4 text-center">Loading users...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Name</th>
                      <th className="py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Email</th>
                      <th className="py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Phone</th>
                      <th className="py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Location</th>
                      <th className="py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Bio</th>
                       <th className="py-3 px-4 md:py-4 md:px-6 font-medium text-gray-900 text-sm md:text-base">Avatar</th>
                    </tr>
                  </thead>
<tbody className="divide-y divide-gray-200">
  {filteredUsers.map((user) => (
    <tr key={user.id} className="hover:bg-gray-50">
      <td className="py-3 px-4 md:py-4 md:px-6 text-gray-900">{user.name|| "Not Given"}</td>
      <td className="py-3 px-4 md:py-4 md:px-6 text-gray-900">{user.email || "Not Given"}</td>
      <td className="py-3 px-4 md:py-4 md:px-6 text-gray-900">{user.phone || "Not Given"}</td>
      <td className="py-3 px-4 md:py-4 md:px-6 text-gray-900">{user.location || "Not Given"}</td>
      <td className="py-3 px-4 md:py-4 md:px-6 text-gray-900">{user.bio || "Not Given"}</td>
      <td className="py-3 px-4 md:py-4 md:px-6">
        <Image
          src={user.profileImage || '/assets/AlternativeSignUpImage.jpg'}
          alt={user.name || "User Avatar"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />
      </td>
    </tr>
  ))}

  {filteredUsers.length === 0 && (
    <tr>
      <td colSpan={7} className="text-center py-4 text-gray-500">
        No users found.

      </td>
    </tr>
  )}
</tbody>


                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage;

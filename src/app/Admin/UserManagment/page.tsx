'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { getUsers, toggleUserBlockStatus } from '../../../services/AdminService';
import { Profile } from '../../../types/authTypes';
import DataTable from '../../../app/Admin/DataTable'; 
import { toast } from 'react-toastify';
import { MapPin, Phone } from 'lucide-react'; // Optional: for nice icons

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>(''); // ✅ debounced value
  const [filterStatus, setFilterStatus] = useState<'all' | 'blocked' | 'unblocked'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 7;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const apiUsers: Profile[] = await getUsers();
      setUsers(apiUsers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearch(searchQuery);
  }, 300); // ⏳ DEBOUNCING HAPPENS HERE

  return () => clearTimeout(timer);
}, [searchQuery]);


  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserBlockStatus(userId, !currentStatus);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: !currentStatus } : u));
      toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
    } catch {
      toast.error("Failed to update user status");
    }
  };

const filteredUsers = useMemo(() => {
  return users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearch.toLowerCase());

    const matchesFilter =
      filterStatus === 'all'
        ? true
        : filterStatus === 'blocked'
        ? user.isBlocked
        : !user.isBlocked;

    return matchesSearch && matchesFilter;
  });
}, [users, debouncedSearch, filterStatus]); // ✅ debouncedSearch dependency


  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  // --- UPDATED COLUMNS ---
  const columns = [
    { 
      header: 'User', 
      render: (user: Profile) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border">
            {user.profileImage ? (
              <Image 
                src={user.profileImage} 
                alt={user.name} 
                fill 
                className="object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-900 leading-none">{user.name}</span>
            <span className="text-xs text-gray-500 mt-1">{user.email}</span>
          </div>
        </div>
      )
    },
    { 
      header: 'Bio & Location', 
      render: (user: Profile) => (
        <div className="max-w-[200px]">
          <p className="text-xs text-gray-600 line-clamp-2 italic mb-1">
            {user.bio || 'No bio provided'}
          </p>
          <div className="flex items-center text-xs text-gray-500">
            <MapPin size={12} className="mr-1 text-red-400" />
            {user.location || 'N/A'}
          </div>
        </div>
      )
    },
    { 
      header: 'Contact', 
      render: (user: Profile) => (
        <div className="flex items-center text-sm text-gray-700">
          <Phone size={14} className="mr-2 text-blue-500" />
          {user.phone || '—'}
        </div>
      )
    },
    { 
      header: 'Status', 
      render: (user: Profile) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
          user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {user.isBlocked ? 'Blocked' : 'Active'}
        </span>
      )
    },
    { 
      header: 'Actions', 
      render: (user: Profile) => (
        <div className="flex gap-3">
          <button 
            onClick={() => handleToggleBlock(user.id, !!user.isBlocked)}
            className={`text-sm font-medium hover:underline ${user.isBlocked ? 'text-green-600' : 'text-red-600'}`}
          >
            {user.isBlocked ? 'Unblock' : 'Block'}
          </button>
          {/* <button className="text-sm font-medium text-blue-600 hover:underline">Edit</button> */}
        </div>
      )
    }
  ];

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'blocked' | 'unblocked')}
            >
              <option value="all">All Status</option>
              <option value="blocked">Blocked</option>
              <option value="unblocked">Active</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={currentItems}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
};

export default UserManagementPage;
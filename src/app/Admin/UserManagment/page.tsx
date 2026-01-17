'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { getUsers, toggleUserBlockStatus, searchUsers } from '../../../services/AdminService';
import { Profile } from '../../../types/AuthTypes';
import DataTable from '../../../app/Admin/DataTable';
import { resolveImageUrl } from "@/utils/urlHelper";
import { toast } from 'react-toastify';
import { MapPin, Phone } from 'lucide-react';

const UserManagementPage: React.FC = () => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const itemsPerPage = 7;

  /* ---------------- Refs ---------------- */
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* client-only */
  useEffect(() => {
    setMounted(true);
    // Focus search input on mount
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  /* ---------------- Initial load ---------------- */
const fetchUsers = useCallback(async () => {
  setLoading(true);
  try {
    const users = await getUsers();   // ✅ no args

    setUsers(users);
    setTotalItems(users.length);      // fallback
    setTotalPages(1);                 // no pagination
  } catch {
    toast.error('Failed to load users');
  } finally {
    setLoading(false);
  }
}, []);


  useEffect(() => {
    if (mounted) fetchUsers();
  }, [mounted, fetchUsers]);

  /* ---------------- Debounce ---------------- */
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [searchQuery]);

  /* ---------------- Search API ---------------- */
  useEffect(() => {
    if (!mounted) return;

    const runSearch = async () => {
      setLoading(true);
      try {
        if (!debouncedSearch) {
          await fetchUsers();
          return;
        }

        const res = await searchUsers(
          debouncedSearch,
          currentPage,
          itemsPerPage
        );

        setUsers(res.users);
        setTotalItems(res.total);
        setTotalPages(res.totalPages);
      } catch {
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    };

    runSearch();
  }, [debouncedSearch, currentPage, mounted, fetchUsers]);

  /* ---------------- Block / Unblock ---------------- */
  const handleToggleBlock = async (userId: string, currentStatus: boolean) => {
    try {
      await toggleUserBlockStatus(userId, !currentStatus);
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, isBlocked: !currentStatus } : u
        )
      );
      toast.success(`User ${currentStatus ? 'unblocked' : 'blocked'} successfully`);
    } catch (err: unknown) {
      const message = (err as Error).message || 'Failed to update user status';
      toast.error(message);
    }
  };

  /* ---------------- Columns ---------------- */
  const columns = [
    {
      header: 'User',
      render: (user: Profile) => (
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 border">
            {user.profileImage ? (
              <Image
                src={resolveImageUrl(user.profileImage) || ""}
                alt={user.name}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-bold">
                {user.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Bio & Location',
      render: (user: Profile) => (
        <div className="max-w-[200px]">
          <p className="text-xs text-gray-600 italic line-clamp-2">
            {user.bio || 'No bio provided'}
          </p>
          <div className="flex items-center text-xs text-gray-500 mt-1">
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
        <span className={`px-2 py-1 rounded-full text-xs ${
          user.isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`}>
          {user.isBlocked ? 'Blocked' : 'Active'}
        </span>
      )
    },
    {
      header: 'Actions',
      render: (user: Profile) => (
        <button
          onClick={() => handleToggleBlock(user.id, !!user.isBlocked)}
          className={`text-sm font-medium ${
            user.isBlocked ? 'text-green-600' : 'text-red-600'
          } hover:underline`}
        >
          {user.isBlocked ? 'Unblock' : 'Block'}
        </button>
      )
    }
  ];

  if (!mounted) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border rounded-lg w-64 focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading users...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={users}
            currentPage={currentPage}
            totalPages={totalPages}   // ✅ backend value
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;

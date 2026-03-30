'use client';

import Sidebar from '../../components/admin/SideBarLayout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 overflow-y-auto w-full">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}

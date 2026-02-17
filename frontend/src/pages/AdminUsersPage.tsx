import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import { getUsers, updateUserRole, suspendUser } from '../services/adminService';
import { AdminUserDto, UserFiltersDto } from '../types';

export const AdminUsersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UserFiltersDto>({
    searchTerm: '',
    role: '',
    isActive: undefined,
    page: 1,
    pageSize: 20,
    sortBy: 'CreatedAt',
    sortDescending: true,
  });

  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [editingRoleUserId, setEditingRoleUserId] = useState<string | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  // Queries
  const { data = { items: [], totalCount: 0, page: 1, pageSize: 20 }, isLoading } = useQuery({
    queryKey: ['adminUsers', filters],
    queryFn: () => getUsers(filters),
    placeholderData: (previousData) => previousData,
  });

  // Mutations
  const updateRoleMutation = useMutation({
    mutationFn: (data: { userId: string; role: string }) => updateUserRole(data.userId, data.role),
    onSuccess: () => {
      setSuccessMessage('User role updated successfully');
      setEditingRoleUserId(null);
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to update user role');
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  const suspendMutation = useMutation({
    mutationFn: (data: { userId: string; suspend: boolean; reason?: string }) =>
      suspendUser(data.userId, data.suspend, data.reason),
    onSuccess: () => {
      setSuccessMessage('User status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to update user status');
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value, page: 1 });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, role: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? undefined : e.target.value === 'active';
    setFilters({ ...filters, isActive: value, page: 1 });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortDescending] = e.target.value.split(':');
    setFilters({
      ...filters,
      sortBy,
      sortDescending: sortDescending === 'desc',
      page: 1,
    });
  };

  const handleUpdateRole = (userId: string, role: string) => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleToggleSuspend = (user: AdminUserDto) => {
    suspendMutation.mutate({
      userId: user.id,
      suspend: user.isActive,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-500">Loading users...</div>
      </div>
    );
  }

  const users = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / (filters.pageSize || 20)) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="mt-2 text-gray-600">Manage users, roles, and permissions</p>
      </div>

      {/* Alerts */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600" size={20} />
          <span className="text-green-800">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-800">{errorMessage}</span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <input
              type="text"
              placeholder="Email, first name, last name..."
              value={filters.searchTerm || ''}
              onChange={handleSearch}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <select
              value={filters.role || ''}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.isActive === undefined ? '' : filters.isActive ? 'active' : 'inactive'}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
            <select
              value={`${filters.sortBy || 'CreatedAt'}:${filters.sortDescending ? 'desc' : 'asc'}`}
              onChange={handleSortChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="CreatedAt:desc">Newest First</option>
              <option value="CreatedAt:asc">Oldest First</option>
              <option value="Email:asc">Email (A-Z)</option>
              <option value="Email:desc">Email (Z-A)</option>
              <option value="FirstName:asc">First Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Surveys
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Responses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user: AdminUserDto) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.firstName} {user.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {editingRoleUserId === user.id ? (
                        <div className="flex gap-2">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option value="">Select role</option>
                            <option value="Admin">Admin</option>
                            <option value="User">User</option>
                          </select>
                          <button
                            onClick={() => handleUpdateRole(user.id, newRole)}
                            disabled={updateRoleMutation.isPending}
                            className="px-2 py-1 bg-blue-500 text-white rounded text-sm disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingRoleUserId(null)}
                            className="px-2 py-1 bg-gray-300 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700">
                            {user.role}
                          </span>
                          <button
                            onClick={() => {
                              setEditingRoleUserId(user.id);
                              setNewRole(user.role);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.surveyCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{user.responseCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleToggleSuspend(user)}
                        disabled={suspendMutation.isPending}
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded text-sm ${
                          user.isActive
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } disabled:opacity-50`}
                      >
                        {user.isActive ? (
                          <>
                            <Lock size={14} />
                            Suspend
                          </>
                        ) : (
                          <>
                            <Unlock size={14} />
                            Activate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(filters.page! - 1) * (filters.pageSize || 20) + 1} to{' '}
            {Math.min(filters.page! * (filters.pageSize || 20), data?.totalCount || 0)} of{' '}
            {data?.totalCount || 0} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg ${
                    page === filters.page
                      ? 'bg-blue-500 text-white'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === totalPages}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;

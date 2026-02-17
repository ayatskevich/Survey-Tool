import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { getSurveys, cloneSurvey, bulkArchiveSurveys } from '../services/adminService';
import { SurveyFiltersDto, SurveyItemDto } from '../types';

export const AdminSurveysPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<SurveyFiltersDto>({
    searchTerm: '',
    isActive: undefined,
    isArchived: false,
    page: 1,
    pageSize: 20,
    sortBy: 'CreatedAt',
    sortDescending: true,
  });

  const [selectedSurveys, setSelectedSurveys] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [cloneTitle, setCloneTitle] = useState<string>('');
  const [cloningId, setCloningId] = useState<string | null>(null);

  // Queries
  const { data = { items: [], totalCount: 0, page: 1, pageSize: 20 }, isLoading } = useQuery({
    queryKey: ['adminSurveys', filters],
    queryFn: () => getSurveys(filters),
    placeholderData: (previousData) => previousData,
  });

  // Mutations
  const cloneMutation = useMutation({
    mutationFn: (data: { surveyId: string; newTitle: string }) => cloneSurvey(data.surveyId, data.newTitle),
    onSuccess: () => {
      setSuccessMessage('Survey cloned successfully');
      setCloningId(null);
      setCloneTitle('');
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to clone survey');
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (data: { surveyIds: string[]; archive: boolean }) =>
      bulkArchiveSurveys(data.surveyIds, data.archive),
    onSuccess: () => {
      setSuccessMessage('Surveys updated successfully');
      setSelectedSurveys(new Set());
      queryClient.invalidateQueries({ queryKey: ['adminSurveys'] });
      setTimeout(() => setSuccessMessage(''), 3000);
    },
    onError: (error: any) => {
      setErrorMessage(error.response?.data?.message || 'Failed to update surveys');
      setTimeout(() => setErrorMessage(''), 3000);
    },
  });

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, searchTerm: e.target.value, page: 1 });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === '' ? undefined : e.target.value === 'active';
    setFilters({ ...filters, isActive: value, page: 1 });
  };

  const toggleSurveySelection = (surveyId: string) => {
    const newSelected = new Set(selectedSurveys);
    if (newSelected.has(surveyId)) {
      newSelected.delete(surveyId);
    } else {
      newSelected.add(surveyId);
    }
    setSelectedSurveys(newSelected);
  };

  const handleCloneSurvey = (survey: SurveyItemDto) => {
    if (cloneTitle.trim()) {
      cloneMutation.mutate({ surveyId: survey.id, newTitle: cloneTitle });
    }
  };

  const handleBulkArchive = (archive: boolean) => {
    if (selectedSurveys.size > 0) {
      archiveMutation.mutate({
        surveyIds: Array.from(selectedSurveys),
        archive,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg text-gray-500">Loading surveys...</div>
      </div>
    );
  }

  const surveys = data?.items || [];
  const totalPages = data ? Math.ceil(data.totalCount / (filters.pageSize || 20)) : 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Survey Management</h1>
        <p className="mt-2 text-gray-600">Manage, clone, and archive surveys</p>
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

      {/* Filters & Actions */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Search surveys..."
            value={filters.searchTerm || ''}
            onChange={handleSearch}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={filters.isActive === undefined ? '' : filters.isActive ? 'active' : 'inactive'}
            onChange={handleStatusChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {selectedSurveys.size > 0 && (
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded">
            <span className="text-sm text-blue-900">{selectedSurveys.size} survey(ies) selected</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkArchive(true)}
                disabled={archiveMutation.isPending}
                className="px-3 py-1 bg-orange-500 text-white rounded text-sm disabled:opacity-50"
              >
                Archive
              </button>
              <button
                onClick={() => handleBulkArchive(false)}
                disabled={archiveMutation.isPending}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm disabled:opacity-50"
              >
                Unarchive
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Surveys Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={selectedSurveys.size === surveys.length && surveys.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSurveys(new Set(surveys.map((s: SurveyItemDto) => s.id)));
                      } else {
                        setSelectedSurveys(new Set());
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Responses</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {surveys.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No surveys found
                  </td>
                </tr>
              ) : (
                surveys.map((survey) => (
                  <tr key={survey.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedSurveys.has(survey.id)}
                        onChange={() => toggleSurveySelection(survey.id)}
                        className="rounded"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">{survey.title}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          survey.isArchived
                            ? 'bg-gray-100 text-gray-700'
                            : survey.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {survey.isArchived ? 'Archived' : survey.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{survey.responseCount}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setCloningId(survey.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs"
                      >
                        <Copy size={14} />
                        Clone
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Clone Dialog */}
        {cloningId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">Clone Survey</h3>
              <input
                type="text"
                placeholder="New survey title..."
                value={cloneTitle}
                onChange={(e) => setCloneTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const survey = surveys.find((s: SurveyItemDto) => s.id === cloningId);
                    if (survey && cloneTitle.trim()) {
                      handleCloneSurvey(survey);
                    }
                  }}
                  disabled={cloneMutation.isPending || !cloneTitle.trim()}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
                >
                  Clone
                </button>
                <button
                  onClick={() => {
                    setCloningId(null);
                    setCloneTitle('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {(filters.page! - 1) * (filters.pageSize || 20) + 1} to{' '}
            {Math.min(filters.page! * (filters.pageSize || 20), data?.totalCount || 0)} of{' '}
            {data?.totalCount || 0}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(filters.page! - 1)}
              disabled={filters.page === 1}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            <button
              onClick={() => handlePageChange(filters.page! + 1)}
              disabled={filters.page === totalPages}
              className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
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

export default AdminSurveysPage;

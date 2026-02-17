import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { surveyService } from '../services/surveyService';
import SurveyCard from '../components/surveys/SurveyCard';
import SearchBar from '../components/surveys/SearchBar';
import CreateSurveyModal from '../components/surveys/CreateSurveyModal';
import EmptyState from '../components/surveys/EmptyState';

const SurveyListPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const pageSize = 12;

  const { data, isLoading, error } = useQuery({
    queryKey: ['surveys', page, searchTerm],
    queryFn: () => surveyService.getSurveys(page, pageSize, searchTerm),
  });

  const deleteMutation = useMutation({
    mutationFn: (surveyId: string) => surveyService.deleteSurvey(surveyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (surveyId: string) => surveyService.toggleSurveyStatus(surveyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
    },
  });

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const handleDelete = (surveyId: string) => {
    if (confirm('Are you sure you want to delete this survey?')) {
      deleteMutation.mutate(surveyId);
    }
  };

  const handleToggleStatus = (surveyId: string) => {
    toggleStatusMutation.mutate(surveyId);
  };

  const handleEdit = (surveyId: string) => {
    navigate(`/surveys/${surveyId}/edit`);
  };

  const handleView = (surveyId: string) => {
    navigate(`/surveys/${surveyId}`);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error loading surveys</h2>
          <p className="text-gray-600">{error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Surveys</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Create Survey
        </button>
      </div>

      <SearchBar value={searchTerm} onChange={handleSearch} placeholder="Search surveys..." />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {data.items.map((survey) => (
              <SurveyCard
                key={survey.id}
                survey={survey}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleStatus={handleToggleStatus}
                onView={handleView}
              />
            ))}
          </div>

          {data.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="text-gray-700">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          searchTerm={searchTerm}
          onCreateClick={() => setIsCreateModalOpen(true)}
          onClearSearch={() => setSearchTerm('')}
        />
      )}

      <CreateSurveyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['surveys'] });
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
};

export default SurveyListPage;

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronsUpDown,
  Download,
  Eye,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { responseService } from '@/services/responseService';

type SortField = 'submittedAt' | 'respondentEmail';
type SortOrder = 'asc' | 'desc';

export function ResponseListPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [page, setPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>('submittedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [isExporting, setIsExporting] = useState(false);

  const pageSize = 10;

  if (!surveyId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="mr-2 text-red-500" />
        <span>Survey not found</span>
      </div>
    );
  }

  const {
    data: responsesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['surveyResponses', surveyId, page, pageSize],
    queryFn: () =>
      responseService.getSurveyResponses(surveyId, page, pageSize),
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await responseService.exportResponses(surveyId);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export responses');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedItems = responsesData?.items.sort((a, b) => {
    let aVal: any;
    let bVal: any;

    if (sortField === 'submittedAt') {
      aVal = new Date(a.submittedAt).getTime();
      bVal = new Date(b.submittedAt).getTime();
    } else {
      aVal = (a.respondentEmail || '').toLowerCase();
      bVal = (b.respondentEmail || '').toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Survey Responses</h1>
            <p className="mt-2 text-gray-600">
              {responsesData?.totalCount || 0} responses collected
            </p>
          </div>
          <button
            onClick={handleExport}
            disabled={isExporting || !responsesData?.items.length}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Export CSV
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              Failed to load responses. Please try again.
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : !responsesData?.items.length ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-600">No responses yet</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('respondentEmail')}
                    >
                      <div className="flex items-center gap-2">
                        Respondent Email
                        <ChevronsUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('submittedAt')}
                    >
                      <div className="flex items-center gap-2">
                        Submitted At
                        <ChevronsUpDown className="w-4 h-4" />
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Answers
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedItems?.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {response.respondentEmail || 'Anonymous'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(response.submittedAt).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {response.answerCount} answers
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a
                          href={`/surveys/${surveyId}/responses/${response.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {responsesData && responsesData.totalPages > 1 && (
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Page {page} of {responsesData.totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      setPage(Math.min(responsesData.totalPages, page + 1))
                    }
                    disabled={page === responsesData.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

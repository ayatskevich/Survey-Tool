import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { surveyService } from '@/services/surveyService';
import { QuestionTypeLabels } from '@/types/survey';
import { Eye, Edit, BarChart3, Clock, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

export function SurveyDetailPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();

  const { data: survey, isLoading, error } = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: () => surveyService.getSurveyById(surveyId!),
    enabled: !!surveyId,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Survey not found</h2>
          <p className="text-gray-600 mb-4">The survey you're looking for doesn't exist or has been deleted.</p>
          <button
            onClick={() => navigate('/surveys')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/surveys')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Surveys
          </button>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  survey.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {survey.isActive ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-1" />
                      Inactive
                    </>
                  )}
                </span>
                <span className="text-gray-500 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Created {new Date(survey.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/surveys/${surveyId}/analytics`)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Analytics
              </button>
              <button
                onClick={() => navigate(`/surveys/${surveyId}/edit`)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-5 h-5 mr-2" />
                Edit Survey
              </button>
            </div>
          </div>
        </div>

        {/* Survey Details Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Survey Details</h2>
          
          {survey.description && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Description</h3>
              <p className="text-gray-600">{survey.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Questions</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{survey.questionCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Responses</div>
              <div className="text-2xl font-bold text-gray-900 mt-1">{survey.responseCount}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-500">Status</div>
              <div className="text-lg font-semibold text-gray-900 mt-1">
                {survey.isActive ? 'Collecting Responses' : 'Draft'}
              </div>
            </div>
          </div>

          {survey.updatedAt && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Last updated: {new Date(survey.updatedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Questions ({survey.questionCount})</h2>
          
          {survey.questions && survey.questions.length > 0 ? (
            <div className="space-y-4">
              {survey.questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {QuestionTypeLabels[question.type]}
                        </span>
                        {question.isRequired && (
                          <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium mb-2">{question.text}</p>
                      
                      {question.options && (
                        <div className="ml-4 mt-2">
                          <p className="text-sm text-gray-500 mb-1">Options:</p>
                          <ul className="list-disc list-inside text-sm text-gray-700">
                            {JSON.parse(question.options).map((option: string, idx: number) => (
                              <li key={idx}>{option}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Eye className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No questions added yet</p>
              <button
                onClick={() => navigate(`/surveys/${surveyId}/edit`)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add questions to this survey
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/surveys/${surveyId}/responses`)}
            className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            View Responses ({survey.responseCount})
          </button>
          {survey.isActive && (
            <button
              onClick={() => {
                const url = `${window.location.origin}/survey/${surveyId}`;
                navigator.clipboard.writeText(url);
                alert('Survey link copied to clipboard!');
              }}
              className="flex-1 px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Copy Public Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

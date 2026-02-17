import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  MessageSquare,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { dashboardService } from '@/services/dashboardService';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => dashboardService.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome back!
          </h1>
          <p className="mt-2 text-gray-600">
            Here's your survey performance overview
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <SummaryCard
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
            label="Total Surveys"
            value={stats.surveyStats.totalSurveys}
          />
          <SummaryCard
            icon={<Activity className="w-6 h-6 text-green-600" />}
            label="Active Surveys"
            value={stats.surveyStats.activeSurveys}
          />
          <SummaryCard
            icon={<MessageSquare className="w-6 h-6 text-purple-600" />}
            label="Total Responses"
            value={stats.surveyStats.totalResponses}
          />
          <SummaryCard
            icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
            label="Avg Responses"
            value={stats.responseStats.averagePerSurvey.toFixed(2)}
          />
        </div>

        {/* Activity Trend Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Response Activity (Last 30 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.activityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(label) => {
                  const d = new Date(label);
                  return d.toLocaleDateString();
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="responseCount"
                stroke="#2563eb"
                name="Responses"
                isAnimationActive={true}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Surveys */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Surveys
              </h2>
              <button
                onClick={() => navigate('/surveys')}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {stats.recentSurveys.length > 0 ? (
                stats.recentSurveys.map((survey) => (
                  <div
                    key={survey.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => navigate(`/surveys/${survey.id}`)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {survey.title}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {survey.responseCount}
                      </p>
                      <p className="text-xs text-gray-600">responses</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No surveys yet</p>
              )}
            </div>
          </div>

          {/* Top Surveys */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Top Surveys
            </h2>
            <div className="space-y-4">
              {stats.topSurveys.length > 0 ? (
                stats.topSurveys.map((survey, index) => (
                  <div
                    key={survey.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() =>
                      navigate(`/surveys/${survey.id}/analytics`)
                    }
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {survey.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {survey.responseCount}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No surveys yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Responses */}
        {stats.recentResponses.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mt-10">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Recent Responses
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Survey
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Respondent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Submitted
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentResponses.map((response) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {response.surveyTitle}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {response.respondentEmail || 'Anonymous'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(
                          response.submittedAt
                        ).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() =>
                            navigate(
                              `/surveys/${response.surveyId}/responses/${response.id}`
                            )
                          }
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function SummaryCard({ icon, label, value }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">{icon}</div>
      </div>
    </div>
  );
}

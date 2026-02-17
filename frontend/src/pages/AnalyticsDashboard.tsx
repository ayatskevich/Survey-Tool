import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Loader2, AlertCircle, TrendingUp } from 'lucide-react';
import { responseService } from '@/services/responseService';

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
];

export function AnalyticsDashboard() {
  const { surveyId } = useParams<{ surveyId: string }>();

  if (!surveyId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="mr-2 text-red-500" />
        <span>Survey not found</span>
      </div>
    );
  }

  const { data: analytics, isLoading, error } = useQuery({
    queryKey: ['surveyAnalytics', surveyId],
    queryFn: () => responseService.getSurveyAnalytics(surveyId),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="mr-2 text-red-500" />
        <span>Failed to load analytics</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Survey Analytics
          </h1>
          <p className="mt-2 text-gray-600">{analytics.surveyTitle}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard
            label="Total Responses"
            value={analytics.totalResponses}
            icon={<TrendingUp className="w-5 h-5" />}
          />
          <SummaryCard
            label="First Response"
            value={
              analytics.firstResponseAt
                ? new Date(analytics.firstResponseAt).toLocaleDateString()
                : 'N/A'
            }
          />
          <SummaryCard
            label="Last Response"
            value={
              analytics.lastResponseAt
                ? new Date(analytics.lastResponseAt).toLocaleDateString()
                : 'N/A'
            }
          />
          <SummaryCard
            label="Response Rate"
            value={
              analytics.totalResponses > 0 ? analytics.totalResponses : 'No data'
            }
          />
        </div>

        {/* Response Timeline */}
        {analytics.responseTimeline.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Response Timeline
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.responseTimeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(date: string) =>
                    new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(date: string) =>
                    new Date(date).toLocaleDateString()
                  }
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Question Statistics */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Question Statistics
          </h2>
          {analytics.questionStatistics.map((stat) => (
            <div
              key={stat.questionId}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stat.questionText}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {stat.totalAnswers} responses
                  </p>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  {stat.questionType}
                </span>
              </div>

              {renderStatistic(stat)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

function SummaryCard({ label, value, icon }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
        </div>
        {icon && <div className="text-blue-600">{icon}</div>}
      </div>
    </div>
  );
}

interface StatisticProps {
  questionText: string;
  questionType: string;
  totalAnswers: number;
  optionBreakdown?: Record<string, number>;
  averageRating?: number;
  topAnswers?: string[];
}

function renderStatistic(stat: StatisticProps) {
  if (stat.questionType === 'Rating' && stat.averageRating !== undefined) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-yellow-500">
            {stat.averageRating}
          </div>
          <div className="text-gray-600">/ 5.0</div>
        </div>
        {stat.optionBreakdown && (
          <div className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(stat.optionBreakdown).map(([k, v]) => ({ rating: k, count: v }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="rating" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    );
  }

  if (
    (stat.questionType === 'MultipleChoice' ||
      stat.questionType === 'Checkboxes') &&
    stat.optionBreakdown
  ) {
    const data = Object.entries(stat.optionBreakdown).map(([label, value]) => ({
      name: label,
      value,
    }));

    return (
      <div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }: any) => `${name}: ${value}`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (
    (stat.questionType === 'ShortText' ||
      stat.questionType === 'LongText' ||
      stat.questionType === 'Email') &&
    stat.topAnswers?.length
  ) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Top answers:</p>
        {stat.topAnswers.map((answer: string, idx: number) => (
          <div key={idx} className="text-sm text-gray-700">
            • {answer}
          </div>
        ))}
      </div>
    );
  }

  if (stat.questionType === 'Date' && stat.optionBreakdown) {
    const data = Object.entries(stat.optionBreakdown).map(([label, value]) => ({
      month: label,
      count: value,
    }));

    return (
      <div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <p className="text-sm text-gray-600">
      No visualization available for this question type
    </p>
  );
}


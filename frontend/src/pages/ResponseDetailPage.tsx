import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Loader2, AlertCircle, Printer } from 'lucide-react';
import { responseService } from '@/services/responseService';
import { ResponseAnswerDto } from '@/types/responses';

export function ResponseDetailPage() {
  const { surveyId, responseId } = useParams<{
    surveyId: string;
    responseId: string;
  }>();
  const navigate = useNavigate();

  if (!surveyId || !responseId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="mr-2 text-red-500" />
        <span>Invalid response ID</span>
      </div>
    );
  }

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['responseDetail', surveyId, responseId],
    queryFn: () => responseService.getResponseDetail(surveyId, responseId),
  });

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !response) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AlertCircle className="mr-2 text-red-500" />
        <span>Failed to load response</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/surveys/${surveyId}/responses`)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Response Details
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Response ID: {response.id}
              </p>
            </div>
          </div>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors print:hidden"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>

        {/* Metadata */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Respondent Email
              </p>
              <p className="mt-2 text-lg text-gray-900">
                {response.respondentEmail || 'Anonymous'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Submitted At
              </p>
              <p className="mt-2 text-lg text-gray-900">
                {new Date(response.submittedAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">IP Address</p>
              <p className="mt-2 text-lg text-gray-900">
                {response.ipAddress || 'Not recorded'}
              </p>
            </div>
          </div>
        </div>

        {/* Answers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Answers</h2>
          {response.answers.map((answer: ResponseAnswerDto, index) => (
            <div
              key={answer.questionId}
              className="bg-white rounded-lg border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {index + 1}. {answer.questionText}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                  {answer.questionType}
                </span>
              </div>

              <div className="mt-4">
                {renderAnswerContent(answer)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          .print\\:hidden {
            display: none;
          }
          body {
            background-color: white;
          }
          .max-w-4xl {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

function renderAnswerContent(answer: ResponseAnswerDto) {
  switch (answer.questionType) {
    case 'Rating':
      return (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-yellow-500">★</span>
          <span className="text-lg text-gray-900">{answer.answerText} / 5</span>
        </div>
      );

    case 'MultipleChoice':
    case 'Checkboxes':
      const options = answer.answerText.split(',').map((o) => o.trim());
      return (
        <div className="space-y-2">
          {options.map((option) => (
            <div key={option} className="text-gray-900">
              • {option}
            </div>
          ))}
        </div>
      );

    case 'Date':
      return (
        <p className="text-gray-900">
          {new Date(answer.answerText).toLocaleDateString()}
        </p>
      );

    case 'LongText':
      return (
        <p className="text-gray-900 whitespace-pre-wrap">{answer.answerText}</p>
      );

    default:
      return <p className="text-gray-900">{answer.answerText}</p>;
  }
}

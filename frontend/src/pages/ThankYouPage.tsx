import { useParams, useSearchParams } from 'react-router-dom';

export function ThankYouPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const [searchParams] = useSearchParams();
  const responseId = searchParams.get('responseId');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {/* Success Icon */}
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
        <p className="text-lg text-gray-600 mb-6">
          Your response has been successfully submitted.
        </p>

        {/* Response ID */}
        {responseId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Response ID</p>
            <p className="text-xs font-mono text-gray-700 break-all">{responseId}</p>
          </div>
        )}

        {/* Additional Info */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <p className="text-sm text-gray-600">
            Your feedback is valuable and helps us improve.
          </p>
        </div>

        {/* Optional Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={() => window.location.href = `/survey/${surveyId}`}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Submit Another Response
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-500">
          <p>Powered by SurveyLite</p>
        </div>
      </div>
    </div>
  );
}

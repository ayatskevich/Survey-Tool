import { SurveyDetail } from '../../services/surveyService';

interface SurveyHeaderProps {
  survey: SurveyDetail;
  onBack: () => void;
}

const SurveyHeader = ({ survey, onBack }: SurveyHeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{survey.title}</h1>
            {survey.description && (
              <p className="text-sm text-gray-600 mt-1">{survey.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              survey.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {survey.isActive ? 'Active' : 'Inactive'}
          </span>
          <div className="text-sm text-gray-600">
            {survey.questionCount} questions • {survey.responseCount} responses
          </div>
        </div>
      </div>
    </header>
  );
};

export default SurveyHeader;

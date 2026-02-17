import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm, FormProvider } from 'react-hook-form';
import { publicSurveyService } from '@/services/publicSurveyService';
import { QuestionRenderer } from '@/components/QuestionRenderer';
import type { SubmitResponseDto } from '@/types/publicSurvey';

export function PublicSurveyPage() {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  
  const { data: survey, isLoading, error } = useQuery({
    queryKey: ['publicSurvey', surveyId],
    queryFn: () => publicSurveyService.getPublicSurvey(surveyId!),
    enabled: !!surveyId,
  });

  const methods = useForm();

  const submitMutation = useMutation({
    mutationFn: (data: SubmitResponseDto) => publicSurveyService.submitResponse(surveyId!, data),
    onSuccess: (result) => {
      navigate(`/survey/${surveyId}/thank-you?responseId=${result.responseId}`);
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    const answers = survey?.questions.map((question) => ({
      questionId: question.id,
      answerText: String(data[`answer_${question.id}`] || ''),
    })) || [];

    const respondentEmail = data.respondentEmail || undefined;

    submitMutation.mutate({
      respondentEmail,
      answers,
    });
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Survey Not Found</h1>
          <p className="text-gray-600">This survey is not available or has been deactivated.</p>
        </div>
      </div>
    );
  }

  if (!survey) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-10 text-white">
            <h1 className="text-3xl font-bold mb-2">{survey.title}</h1>
            {survey.description && (
              <p className="text-blue-100 text-lg">{survey.description}</p>
            )}
          </div>

          {/* Form */}
          <FormProvider {...methods}>
            <form onSubmit={onSubmit} className="px-8 py-8">
              {/* Optional email field */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Email (optional)</span>
                  <input
                    type="email"
                    {...methods.register('respondentEmail')}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  We'll only use this to send you a copy of your response
                </p>
              </div>

              {/* Questions */}
              <div className="space-y-8">
                {survey.questions.map((question) => (
                  <QuestionRenderer key={question.id} question={question} />
                ))}
              </div>

              {/* Progress indicator */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  {survey.questions.filter(q => q.isRequired).length} required questions
                </p>
              </div>

              {/* Submit button */}
              <div className="mt-8">
                <button
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitMutation.isPending ? 'Submitting...' : 'Submit Response'}
                </button>
                {submitMutation.isError && (
                  <p className="mt-3 text-sm text-red-600 text-center">
                    Failed to submit response. Please try again.
                  </p>
                )}
              </div>
            </form>
          </FormProvider>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Powered by SurveyLite</p>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { surveyService, Question } from '../services/surveyService';
import QuestionList from '../components/survey-builder/QuestionList';
import QuestionEditor from '../components/survey-builder/QuestionEditor';
import SurveyHeader from '../components/survey-builder/SurveyHeader';

const SurveyBuilderPage = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);

  const { data: survey, isLoading: surveyLoading } = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: () => surveyService.getSurveyById(surveyId!),
    enabled: !!surveyId,
  });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['questions', surveyId],
    queryFn: () => surveyService.getQuestions(surveyId!),
    enabled: !!surveyId,
  });

  const reorderMutation = useMutation({
    mutationFn: (newQuestions: Question[]) =>
      surveyService.reorderQuestions(
        surveyId!,
        newQuestions.map((q, index) => ({ id: q.id, order: index }))
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions', surveyId] });
    },
  });

  useEffect(() => {
    if (questions && questions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [questions, selectedQuestionId]);

  const handleReorder = (reorderedQuestions: Question[]) => {
    reorderMutation.mutate(reorderedQuestions);
  };

  const handleQuestionSelect = (questionId: string) => {
    setSelectedQuestionId(questionId);
  };

  const handleQuestionUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['questions', surveyId] });
    queryClient.invalidateQueries({ queryKey: ['survey', surveyId] });
  };

  const handleBack = () => {
    navigate('/surveys');
  };

  if (surveyLoading || questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Survey not found</h2>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Surveys
          </button>
        </div>
      </div>
    );
  }

  const selectedQuestion = questions?.find((q) => q.id === selectedQuestionId);

  return (
    <div className="h-screen flex flex-col">
      <SurveyHeader survey={survey} onBack={handleBack} />
      
      <div className="flex-1 flex overflow-hidden">
        <QuestionList
          surveyId={surveyId!}
          questions={questions || []}
          selectedQuestionId={selectedQuestionId}
          onQuestionSelect={handleQuestionSelect}
          onReorder={handleReorder}
          onQuestionUpdated={handleQuestionUpdated}
        />

        <div className="flex-1 overflow-auto bg-gray-50">
          {selectedQuestion ? (
            <QuestionEditor
              surveyId={surveyId!}
              question={selectedQuestion}
              onUpdate={handleQuestionUpdated}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Select a question to edit</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyBuilderPage;

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Question, surveyService } from '../../services/surveyService';
import { QuestionTypeLabels } from '../../types/survey';
import AddQuestionModal from './AddQuestionModal';

interface QuestionListProps {
  surveyId: string;
  questions: Question[];
  selectedQuestionId: string | null;
  onQuestionSelect: (id: string) => void;
  onReorder: (questions: Question[]) => void;
  onQuestionUpdated: () => void;
}

const QuestionList = ({
  surveyId,
  questions,
  selectedQuestionId,
  onQuestionSelect,
  onReorder,
  onQuestionUpdated,
}: QuestionListProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (questionId: string) => surveyService.deleteQuestion(surveyId, questionId),
    onSuccess: onQuestionUpdated,
  });

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newQuestions = [...questions];
    const draggedItem = newQuestions[draggedIndex];
    newQuestions.splice(draggedIndex, 1);
    newQuestions.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    onReorder(newQuestions);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDelete = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteMutation.mutate(questionId);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + Add Question
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-2">
        {questions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm">No questions yet</p>
            <p className="text-xs mt-1">Click "Add Question" to start</p>
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              onClick={() => onQuestionSelect(question.id)}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedQuestionId === question.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              } ${draggedIndex === index ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                    <span className="text-xs font-medium text-gray-500">
                      {QuestionTypeLabels[question.type]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">
                    {question.text}
                  </p>
                  {question.isRequired && (
                    <span className="inline-block mt-1 text-xs text-red-600">Required</span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(question.id);
                  }}
                  className="text-gray-400 hover:text-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <AddQuestionModal
        surveyId={surveyId}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          onQuestionUpdated();
        }}
        nextOrder={questions.length}
      />
    </div>
  );
};

export default QuestionList;

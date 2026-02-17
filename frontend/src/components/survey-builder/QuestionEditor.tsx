import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { surveyService, UpdateQuestionRequest, Question } from '../../services/surveyService';
import { QuestionType, QuestionTypeLabels } from '../../types/survey';
import { useState } from 'react';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required').max(500, 'Text must not exceed 500 characters'),
  isRequired: z.boolean(),
  options: z.string().optional(),
  validationRules: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

interface QuestionEditorProps {
  surveyId: string;
  question: Question;
  onUpdate: () => void;
}

const QuestionEditor = ({ surveyId, question, onUpdate }: QuestionEditorProps) => {
  const [options, setOptions] = useState<string[]>(() => {
    if (question.options) {
      try {
        return JSON.parse(question.options);
      } catch {
        return [];
      }
    }
    return [];
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      text: question.text,
      isRequired: question.isRequired,
      options: question.options || '',
      validationRules: question.validationRules || '',
    },
    values: {
      text: question.text,
      isRequired: question.isRequired,
      options: question.options || '',
      validationRules: question.validationRules || '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateQuestionRequest) =>
      surveyService.updateQuestion(surveyId, question.id, data),
    onSuccess: () => {
      onUpdate();
      reset(undefined, { keepValues: true });
    },
  });

  const onSubmit = (data: QuestionFormData) => {
    const optionsJson = requiresOptions(question.type) ? JSON.stringify(options) : undefined;
    updateMutation.mutate({
      text: data.text,
      isRequired: data.isRequired,
      options: optionsJson,
      validationRules: data.validationRules || undefined,
    });
  };

  const requiresOptions = (type: QuestionType) => {
    return type === QuestionType.MultipleChoice || type === QuestionType.Checkboxes;
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Edit Question</h2>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
            {QuestionTypeLabels[question.type]}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
              Question Text <span className="text-red-500">*</span>
            </label>
            <textarea
              id="text"
              {...register('text')}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your question"
            />
            {errors.text && (
              <p className="mt-1 text-sm text-red-600">{errors.text.message}</p>
            )}
          </div>

          {requiresOptions(question.type) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Options <span className="text-red-500">*</span>
              </label>
              <div className="space-y-2">
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors"
                >
                  + Add Option
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              id="isRequired"
              type="checkbox"
              {...register('isRequired')}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
              Required question
            </label>
          </div>

          {updateMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {updateMutation.error instanceof Error
                  ? updateMutation.error.message
                  : 'Failed to update question'}
              </p>
            </div>
          )}

          {updateMutation.isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">Question updated successfully</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={!isDirty || updateMutation.isPending}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            {isDirty && (
              <button
                type="button"
                onClick={() => reset()}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionEditor;

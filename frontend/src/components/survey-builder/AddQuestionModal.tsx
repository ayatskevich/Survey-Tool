import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { surveyService, CreateQuestionRequest } from '../../services/surveyService';
import { QuestionType, QuestionTypeLabels } from '../../types/survey';

const addQuestionSchema = z.object({
  type: z.nativeEnum(QuestionType),
  text: z.string().min(1, 'Question text is required').max(500, 'Text must not exceed 500 characters'),
  isRequired: z.boolean(),
});

type AddQuestionFormData = z.infer<typeof addQuestionSchema>;

interface AddQuestionModalProps {
  surveyId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nextOrder: number;
}

const AddQuestionModal = ({ surveyId, isOpen, onClose, onSuccess, nextOrder }: AddQuestionModalProps) => {
  const [options, setOptions] = useState<string[]>(['', '']);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddQuestionFormData>({
    resolver: zodResolver(addQuestionSchema),
    defaultValues: {
      type: QuestionType.ShortText,
      text: '',
      isRequired: false,
    },
  });

  const selectedType = watch('type');

  const createMutation = useMutation({
    mutationFn: (data: CreateQuestionRequest) => surveyService.addQuestion(surveyId, data),
    onSuccess: () => {
      reset();
      setOptions(['', '']);
      onSuccess();
    },
  });

  const onSubmit = (data: AddQuestionFormData) => {
    const requiresOptions =
      data.type === QuestionType.MultipleChoice || data.type === QuestionType.Checkboxes;
    
    const optionsJson = requiresOptions
      ? JSON.stringify(options.filter((opt) => opt.trim() !== ''))
      : undefined;

    createMutation.mutate({
      type: data.type,
      text: data.text,
      order: nextOrder,
      isRequired: data.isRequired,
      options: optionsJson,
    });
  };

  const handleClose = () => {
    reset();
    setOptions(['', '']);
    createMutation.reset();
    onClose();
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const requiresOptions =
    selectedType === QuestionType.MultipleChoice || selectedType === QuestionType.Checkboxes;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-semibold text-gray-900">Add Question</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Question Type <span className="text-red-500">*</span>
            </label>
            <select
              id="type"
              {...register('type', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(QuestionTypeLabels).map(([value, label]) => (
                <option key={value} value={parseInt(value)}>
                  {label}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

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

          {requiresOptions && (
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
                    {options.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
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
              <p className="mt-2 text-xs text-gray-500">
                At least 2 options are recommended for {selectedType === QuestionType.MultipleChoice ? 'multiple choice' : 'checkbox'} questions
              </p>
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

          {createMutation.isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {createMutation.error instanceof Error
                  ? createMutation.error.message
                  : 'Failed to create question'}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              disabled={createMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Adding...' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionModal;

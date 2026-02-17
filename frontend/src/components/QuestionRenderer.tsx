import { useFormContext } from 'react-hook-form';
import { PublicQuestionDto } from '@/types/publicSurvey';
import { QuestionType } from '@/types/survey';

interface QuestionRendererProps {
  question: PublicQuestionDto;
}

export function QuestionRenderer({ question }: QuestionRendererProps) {
  const { register, formState: { errors } } = useFormContext();
  const fieldName = `answer_${question.id}`;
  const error = errors[fieldName];

  const parseOptions = (optionsJson: string | null): string[] => {
    if (!optionsJson) return [];
    try {
      return JSON.parse(optionsJson);
    } catch {
      return [];
    }
  };

  const renderInput = () => {
    switch (question.type) {
      case QuestionType.ShortText:
        return (
          <input
            type="text"
            {...register(fieldName, { required: question.isRequired ? 'This field is required' : false })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your answer"
          />
        );

      case QuestionType.LongText:
        return (
          <textarea
            {...register(fieldName, { required: question.isRequired ? 'This field is required' : false })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your answer"
            rows={4}
          />
        );

      case QuestionType.Email:
        return (
          <input
            type="email"
            {...register(fieldName, {
              required: question.isRequired ? 'This field is required' : false,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="email@example.com"
          />
        );

      case QuestionType.Date:
        return (
          <input
            type="date"
            {...register(fieldName, { required: question.isRequired ? 'This field is required' : false })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );

      case QuestionType.MultipleChoice: {
        const options = parseOptions(question.options);
        return (
          <div className="mt-2 space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  value={option}
                  {...register(fieldName, { required: question.isRequired ? 'Please select an option' : false })}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      }

      case QuestionType.Checkboxes: {
        const options = parseOptions(question.options);
        return (
          <div className="mt-2 space-y-2">
            {options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  {...register(fieldName, { required: question.isRequired ? 'Select at least one option' : false })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        );
      }

      case QuestionType.Rating:
        return (
          <div className="mt-2 flex space-x-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="cursor-pointer">
                <input
                  type="radio"
                  value={rating}
                  {...register(fieldName, { required: question.isRequired ? 'Please select a rating' : false })}
                  className="sr-only"
                />
                <div className="w-12 h-12 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors peer-checked:border-blue-500 peer-checked:bg-blue-500 peer-checked:text-white">
                  {rating}
                </div>
              </label>
            ))}
          </div>
        );

      default:
        return (
          <input
            type="text"
            {...register(fieldName, { required: question.isRequired ? 'This field is required' : false })}
            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your answer"
          />
        );
    }
  };

  return (
    <div className="mb-6">
      <label className="block">
        <span className="text-lg font-medium text-gray-900">
          {question.text}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </span>
        {renderInput()}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}

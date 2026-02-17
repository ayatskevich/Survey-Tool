// Auth Types
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponseDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'User' | 'Admin';
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'User' | 'Admin';
  createdAt: string;
  lastLoginAt: string | null;
}

// Survey Types
export interface SurveyDto {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  responseCount: number;
}

export interface CreateSurveyDto {
  title: string;
  description: string;
}

export interface QuestionDto {
  id: string;
  text: string;
  type: QuestionType;
  order: number;
  isRequired: boolean;
  options?: string[];
  validationRules?: Record<string, unknown>;
}

export interface CreateQuestionDto {
  text: string;
  type: QuestionType;
  order: number;
  isRequired: boolean;
  options?: string[];
  validationRules?: Record<string, unknown>;
}

export type QuestionType =
  | 'ShortText'
  | 'LongText'
  | 'MultipleChoice'
  | 'Checkboxes'
  | 'Rating'
  | 'Date'
  | 'Email';

// Response Types
export interface ResponseDto {
  id: string;
  surveyId: string;
  respondentEmail?: string;
  submittedAt: string;
  answers: AnswerDto[];
}

export interface AnswerDto {
  id: string;
  questionId: string;
  answerText: string;
}

// Pagination
export interface PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

// Error Response
export interface ErrorResponse {
  error: string;
  statusCode: number;
  timestamp: string;
  details?: Record<string, string[]>;
}

// Public Survey Types
export * from './publicSurvey';

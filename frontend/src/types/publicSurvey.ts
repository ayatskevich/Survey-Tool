import { QuestionType } from './survey';

export interface PublicSurveyDto {
  id: string;
  title: string;
  description: string;
  questions: PublicQuestionDto[];
}

export interface PublicQuestionDto {
  id: string;
  type: QuestionType;
  text: string;
  order: number;
  isRequired: boolean;
  options: string | null;
}

export interface SubmitResponseDto {
  respondentEmail?: string;
  answers: AnswerSubmissionDto[];
}

export interface AnswerSubmissionDto {
  questionId: string;
  answerText: string;
}

export interface ResponseSubmissionResult {
  responseId: string;
  submittedAt: string;
}

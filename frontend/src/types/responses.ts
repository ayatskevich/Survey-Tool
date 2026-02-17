// Response Viewing & Analytics Types

export interface ResponseSummaryDto {
  id: string;
  respondentEmail?: string;
  submittedAt: string;
  answerCount: number;
}

export interface ResponseDetailDto {
  id: string;
  surveyId: string;
  respondentEmail?: string;
  ipAddress?: string;
  submittedAt: string;
  answers: ResponseAnswerDto[];
}

export interface ResponseAnswerDto {
  questionId: string;
  questionText: string;
  questionType: string;
  answerText: string;
}

export interface SurveyAnalyticsDto {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  firstResponseAt?: string;
  lastResponseAt?: string;
  responseTimeline: ResponseTimelineDto[];
  questionStatistics: QuestionStatisticsDto[];
}

export interface ResponseTimelineDto {
  date: string;
  count: number;
}

export interface QuestionStatisticsDto {
  questionId: string;
  questionText: string;
  questionType: string;
  totalAnswers: number;
  optionBreakdown?: Record<string, number>;
  averageRating?: number;
  topAnswers?: string[];
}

export interface PaginatedResponsesDto {
  items: ResponseSummaryDto[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

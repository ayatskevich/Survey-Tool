// Dashboard Statistics Types

export interface DashboardStatsDto {
  surveyStats: SurveyStatsDto;
  responseStats: ResponseStatsDto;
  recentSurveys: RecentSurveyDto[];
  recentResponses: RecentResponseDto[];
  activityTrend: ActivityTrendDto[];
  topSurveys: TopSurveyDto[];
}

export interface SurveyStatsDto {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
}

export interface ResponseStatsDto {
  totalResponses: number;
  responsesThisMonth: number;
  averagePerSurvey: number;
}

export interface RecentSurveyDto {
  id: string;
  title: string;
  createdAt: string;
  responseCount: number;
}

export interface RecentResponseDto {
  id: string;
  surveyId: string;
  surveyTitle: string;
  respondentEmail?: string;
  submittedAt: string;
}

export interface ActivityTrendDto {
  date: string;
  responseCount: number;
}

export interface TopSurveyDto {
  id: string;
  title: string;
  responseCount: number;
}

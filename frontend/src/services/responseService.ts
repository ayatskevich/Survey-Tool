import { api } from './api';
import {
  ResponseDetailDto,
  SurveyAnalyticsDto,
  PaginatedResponsesDto,
} from '@/types/responses';

export const responseService = {
  // Get all responses for a survey (paginated)
  getSurveyResponses: async (
    surveyId: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponsesDto> => {
    const response = await api.get(
      `/api/surveys/${surveyId}/responses`,
      { params: { page, pageSize } }
    );
    return response.data;
  },

  // Get a single response by ID
  getResponseDetail: async (
    surveyId: string,
    responseId: string
  ): Promise<ResponseDetailDto> => {
    const response = await api.get(
      `/api/surveys/${surveyId}/responses/${responseId}`
    );
    return response.data;
  },

  // Get analytics for a survey
  getSurveyAnalytics: async (surveyId: string): Promise<SurveyAnalyticsDto> => {
    const response = await api.get(
      `/api/surveys/${surveyId}/analytics`
    );
    return response.data;
  },

  // Export survey responses as CSV
  exportResponses: async (surveyId: string): Promise<void> => {
    const response = await api.get(
      `/api/surveys/${surveyId}/export`,
      { responseType: 'blob' }
    );

    // Create a download link
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `survey-${surveyId}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    link.parentElement?.removeChild(link);
    window.URL.revokeObjectURL(url);
  },
};

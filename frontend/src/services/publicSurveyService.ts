import axios from 'axios';
import type { PublicSurveyDto, SubmitResponseDto, ResponseSubmissionResult } from '@/types/publicSurvey';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create a separate axios instance without authentication
const publicApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const publicSurveyService = {
  async getPublicSurvey(surveyId: string): Promise<PublicSurveyDto> {
    const response = await publicApi.get<PublicSurveyDto>(`/api/public/surveys/${surveyId}`);
    return response.data;
  },

  async submitResponse(surveyId: string, data: SubmitResponseDto): Promise<ResponseSubmissionResult> {
    const response = await publicApi.post<ResponseSubmissionResult>(
      `/api/public/surveys/${surveyId}/responses`,
      data
    );
    return response.data;
  },
};

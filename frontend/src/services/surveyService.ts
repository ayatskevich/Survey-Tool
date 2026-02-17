import { api } from './api';
import { QuestionType } from '../types/survey';

export interface Survey {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  questionCount: number;
  responseCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyDetail extends Survey {
  questions?: Question[];
}

export interface Question {
  id: string;
  surveyId: string;
  type: QuestionType;
  text: string;
  order: number;
  isRequired: boolean;
  options?: string;
  validationRules?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CreateSurveyRequest {
  title: string;
  description: string;
  isActive: boolean;
}

export interface UpdateSurveyRequest {
  title: string;
  description: string;
  isActive: boolean;
}

export interface CreateQuestionRequest {
  type: QuestionType;
  text: string;
  order: number;
  isRequired: boolean;
  options?: string;
  validationRules?: string;
}

export interface UpdateQuestionRequest {
  text: string;
  isRequired: boolean;
  options?: string;
  validationRules?: string;
}

export interface QuestionOrderRequest {
  id: string;
  order: number;
}

class SurveyService {
  private readonly baseUrl = '/api/surveys';

  // Survey endpoints
  async getSurveys(page = 1, pageSize = 10, searchTerm = ''): Promise<PaginatedResult<Survey>> {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...(searchTerm && { searchTerm }),
    });
    const response = await api.get<PaginatedResult<Survey>>(`${this.baseUrl}?${params}`);
    return response.data;
  }

  async getSurveyById(id: string): Promise<SurveyDetail> {
    const response = await api.get<SurveyDetail>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async createSurvey(data: CreateSurveyRequest): Promise<SurveyDetail> {
    const response = await api.post<SurveyDetail>(this.baseUrl, data);
    return response.data;
  }

  async updateSurvey(id: string, data: UpdateSurveyRequest): Promise<SurveyDetail> {
    const response = await api.put<SurveyDetail>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteSurvey(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`);
  }

  async toggleSurveyStatus(id: string): Promise<SurveyDetail> {
    const response = await api.patch<SurveyDetail>(`${this.baseUrl}/${id}/status`);
    return response.data;
  }

  // Question endpoints
  async getQuestions(surveyId: string): Promise<Question[]> {
    const response = await api.get<Question[]>(`${this.baseUrl}/${surveyId}/questions`);
    return response.data;
  }

  async addQuestion(surveyId: string, data: CreateQuestionRequest): Promise<Question> {
    const response = await api.post<Question>(`${this.baseUrl}/${surveyId}/questions`, data);
    return response.data;
  }

  async updateQuestion(surveyId: string, questionId: string, data: UpdateQuestionRequest): Promise<Question> {
    const response = await api.put<Question>(`${this.baseUrl}/${surveyId}/questions/${questionId}`, data);
    return response.data;
  }

  async deleteQuestion(surveyId: string, questionId: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${surveyId}/questions/${questionId}`);
  }

  async reorderQuestions(surveyId: string, questions: QuestionOrderRequest[]): Promise<void> {
    await api.put(`${this.baseUrl}/${surveyId}/questions/reorder`, questions);
  }
}

export const surveyService = new SurveyService();

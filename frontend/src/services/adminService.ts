import { api } from './api';
import type {
  UserFiltersDto,
  UserPageDto,
  RoleUpdateResultDto,
  SuspensionResultDto,
  SurveyFiltersDto,
  SurveyPageDto,
  CloneSurveyResultDto,
  BulkArchiveResultDto,
  ExportAnalyticsDto,
} from '../types';

// User Management API

export const getUsers = async (filters: UserFiltersDto): Promise<UserPageDto> => {
  const response = await api.post('/api/admin/users/search', filters);
  return response.data;
};

export const updateUserRole = async (userId: string, role: string): Promise<RoleUpdateResultDto> => {
  const response = await api.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const suspendUser = async (userId: string, suspend: boolean, reason: string = ''): Promise<SuspensionResultDto> => {
  const response = await api.put(`/admin/users/${userId}/suspend`, {
    userId,
    suspend,
    reason,
  });
  return response.data;
};

// Survey Management API

export const getSurveys = async (filters: SurveyFiltersDto): Promise<SurveyPageDto> => {
  const response = await api.post('/api/admin/surveys/search', filters);
  return response.data;
};

export const cloneSurvey = async (surveyId: string, newTitle: string): Promise<CloneSurveyResultDto> => {
  const response = await api.post(`/api/admin/surveys/${surveyId}/clone`, { newTitle });
  return response.data;
};

export const bulkArchiveSurveys = async (surveyIds: string[], archive: boolean = true): Promise<BulkArchiveResultDto> => {
  const response = await api.put('/api/admin/surveys/bulk-archive', {
    surveyIds,
    archive,
  });
  return response.data;
};

// Analytics Export API

export const exportAnalytics = async (dto: ExportAnalyticsDto): Promise<void> => {
  const response = await api.post('/api/analytics/export', dto, {
    responseType: 'blob',
  });
  
  // Extract filename from response or use default
  const contentDisposition = response.headers['content-disposition'];
  let fileName = `survey_export_${new Date().toISOString().split('T')[0]}.${dto.format}`;
  if (contentDisposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
    if (matches?.[1]) {
      fileName = matches[1].replace(/['"]/g, '');
    }
  }
  
  // Create blob and trigger download
  const blob = new Blob([response.data], { 
    type: dto.format === 'csv' ? 'text/csv' : 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

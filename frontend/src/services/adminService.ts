import { api } from './api';
import type {
  AdminUserDto,
  UserFiltersDto,
  UserPageDto,
  RoleUpdateResultDto,
  SuspensionResultDto,
  SurveyFiltersDto,
  SurveyPageDto,
  CloneSurveyResultDto,
  BulkArchiveResultDto,
} from '../types';

// User Management API

export const getUsers = async (filters: UserFiltersDto): Promise<UserPageDto> => {
  const response = await api.post('/admin/users/search', filters);
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
  const response = await api.post('/admin/surveys/search', filters);
  return response.data;
};

export const cloneSurvey = async (surveyId: string, newTitle: string): Promise<CloneSurveyResultDto> => {
  const response = await api.post(`/admin/surveys/${surveyId}/clone`, { newTitle });
  return response.data;
};

export const bulkArchiveSurveys = async (surveyIds: string[], archive: boolean = true): Promise<BulkArchiveResultDto> => {
  const response = await api.put('/admin/surveys/bulk-archive', {
    surveyIds,
    archive,
  });
  return response.data;
};

// Admin User Management Types

export interface AdminUserDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  surveyCount: number;
  responseCount: number;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserFiltersDto {
  searchTerm?: string;
  role?: string;
  isActive?: boolean;
  createdFromDate?: string;
  createdToDate?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface UserPageDto {
  items: AdminUserDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface RoleUpdateResultDto {
  success: boolean;
  message: string;
  user: AdminUserDto;
}

export interface SuspensionResultDto {
  success: boolean;
  message: string;
}

// Survey Management Types

export interface SurveyFiltersDto {
  searchTerm?: string;
  isActive?: boolean;
  isArchived?: boolean;
  createdFromDate?: string;
  createdToDate?: string;
  sortBy?: string;
  sortDescending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface SurveyItemDto {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  isArchived: boolean;
  responseCount: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface SurveyPageDto {
  items: SurveyItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface CloneSurveyResultDto {
  success: boolean;
  message: string;
  clonedSurvey: SurveyItemDto;
}

export interface BulkArchiveResultDto {
  success: boolean;
  message: string;
  count: number;
}

// Analytics Export Types

export interface ExportAnalyticsDto {
  surveyId: string;
  format: 'csv' | 'json';
  fromDate?: string;
  toDate?: string;
  includeAnswers: boolean;
}

export interface ExportResultDto {
  success: boolean;
  message: string;
  fileContent: string;
  fileName: string;
  contentType: string;
}

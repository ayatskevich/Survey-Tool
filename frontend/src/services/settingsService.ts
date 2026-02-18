import { api } from './api';
import {
  UserProfileDto,
  UpdateProfileDto,
  ChangePasswordDto,
  UserSessionDto,
  ProfileUpdateResultDto,
  PasswordChangeResultDto,
  AccountDeletionResultDto,
} from '@/types/settings';

export const settingsService = {
  async getUserProfile(): Promise<UserProfileDto> {
    const response = await api.get('/api/users/profile');
    return response.data;
  },

  async updateProfile(
    data: UpdateProfileDto
  ): Promise<ProfileUpdateResultDto> {
    const response = await api.put('/api/users/profile', data);
    return response.data;
  },

  async changePassword(
    data: ChangePasswordDto
  ): Promise<PasswordChangeResultDto> {
    const response = await api.post('/api/users/change-password', data);
    return response.data;
  },

  async getUserSessions(): Promise<UserSessionDto[]> {
    const response = await api.get('/api/users/sessions');
    return response.data;
  },

  async deleteAccount(
    confirmPassword: string
  ): Promise<AccountDeletionResultDto> {
    const response = await api.delete('/api/users/account', {
      data: { confirmPassword },
    });
    return response.data;
  },
};

// User Settings Types

export interface UserProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSessionDto {
  sessionId: string;
  deviceInfo?: string;
  lastActive: string;
  isCurrentSession: boolean;
}

export interface ProfileUpdateResultDto {
  success: boolean;
  message: string;
  updatedProfile: UserProfileDto;
}

export interface PasswordChangeResultDto {
  success: boolean;
  message: string;
}

export interface AccountDeletionResultDto {
  success: boolean;
  message: string;
}

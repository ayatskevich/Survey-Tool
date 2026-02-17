import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Settings, Lock, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { settingsService } from '@/services/settingsService';
import {
  UserProfileDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from '@/types/settings';

type Tab = 'profile' | 'security' | 'danger';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: () => settingsService.getUserProfile(),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8" />
            Account Settings
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your profile, security, and account preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('profile');
                setSuccessMessage('');
                setErrorMessage('');
              }}
              className={`px-6 py-4 font-medium ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => {
                setActiveTab('security');
                setSuccessMessage('');
                setErrorMessage('');
              }}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Lock className="w-4 h-4" /> Security
            </button>
            <button
              onClick={() => {
                setActiveTab('danger');
                setSuccessMessage('');
                setErrorMessage('');
              }}
              className={`px-6 py-4 font-medium flex items-center gap-2 ${
                activeTab === 'danger'
                  ? 'text-red-600 border-b-2 border-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Trash2 className="w-4 h-4" /> Danger Zone
            </button>
          </div>

          {/* Messages */}
          {successMessage && (
            <div className="p-4 bg-green-50 border-l-4 border-green-400 flex items-gap-3 m-4 rounded">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700 ml-3">{successMessage}</p>
            </div>
          )}
          {errorMessage && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 flex items-gap-3 m-4 rounded">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700 ml-3">{errorMessage}</p>
            </div>
          )}

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && profile && (
              <ProfileTab
                profile={profile}
                onSuccess={(msg) => {
                  setSuccessMessage(msg);
                  setErrorMessage('');
                }}
                onError={(msg) => {
                  setErrorMessage(msg);
                  setSuccessMessage('');
                }}
              />
            )}
            {activeTab === 'security' && (
              <SecurityTab
                onSuccess={(msg) => {
                  setSuccessMessage(msg);
                  setErrorMessage('');
                }}
                onError={(msg) => {
                  setErrorMessage(msg);
                  setSuccessMessage('');
                }}
              />
            )}
            {activeTab === 'danger' && (
              <DangerZoneTab
                onSuccess={(msg) => {
                  setSuccessMessage(msg);
                  setErrorMessage('');
                }}
                onError={(msg) => {
                  setErrorMessage(msg);
                  setSuccessMessage('');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({
  profile,
  onSuccess,
  onError,
}: {
  profile: UserProfileDto;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProfileDto>({
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
    },
  });

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileDto) => settingsService.updateProfile(data),
    onSuccess: () => onSuccess('Profile updated successfully'),
    onError: () => onError('Failed to update profile'),
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register('firstName')}
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your first name"
          />
          {errors.firstName && (
            <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register('lastName')}
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            placeholder="Enter your last name"
          />
          {errors.lastName && (
            <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          {...register('email')}
          type="email"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
      >
        {mutation.isPending ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}

function SecurityTab({
  onSuccess,
  onError,
}: {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<ChangePasswordDto>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = watch('newPassword');

  const mutation = useMutation({
    mutationFn: (data: ChangePasswordDto) =>
      settingsService.changePassword(data),
    onSuccess: () => {
      onSuccess('Password changed successfully');
    },
    onError: () => {
      onError('Failed to change password. Please check your current password.');
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-6 max-w-md">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          {...register('currentPassword', {
            required: 'Current password is required',
          })}
          type="password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Enter your current password"
        />
        {errors.currentPassword && (
          <p className="text-red-600 text-sm mt-1">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          {...register('newPassword', {
            required: 'New password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
          type="password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Enter new password"
        />
        {errors.newPassword && (
          <p className="text-red-600 text-sm mt-1">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          {...register('confirmPassword', {
            required: 'Confirmation is required',
            validate: (value) =>
              value === newPassword || 'Passwords do not match',
          })}
          type="password"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          placeholder="Confirm new password"
        />
        {errors.confirmPassword && (
          <p className="text-red-600 text-sm mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
      >
        {mutation.isPending ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
}

function DangerZoneTab({
  onSuccess,
  onError,
}: {
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{
    confirmPassword: string;
  }>();

  const mutation = useMutation({
    mutationFn: (password: string) =>
      settingsService.deleteAccount(password),
    onSuccess: () => {
      onSuccess('Account deleted successfully');
      // Redirect to login after a delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    },
    onError: () => {
      onError('Failed to delete account. Please check your password.');
    },
  });

  return (
    <div className="space-y-6 max-w-md">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-900 font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Permanent Account Deletion
        </p>
        <p className="text-red-800 text-sm mt-2">
          Deleting your account will permanently remove all your data. This action cannot be undone.
        </p>
      </div>

      {!showConfirmation ? (
        <button
          onClick={() => setShowConfirmation(true)}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 font-medium transition-colors"
        >
          Delete Account
        </button>
      ) : (
        <form
          onSubmit={handleSubmit((data) =>
            mutation.mutate(data.confirmPassword)
          )}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              {...register('confirmPassword', {
                required: 'Password is required',
              })}
              type="password"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              placeholder="Enter your password to confirm"
            />
            {errors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="flex-1 bg-gray-300 text-gray-900 py-2 rounded-lg hover:bg-gray-400 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 font-medium transition-colors"
            >
              {mutation.isPending ? 'Deleting...' : 'Confirm Delete'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

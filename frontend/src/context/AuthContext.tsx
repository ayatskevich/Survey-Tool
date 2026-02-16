import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';
import { UserDto, AuthResponseDto } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
  user: UserDto | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        if (accessToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const response = await api.post<AuthResponseDto>('/api/auth/login', {
        email,
        password,
      });

      const { accessToken, refreshToken, ...authUser } = response.data;

      // Store tokens
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Store user info (without tokens)
      const userData: UserDto = {
        id: authUser.id,
        email: authUser.email,
        firstName: authUser.firstName,
        lastName: authUser.lastName,
        role: authUser.role,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    }
  }, []);

  const register = useCallback(
    async (firstName: string, lastName: string, email: string, password: string) => {
      setError(null);
      try {
        const response = await api.post<AuthResponseDto>('/api/auth/register', {
          firstName,
          lastName,
          email,
          password,
          confirmPassword: password,
        });

        const { accessToken, refreshToken, ...authUser } = response.data;

        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Store user info
        const userData: UserDto = {
          id: authUser.id,
          email: authUser.email,
          firstName: authUser.firstName,
          lastName: authUser.lastName,
          role: authUser.role,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Registration failed';
        setError(message);
        throw err;
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

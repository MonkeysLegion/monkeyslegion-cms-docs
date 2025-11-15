'use client';

import { SafeString } from '@/utils/safe-string';
import { createContext, useEffect, useState, ReactNode, JSX } from 'react';

/**
 * General Application Provider
 *
 * Usage Examples:
 *
 * 1. Basic usage:
 * <AppProvider>
 *   <YourApp />
 * </AppProvider>
 *
 * 2. With custom user data:
 * <AppProvider initialUser={customUser}>
 *   <YourApp />
 * </AppProvider>
 *
 * 3. Accessing context:
 * const { user, showSuccess, isAuthenticated } = useContext(AppContext);
 */

export interface User {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  [key: string]: unknown;
}

// Add credentials type and move it before the context type so it can be referenced
export type Credentials = {
  email?: string;
  name?: string;
  role?: string;
};

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  successMessage: string | null;
  showSuccess: (msg: string) => void;
  errorMessage: string | null;
  showError: (msg: string) => void;
  warningMessage: string | null;
  showWarning: (msg: string) => void;
  infoMessage: string | null;
  showInfo: (msg: string) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  logout: () => Promise<void>;
  login: (credentials: Credentials) => Promise<void>;
  role: string | null;
  setRole: (r: string | null) => void;
  permissions: Array<string>;
  setPermissions: (perms: Array<string>) => void;
  showToast: (message: string, type: 'success' | 'error' | 'warning' | 'info') => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
  initialUser?: User | null;
  initialRole?: string;
  initialPermissions?: string[];
  toastDuration?: number;
}

const AppProvider = ({
  children,
  initialUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: "",
    role: 'user',
  },
  initialRole = 'user',
  initialPermissions = ['read', 'write'],
  toastDuration = 3000,
}: AppProviderProps): JSX.Element => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [role, setRole] = useState<string | null>(initialRole);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialUser);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<Array<string>>(initialPermissions);

  // Toast message handlers
  const showSuccess = (msg: string): void => {
    setSuccessMessage(msg);
    console.log('SUCCESS:', msg);
  };

  const showError = (msg: string): void => {
    setErrorMessage(msg);
    console.error('ERROR:', msg);
  };

  const showWarning = (msg: string): void => {
    setWarningMessage(msg);
    console.warn('WARNING:', msg);
  };

  const showInfo = (msg: string): void => {
    setInfoMessage(msg);
    console.info('INFO:', msg);
  };

  // General toast handler
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info'): void => {
    switch (type) {
      case 'success':
        showSuccess(message);
        break;
      case 'error':
        showError(message);
        break;
      case 'warning':
        showWarning(message);
        break;
      case 'info':
        showInfo(message);
        break;
      default:
        console.log(message);
    }
  };

  // Auto-clear messages
  useEffect(() => {
    if (successMessage != null) {
      const timer = setTimeout((): void => setSuccessMessage(null), toastDuration);
      return (): void => clearTimeout(timer);
    }
    return (): void => { };
  }, [successMessage, toastDuration]);

  useEffect(() => {
    if (errorMessage != null) {
      const timer = setTimeout((): void => setErrorMessage(null), toastDuration);
      return (): void => clearTimeout(timer);
    }
    return (): void => { };
  }, [errorMessage, toastDuration]);

  useEffect(() => {
    if (warningMessage != null) {
      const timer = setTimeout((): void => setWarningMessage(null), toastDuration);
      return (): void => clearTimeout(timer);
    }
    return (): void => { };
  }, [warningMessage, toastDuration]);

  useEffect(() => {
    if (infoMessage != null) {
      const timer = setTimeout((): void => setInfoMessage(null), toastDuration);
      return (): void => clearTimeout(timer);
    }
    return (): void => { };
  }, [infoMessage, toastDuration]);

  // Fake login function
  const login = async (credentials: Credentials): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fake user data
      const fakeUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: SafeString(credentials.name, 'John Doe'),
        email: SafeString(credentials.email, 'john.doe@example.com'),
        avatar: "",
        role: SafeString(credentials.role, 'user'),
      };

      setUser(fakeUser);
      setRole(SafeString(fakeUser.role, 'user'));
      setIsAuthenticated(true);
      setPermissions(['read', 'write', 'delete']);

      // Simulate storing tokens
      localStorage.setItem('access-token', 'fake-access-token');
      localStorage.setItem('refresh-token', 'fake-refresh-token');

      showSuccess('Login successful!');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showError(SafeString(message, 'Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Fake logout function
  const logout = async (): Promise<void> => {
    if (!isAuthenticated) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsAuthenticated(false);
      setUser(null);
      setRole(null);
      setPermissions([]);

      // Clear stored tokens
      localStorage.removeItem('access-token');
      localStorage.removeItem('refresh-token');

      showSuccess('You have been logged out successfully');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      showError(SafeString(message, 'Logout failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        successMessage,
        showSuccess,
        errorMessage,
        showError,
        warningMessage,
        showWarning,
        infoMessage,
        showInfo,
        isLoading,
        setIsLoading,
        logout,
        login,
        role,
        setRole,
        permissions,
        setPermissions,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;

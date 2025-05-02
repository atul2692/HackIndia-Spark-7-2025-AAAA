'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  email: string;
  password1: string;
  password2: string;
  first_name?: string;
  last_name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user just logged out
        const justLoggedOut = localStorage.getItem('just_logged_out');
        if (justLoggedOut === 'true') {
          // Clear the flag and don't automatically log back in
          localStorage.removeItem('just_logged_out');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        // First check for JWT tokens (standard login)
        const accessToken = localStorage.getItem('access_token');
        
        if (accessToken) {
          // Verify token and get user info
          const response = await fetch('http://localhost:8000/api/auth/user/', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // Token might be expired, try to refresh
            await refreshToken();
          }
        } else {
          // Check if user is authenticated with Django session (Google OAuth)
          const sessionResponse = await fetch('http://localhost:8000/api/auth/user/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies
          });

          if (sessionResponse.ok) {
            const userData = await sessionResponse.json();
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        logout();
        return;
      }

      const response = await fetch('http://localhost:8000/api/token/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access);
        
        // Get user info with new token
        const userResponse = await fetch('http://localhost:8000/api/auth/user/', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${data.access}`,
            'Content-Type': 'application/json',
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          logout();
        }
      } else {
        logout();
      }
    } catch (err) {
      console.error('Token refresh error:', err);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Login failed');
      }

      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh || '');
      setUser(data.user);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/registration/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const errorMessage = Object.values(responseData).flat().join(', ');
        throw new Error(errorMessage || 'Registration failed');
      }

      if (responseData.access) {
        localStorage.setItem('access_token', responseData.access);
        localStorage.setItem('refresh_token', responseData.refresh || '');
        setUser(responseData.user);
        setIsAuthenticated(true);
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    // Clear all authentication-related data from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('id_token');
    
    // Set a logout flag to prevent automatic re-login
    localStorage.setItem('just_logged_out', 'true');
    
    // Clear user data
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear any auth-specific errors
    setError(null);
    
    // Attempt to logout on the server side (Django)
    try {
      fetch('http://localhost:8000/api/auth/logout/', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      }).catch(err => console.log('Logout error:', err));
    } catch (err) {
      console.error('Logout API error:', err);
    }
    
    // Redirect to the sign-in page
    router.push('/signin');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
import React, { createContext, useContext, useState, useEffect } from 'react';
import { tokenManager } from '@/lib/api-client';
import { authService, type User, type AuthResponse, type RegisterData } from '@/lib/api-services';
import { getUserFromToken, isTokenExpired } from '@/lib/jwt-utils';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  hasAdminAccess: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = tokenManager.getAccessToken();
      if (accessToken && !isTokenExpired(accessToken)) {
        // Extract user info from JWT token
        const userData = getUserFromToken(accessToken);
        if (userData) {
          setUser(userData);
        }
      } else {
        // Token is expired or doesn't exist, clear tokens
        tokenManager.clearTokens();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      tokenManager.clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.signin(email, password);
      
      // Handle JWT response structure
      if (response.success && response.response?.[0]?.details?.[0]?.token) {
        const tokens = response.response[0].details[0].token;
        tokenManager.setTokens(tokens.access, tokens.refresh);
        
        // Extract user info from JWT token
        const userData = getUserFromToken(tokens.access);
        if (userData) {
          setUser(userData);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await authService.signup(userData);
      
      // Handle JWT response structure
      if (response.success && response.response?.[0]?.details?.[0]?.token) {
        const tokens = response.response[0].details[0].token;
        tokenManager.setTokens(tokens.access, tokens.refresh);
        
        // Extract user info from JWT token
        const userInfo = getUserFromToken(tokens.access);
        if (userInfo) {
          setUser(userInfo);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    tokenManager.clearTokens();
    setUser(null);
  };

  const hasAdminAccess = (): boolean => {
    if (!user) return false;
    // Check if user has admin or super role
    return user.role === 'admin' || user.role === 'super';
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user && tokenManager.isAuthenticated(),
    isAdmin: hasAdminAccess(),
    hasAdminAccess,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

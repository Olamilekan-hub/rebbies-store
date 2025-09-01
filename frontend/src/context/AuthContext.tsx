'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  registerCustomer, 
  loginCustomer, 
  getCurrentCustomer, 
  updateCustomer,
  logoutCustomer,
  requestPasswordReset
} from '@/lib/medusa';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  metadata?: {
    gender?: 'male' | 'female' | 'other';
    preferences?: {
      newsletter: boolean;
      smsUpdates: boolean;
      whatsappUpdates: boolean;
    };
  };
  created_at: string;
  updated_at: string;
  has_account?: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  authToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<UserProfile>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load auth token from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('medusa_auth_token');
    if (token) {
      setAuthToken(token);
    }
  }, []);

  useEffect(() => {
    const checkCurrentUser = async () => {
      // Only check for current user if we have an auth token
      if (authToken) {
        try {
          const customer = await getCurrentCustomer();
          if (customer) {
            setUser(customer as unknown as UserProfile);
          }
        } catch (error) {
          // Token might be expired, clear it
          console.log('Error checking current user:', error);
          setAuthToken(null);
          localStorage.removeItem('medusa_auth_token');
        }
      }
      setLoading(false);
    };

    // Only run when authToken state is initialized
    if (authToken !== null || localStorage.getItem('medusa_auth_token') === null) {
      checkCurrentUser();
    }
  }, [authToken]);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    try {
      const result = await loginCustomer(email, password);
      const { customer, token } = result;
      const userProfile = customer as unknown as UserProfile;
      
      setUser(userProfile);
      setAuthToken(token);
      localStorage.setItem('medusa_auth_token', token);
      
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (
    email: string, 
    password: string, 
    firstName: string, 
    lastName: string
  ): Promise<void> => {
    try {
      const customer = await registerCustomer({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      });
      
      const userProfile = customer as unknown as UserProfile;
      setUser(userProfile);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutCustomer();
      setUser(null);
      setAuthToken(null);
      localStorage.removeItem('medusa_auth_token');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await requestPasswordReset(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user is currently signed in');
    
    try {
      const updatedCustomer = await updateCustomer(updates, authToken || undefined);
      const userProfile = updatedCustomer as unknown as UserProfile;
      setUser(userProfile);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    authToken,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
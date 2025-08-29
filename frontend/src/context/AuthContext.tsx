'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  registerCustomer, 
  loginCustomer, 
  getCurrentCustomer, 
  updateCustomer,
  logoutCustomer 
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const customer = await getCurrentCustomer();
        if (customer) {
          setUser(customer as unknown as UserProfile);
        }
      } catch (error) {
        // User not authenticated, which is fine
        console.log('No authenticated user');
      } finally {
        setLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  const login = async (email: string, password: string): Promise<UserProfile> => {
    try {
      const customer = await loginCustomer(email, password);
      const userProfile = customer as unknown as UserProfile;
      setUser(userProfile);
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
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    // MedusaJS doesn't have built-in password reset, you'd need to implement this
    // For now, we'll throw an error to indicate it's not implemented
    throw new Error('Password reset not implemented yet. Please contact support.');
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!user) throw new Error('No user is currently signed in');
    
    try {
      const updatedCustomer = await updateCustomer(updates);
      const userProfile = updatedCustomer as unknown as UserProfile;
      setUser(userProfile);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
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
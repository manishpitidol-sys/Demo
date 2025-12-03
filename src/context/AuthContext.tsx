import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {User, AuthContextType} from '../types';
import {storeUser, getUser, removeUser} from '../utils/storage';
import {authApi} from '../api';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Failed to restore session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{success: boolean; error?: string}> => {
    try {
      const result = await authApi.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        await storeUser(result.user);
      }
      
      return result;
    } catch (error) {
      return {success: false, error: 'Unable to connect. Please try again.'};
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{success: boolean; error?: string}> => {
    try {
      const result = await authApi.signup(name, email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        await storeUser(result.user);
      }
      
      return result;
    } catch (error) {
      return {success: false, error: 'Unable to create account. Please try again.'};
    }
  };

  const logout = async (): Promise<void> => {
    setUser(null);
    await removeUser();
  };

  return (
    <AuthContext.Provider value={{user, isLoading, login, signup, logout}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

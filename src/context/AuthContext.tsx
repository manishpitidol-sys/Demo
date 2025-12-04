import React, {createContext, useState, useEffect, ReactNode} from 'react';
import {User, AuthContextType} from '../types';
import {storeUser, getUser, removeUser} from '../utils/storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const DUMMY_USERS: Array<User & {password: string}> = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    password: '123456',
  },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const restoreUser = async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (error) {
        console.error('Error restoring user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreUser();
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{success: boolean; error?: string}> => {
    try {
      const foundUser = DUMMY_USERS.find(
        (u) => u.email === email && u.password === password,
      );

      if (!foundUser) {
        return {success: false, error: 'Invalid email or password'};
      }

      const userData: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
      };

      setUser(userData);
      await storeUser(userData);

      return {success: true};
    } catch (error) {
      return {success: false, error: 'An error occurred during login'};
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{success: boolean; error?: string}> => {
    try {
      const existingUser = DUMMY_USERS.find((u) => u.email === email);
      if (existingUser) {
        return {success: false, error: 'Email already registered'};
      }

      const newUser: User & {password: string} = {
        id: String(DUMMY_USERS.length + 1),
        name,
        email,
        password,
      };

      DUMMY_USERS.push(newUser);

      const userData: User = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      };

      setUser(userData);
      await storeUser(userData);

      return {success: true};
    } catch (error) {
      return {success: false, error: 'An error occurred during signup'};
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

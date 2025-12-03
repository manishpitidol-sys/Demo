import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../types';

const STORAGE_KEY = '@app_users';

interface StoredUser extends User {
  password: string;
}

const getStoredUsers = async (): Promise<StoredUser[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (!data) {
      const defaultUsers: StoredUser[] = [
        {
          id: '1',
          name: 'Test User',
          email: 'test@test.com',
          password: '123456',
        },
      ];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(defaultUsers));
      return defaultUsers;
    }
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveStoredUsers = async (users: StoredUser[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Failed to save users:', error);
  }
};

export const authApi = {
  async login(email: string, password: string): Promise<{success: boolean; user?: User; error?: string}> {
    const users = await getStoredUsers();
    const normalizedEmail = email.toLowerCase().trim();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
    
    if (!user || user.password !== password) {
      return {success: false, error: 'Invalid email or password'};
    }
    
    const {password: _, ...userData} = user;
    return {success: true, user: userData};
  },

  async signup(name: string, email: string, password: string): Promise<{success: boolean; user?: User; error?: string}> {
    const users = await getStoredUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
    
    if (existingUser) {
      return {success: false, error: 'This email is already registered'};
    }
    
    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
    };
    
    users.push(newUser);
    await saveStoredUsers(users);
    
    const {password: _, ...userData} = newUser;
    return {success: true, user: userData};
  },
};

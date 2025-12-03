export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{success: boolean; error?: string}>;
  signup: (name: string, email: string, password: string) => Promise<{success: boolean; error?: string}>;
  logout: () => Promise<void>;
}

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
};


import React from 'react';
import {render, waitFor, act} from '@testing-library/react-native';
import {AuthProvider, useAuth} from './AuthContext';
import {storeUser, getUser, removeUser} from '../utils/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../utils/storage');

const mockStoreUser = storeUser as jest.MockedFunction<typeof storeUser>;
const mockGetUser = getUser as jest.MockedFunction<typeof getUser>;
const mockRemoveUser = removeUser as jest.MockedFunction<typeof removeUser>;

const TestComponent: React.FC<{onAuth: (auth: any) => void}> = ({onAuth}) => {
  const auth = useAuth();
  React.useEffect(() => {
    onAuth(auth);
  }, [auth, onAuth]);
  return null;
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.clear as jest.Mock)();
  });

  it('should login a user', async () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
    };

    mockGetUser.mockResolvedValue(null);
    mockStoreUser.mockResolvedValue(undefined);

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
      expect(authContext.isLoading).toBe(false);
    });

    await act(async () => {
      const result = await authContext.login('test@test.com', '123456');
      expect(result.success).toBe(true);
    });

    expect(authContext.user).toEqual(mockUser);
    expect(mockStoreUser).toHaveBeenCalledWith(mockUser);
  });

  it('should signup a user', async () => {
    mockGetUser.mockResolvedValue(null);
    mockStoreUser.mockResolvedValue(undefined);

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
      expect(authContext.isLoading).toBe(false);
    });

    await act(async () => {
      const result = await authContext.signup(
        'New User',
        'newuser@test.com',
        'password123',
      );
      expect(result.success).toBe(true);
    });

    expect(authContext.user).toEqual({
      id: '2',
      name: 'New User',
      email: 'newuser@test.com',
    });
    expect(mockStoreUser).toHaveBeenCalled();
  });

  it('should logout a user', async () => {
    mockRemoveUser.mockResolvedValue(undefined);
    mockGetUser.mockResolvedValue({
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
    });

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authContext.user).toBeTruthy();
    });

    await act(async () => {
      await authContext.logout();
    });

    expect(authContext.user).toBeNull();
    expect(mockRemoveUser).toHaveBeenCalled();
  });

  it('should handle invalid credentials', async () => {
    mockGetUser.mockResolvedValue(null);

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
      expect(authContext.isLoading).toBe(false);
    });

    await act(async () => {
      const result = await authContext.login('wrong@test.com', 'wrongpass');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email or password');
    });

    expect(authContext.user).toBeNull();
    expect(mockStoreUser).not.toHaveBeenCalled();
  });

  it('should persist state if AsyncStorage is used', async () => {
    const storedUser = {
      id: '1',
      name: 'Test User',
      email: 'test@test.com',
    };

    mockGetUser.mockResolvedValue(storedUser);

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(
      () => {
        expect(authContext.user).toEqual(storedUser);
      },
      {timeout: 3000},
    );

    expect(mockGetUser).toHaveBeenCalled();
  });

  it('should handle signup with existing email', async () => {
    mockGetUser.mockResolvedValue(null);

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(authContext).toBeDefined();
      expect(authContext.isLoading).toBe(false);
    });

    await act(async () => {
      const result = await authContext.signup(
        'Another User',
        'test@test.com',
        'password123',
      );
      expect(result.success).toBe(false);
      expect(result.error).toBe('Email already registered');
    });

    expect(authContext.user).toBeNull();
  });

  it('should set isLoading to false after restoring user', async () => {
    mockGetUser.mockResolvedValue(null);

    let authContext: any;
    const onAuth = (auth: any) => {
      authContext = auth;
    };

    render(
      <AuthProvider>
        <TestComponent onAuth={onAuth} />
      </AuthProvider>,
    );

    await waitFor(
      () => {
        expect(authContext.isLoading).toBe(false);
      },
      {timeout: 3000},
    );
  });
});


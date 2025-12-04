import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import {HomeScreen} from './HomeScreen';

const mockLogout = jest.fn();

const renderWithAuth = (user: any) => {
  const mockAuthContext = {
    user,
    isLoading: false,
    login: jest.fn(),
    signup: jest.fn(),
    logout: mockLogout,
  };

  jest.spyOn(require('../context/AuthContext'), 'useAuth').mockReturnValue(
    mockAuthContext,
  );

  return render(<HomeScreen />);
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display user name', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const {getByText} = renderWithAuth(user);

    expect(getByText('Hello, John 👋')).toBeTruthy();
  });

  it('should display user email', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const {getByText} = renderWithAuth(user);

    expect(getByText('john@example.com')).toBeTruthy();
  });

  it('should display full user name in info section', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const {getByText} = renderWithAuth(user);

    expect(getByText('John Doe')).toBeTruthy();
  });

  it('should call logout when logout button is pressed', async () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const {getByText} = renderWithAuth(user);

    const logoutButton = getByText('Logout');
    
    await act(async () => {
      fireEvent.press(logoutButton);
    });

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('should display only first name in greeting', () => {
    const user = {
      id: '1',
      name: 'John Michael Doe',
      email: 'john@example.com',
    };

    const {getByText} = renderWithAuth(user);

    expect(getByText('Hello, John 👋')).toBeTruthy();
  });

  it('should not render anything if user is null', () => {
    const {queryByText} = renderWithAuth(null);

    expect(queryByText('Hello')).toBeNull();
  });

  it('should display welcome subtitle', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    const {getByText} = renderWithAuth(user);

    expect(getByText('Welcome to your account')).toBeTruthy();
  });
});


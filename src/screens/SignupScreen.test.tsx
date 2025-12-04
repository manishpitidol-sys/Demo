import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import {SignupScreen} from './SignupScreen';
import {mockNavigate} from '../../jest.setup';

const mockSignup = jest.fn();

const renderWithAuth = (component: React.ReactElement) => {
  const mockAuthContext = {
    user: null,
    isLoading: false,
    login: jest.fn(),
    signup: mockSignup,
    logout: jest.fn(),
  };

  jest.spyOn(require('../context/AuthContext'), 'useAuth').mockReturnValue(
    mockAuthContext,
  );

  return render(component);
};

describe('SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSignup.mockResolvedValue({success: true});
  });

  it('should show an error if name is missing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Name is required')).toBeTruthy();
    expect(mockSignup).not.toHaveBeenCalled();
  });

  it('should show an error if email is missing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const nameInput = getByPlaceholderText('Enter your name');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Email is required')).toBeTruthy();
  });

  it('should show an error if email format is invalid', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'not-an-email');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Invalid email format')).toBeTruthy();
  });

  it('should show an error if password is missing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Password is required')).toBeTruthy();
  });

  it('should show an error if password is less than 6 characters', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Password must be at least 6 characters')).toBeTruthy();
  });

  it('should call signup with correct data when form is valid', async () => {
    const {getByPlaceholderText, getByText} = renderWithAuth(<SignupScreen />);

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    await act(async () => {
      fireEvent.press(getByText('Signup'));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'John Doe',
        'john@example.com',
        'password123',
      );
    });
  });

  it('should trim name and email before calling signup', async () => {
    const {getByPlaceholderText, getByText} = renderWithAuth(<SignupScreen />);

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(nameInput, '  John Doe  ');
    fireEvent.changeText(emailInput, 'john@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    await act(async () => {
      fireEvent.press(getByText('Signup'));
    });

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith(
        'John Doe',
        'john@example.com',
        'password123',
      );
    });
  });

  it('should show general error message on signup failure', async () => {
    mockSignup.mockResolvedValue({
      success: false,
      error: 'Email already registered',
    });

    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, 'password123');
    
    await act(async () => {
      fireEvent.press(getByText('Signup'));
    });

    await waitFor(() => {
      expect(queryByText('Email already registered')).toBeTruthy();
    });
  });

  it('should navigate to Login screen when login link is pressed', () => {
    const {getByText} = renderWithAuth(<SignupScreen />);

    const loginLink = getByText('Login');
    fireEvent.press(loginLink);

    expect(mockNavigate).toHaveBeenCalledWith('Login');
  });

  it('should clear name error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const nameInput = getByPlaceholderText('Enter your name');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Name is required')).toBeTruthy();

    fireEvent.changeText(nameInput, 'John Doe');

    expect(queryByText('Name is required')).toBeFalsy();
  });

  it('should clear email error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const nameInput = getByPlaceholderText('Enter your name');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Email is required')).toBeTruthy();

    fireEvent.changeText(emailInput, 'test@test.com');

    expect(queryByText('Email is required')).toBeFalsy();
  });

  it('should clear password error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <SignupScreen />,
    );

    const passwordInput = getByPlaceholderText('Enter your password');
    const nameInput = getByPlaceholderText('Enter your name');
    const emailInput = getByPlaceholderText('Enter your email');

    fireEvent.changeText(nameInput, 'John Doe');
    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.press(getByText('Signup'));

    expect(queryByText('Password is required')).toBeTruthy();

    fireEvent.changeText(passwordInput, 'password123');

    expect(queryByText('Password is required')).toBeFalsy();
  });
});


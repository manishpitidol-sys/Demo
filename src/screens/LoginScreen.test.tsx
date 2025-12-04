import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import {LoginScreen} from './LoginScreen';
import {mockNavigate} from '../../jest.setup';

const mockLogin = jest.fn();

const renderWithAuth = (component: React.ReactElement) => {
  const mockAuthContext = {
    user: null,
    isLoading: false,
    login: mockLogin,
    signup: jest.fn(),
    logout: jest.fn(),
  };

  jest.spyOn(require('../context/AuthContext'), 'useAuth').mockReturnValue(
    mockAuthContext,
  );

  return render(component);
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLogin.mockResolvedValue({success: true});
  });

  it('should allow typing in email input', () => {
    const {getByPlaceholderText} = renderWithAuth(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@example.com');

    expect(emailInput.props.value).toBe('test@example.com');
  });

  it('should allow typing in password input', () => {
    const {getByPlaceholderText} = renderWithAuth(<LoginScreen />);

    const passwordInput = getByPlaceholderText('Enter your password');
    fireEvent.changeText(passwordInput, 'mypassword');

    expect(passwordInput.props.value).toBe('mypassword');
  });

  it('should show an error if email is empty', () => {
    const {getByText, queryByText} = renderWithAuth(<LoginScreen />);

    const loginButton = getByText('Login');
    fireEvent.press(loginButton);

    expect(queryByText('Email is required')).toBeTruthy();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show an error if email format is invalid', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <LoginScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'invalid-email');
    fireEvent.press(getByText('Login'));

    expect(queryByText('Invalid email format')).toBeTruthy();
  });

  it('should show an error if password is empty', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <LoginScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.changeText(emailInput, 'test@test.com');

    fireEvent.press(getByText('Login'));

    expect(queryByText('Password is required')).toBeTruthy();
  });

  it('should show an error if password is too short', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <LoginScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, '12345');
    fireEvent.press(getByText('Login'));

    expect(queryByText('Password must be at least 6 characters')).toBeTruthy();
  });

  it('should call login with correct credentials on successful validation', async () => {
    const {getByPlaceholderText, getByText} = renderWithAuth(<LoginScreen />);

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, '123456');
    
    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', '123456');
    });
  });

  it('should show general error message on login failure', async () => {
    mockLogin.mockResolvedValue({
      success: false,
      error: 'Invalid email or password',
    });

    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <LoginScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    const passwordInput = getByPlaceholderText('Enter your password');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.changeText(passwordInput, 'wrongpass');
    
    await act(async () => {
      fireEvent.press(getByText('Login'));
    });

    await waitFor(() => {
      expect(queryByText('Invalid email or password')).toBeTruthy();
    });
  });

  it('should navigate to Signup screen when signup link is pressed', () => {
    const {getByText} = renderWithAuth(<LoginScreen />);

    const signupLink = getByText('Signup');
    fireEvent.press(signupLink);

    expect(mockNavigate).toHaveBeenCalledWith('Signup');
  });

  it('should clear email error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <LoginScreen />,
    );

    const emailInput = getByPlaceholderText('Enter your email');
    fireEvent.press(getByText('Login'));

    expect(queryByText('Email is required')).toBeTruthy();

    fireEvent.changeText(emailInput, 'test@test.com');

    expect(queryByText('Email is required')).toBeFalsy();
  });

  it('should clear password error when user starts typing', () => {
    const {getByPlaceholderText, getByText, queryByText} = renderWithAuth(
      <LoginScreen />,
    );

    const passwordInput = getByPlaceholderText('Enter your password');
    const emailInput = getByPlaceholderText('Enter your email');

    fireEvent.changeText(emailInput, 'test@test.com');
    fireEvent.press(getByText('Login'));

    expect(queryByText('Password is required')).toBeTruthy();

    fireEvent.changeText(passwordInput, 'password123');

    expect(queryByText('Password is required')).toBeFalsy();
  });
});


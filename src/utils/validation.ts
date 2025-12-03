export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) {
    return false;
  }
  const trimmed = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(trimmed);
};

export const validatePassword = (password: string): boolean => {
  if (!password) {
    return false;
  }
  return password.length >= 6 && password.length <= 128;
};

export const validateName = (name: string): boolean => {
  if (!name || !name.trim()) {
    return false;
  }
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 50;
};

export const getEmailError = (email: string): string | undefined => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  if (!validateEmail(email)) {
    return 'Please enter a valid email address';
  }
  return undefined;
};

export const getPasswordError = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  if (password.length > 128) {
    return 'Password is too long';
  }
  return undefined;
};

export const getNameError = (name: string): string | undefined => {
  if (!name || !name.trim()) {
    return 'Name is required';
  }
  const trimmed = name.trim();
  if (trimmed.length < 2) {
    return 'Name must be at least 2 characters';
  }
  if (trimmed.length > 50) {
    return 'Name is too long';
  }
  return undefined;
};

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password && password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};

import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {TextField} from '../components/TextField';
import {PrimaryButton} from '../components/PrimaryButton';
import {TitleText, SubtitleText} from '../components/Typography';
import {AppLogo} from '../components/AppLogo';
import {useAuth} from '../context/AuthContext';
import {getEmailError, getPasswordError} from '../utils/validation';
import {RootStackParamList} from '../types';
import {colors, spacing, borderRadius} from '../theme';

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const {login} = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const emailError = getEmailError(email);
    const passwordError = getPasswordError(password);

    const newErrors = {
      ...(emailError && {email: emailError}),
      ...(passwordError && {password: passwordError}),
    };

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await login(email.trim(), password);
      if (!result.success) {
        setErrors({general: result.error || 'Invalid credentials'});
      }
    } catch (error) {
      setErrors({general: 'Something went wrong. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (errors.email) {
      setErrors({...errors, email: undefined});
    }
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errors.password) {
      setErrors({...errors, password: undefined});
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <AppLogo size="medium" />
            <TitleText style={styles.title}>Welcome Back</TitleText>
            <SubtitleText style={styles.subtitle}>Sign in to continue</SubtitleText>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email"
              placeholder="your@email.com"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="email"
              textContentType="emailAddress"
              leftIcon="email"
              error={errors.email}
              accessibilityLabel="Email address"
            />

            <TextField
              label="Password"
              placeholder="Enter password"
              value={password}
              onChangeText={handlePasswordChange}
              showPasswordToggle
              autoComplete="password"
              textContentType="password"
              leftIcon="lock"
              error={errors.password}
              accessibilityLabel="Password"
            />

            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText} accessibilityRole="alert">
                  {errors.general}
                </Text>
              </View>
            )}

            <PrimaryButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.loginButton}
              accessibilityLabel="Sign in to your account"
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Signup')}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Navigate to sign up">
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.backgroundSecondary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  title: {
    marginTop: spacing.lg,
  },
  subtitle: {
    marginTop: spacing.xs,
  },
  errorContainer: {
    marginBottom: spacing.sm,
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: spacing.md,
    marginBottom: spacing.base,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.base,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
});
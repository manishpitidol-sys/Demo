import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {TextField} from '../components/TextField';
import {PrimaryButton} from '../components/PrimaryButton';
import {TitleText, SubtitleText} from '../components/Typography';
import {useAuth} from '../context/AuthContext';
import {validateEmail, validatePassword} from '../utils/validation';
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
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

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
      const result = await login(email, password);
      if (!result.success) {
        setErrors({general: result.error || 'Login failed'});
      }
    } catch (err) {
      setErrors({general: 'Something went wrong. Please try again.'});
    } finally {
      setLoading(false);
    }
  };

  const handleSignupPress = () => {
    navigation.navigate('Signup');
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TitleText>Welcome Back</TitleText>
            <SubtitleText style={styles.subtitle}>Login to continue</SubtitleText>
          </View>

          <View style={styles.form}>
            <TextField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text: string) => {
                setEmail(text);
                if (errors.email) {
                  setErrors(prev => ({...prev, email: undefined}));
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              leftIcon="email"
              error={errors.email}
            />

            <TextField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text: string) => {
                setPassword(text);
                if (errors.password) {
                  setErrors(prev => ({...prev, password: undefined}));
                }
              }}
              showPasswordToggle
              leftIcon="lock"
              error={errors.password}
            />

            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <PrimaryButton
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={styles.loginButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignupPress} activeOpacity={0.7}>
              <Text style={styles.signupLink}>Signup</Text>
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
  subtitle: {
    marginTop: spacing.sm,
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
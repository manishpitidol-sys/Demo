import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {ScreenContainer} from '../components/ScreenContainer';
import {TextField} from '../components/TextField';
import {PrimaryButton} from '../components/PrimaryButton';
import {TitleText, SubtitleText} from '../components/Typography';
import {useAuth} from '../context/AuthContext';
import {
  validateEmail,
  validatePassword,
  validateName,
} from '../utils/validation';
import {RootStackParamList} from '../types';
import {colors, spacing, borderRadius} from '../theme';

type SignupScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Signup'
>;

export const SignupScreen: React.FC = () => {
  const navigation = useNavigation<SignupScreenNavigationProp>();
  const {signup} = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!validateName(name)) {
      newErrors.name = 'Name is required';
    }

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

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    const result = await signup(name.trim(), email.trim(), password);
    
    if (!result.success) {
      setErrors({general: result.error || 'Signup failed'});
    }

    setLoading(false);
  };

  const handleLoginPress = () => {
    navigation.navigate('Login');
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <TitleText>Create Account</TitleText>
            <SubtitleText style={styles.subtitle}>
              Join us by creating an account
            </SubtitleText>
          </View>

          <View style={styles.progressIndicator}>
            <View style={styles.progressBar}>
              <View style={styles.progressFill} />
            </View>
          </View>

          <View style={styles.form}>
            <TextField
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChangeText={(text: string) => {
                setName(text);
                if (errors.name) {
                  setErrors(prev => ({...prev, name: undefined}));
                }
              }}
              autoCapitalize="words"
              leftIcon="person"
              error={errors.name}
            />

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
              title="Signup"
              onPress={handleSignup}
              loading={loading}
              style={styles.signupButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={handleLoginPress} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Login</Text>
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
    marginBottom: spacing.base,
    alignItems: 'center',
  },
  subtitle: {
    marginTop: spacing.sm,
  },
  progressIndicator: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  progressBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.borderLight,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  form: {
    width: '100%',
  },
  signupButton: {
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
  loginLink: {
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
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ScreenContainer} from '../components/ScreenContainer';
import {PrimaryButton} from '../components/PrimaryButton';
import {AppLogo} from '../components/AppLogo';
import {useAuth} from '../context/AuthContext';
import {colors, spacing, borderRadius, typography} from '../theme';

export const HomeScreen: React.FC = () => {
  const {user, logout} = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
      {cancelable: true}
    );
  };

  if (!user) {
    return null;
  }

  const firstName = user.name.split(' ')[0];

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <AppLogo size="small" />
          <Text style={styles.greeting} accessibilityRole="text">
            Hi, {firstName}!
          </Text>
          <Text style={styles.subtitle}>Here's your profile information</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.infoRow} accessibilityRole="text">
            <View style={styles.iconContainer}>
              <Icon name="person" size={22} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue} accessibilityLabel={`Name: ${user.name}`}>
                {user.name}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow} accessibilityRole="text">
            <View style={styles.iconContainer}>
              <Icon name="email" size={22} color={colors.primary} />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue} accessibilityLabel={`Email: ${user.email}`}>
                {user.email}
              </Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          title="Sign Out"
          onPress={handleLogout}
          variant="danger"
          loading={loggingOut}
          disabled={loggingOut}
          style={styles.logoutButton}
          accessibilityLabel="Sign out of your account"
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  greeting: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.base,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    ...typography.labelSmall,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: spacing.xs,
  },
  logoutButton: {
    marginTop: spacing.base,
  },
});
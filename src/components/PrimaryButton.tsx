import React, {useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  Animated,
} from 'react-native';
import {colors, typography, borderRadius, spacing} from '../theme';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  textStyle,
  fullWidth = true,
  accessibilityLabel,
}) => {
  const isDisabled = disabled || loading;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!isDisabled) {
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        friction: 3,
        tension: 40,
      }).start();
    }
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
  };

  return (
    <Animated.View style={{transform: [{scale: scaleAnim}]}}>
      <TouchableOpacity
        style={[
          styles.button,
          variant === 'primary' && styles.primaryButton,
          variant === 'secondary' && styles.secondaryButton,
          variant === 'danger' && styles.dangerButton,
          isDisabled && styles.disabledButton,
          fullWidth && styles.fullWidth,
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityState={{disabled: isDisabled, busy: loading}}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={loading ? 'Processing' : undefined}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              color={variant === 'primary' ? colors.white : colors.primary}
              size="small"
            />
          </View>
        ) : (
          <Text
            style={[
              styles.buttonText,
              variant === 'primary' && styles.primaryButtonText,
              variant === 'secondary' && styles.secondaryButtonText,
              variant === 'danger' && styles.dangerButtonText,
              isDisabled && styles.disabledText,
              textStyle,
            ]}>
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.sm,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowOpacity: 0.3,
  },
  dangerButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.error,
    shadowOpacity: 0.3,
  },
  disabledButton: {
    opacity: 0.6,
    shadowOpacity: 0.2,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    ...typography.button,
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: colors.primary,
  },
  dangerButtonText: {
    color: colors.error,
  },
  disabledText: {
    color: colors.disabledText,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

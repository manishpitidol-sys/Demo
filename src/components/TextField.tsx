import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {colors, typography, spacing, borderRadius} from '../theme';

interface TextFieldProps extends TextInputProps {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
  leftIcon?: string;
  containerStyle?: any;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  showPasswordToggle = false,
  leftIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  accessibilityLabel,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleFocus = (e: any) => {
    setIsFocused(true);
    Animated.spring(scaleAnim, {
      toValue: 1.01,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();
    onBlur?.(e);
  };

  const borderColor = error
    ? colors.error
    : isFocused
    ? colors.primary
    : colors.border;

  const defaultAccessibilityLabel = label || accessibilityLabel || 'Text input';

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={styles.label}
          accessible={false}
          accessibilityRole="none">
          {label}
        </Text>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          {
            borderColor,
            transform: [{scale: scaleAnim}],
          },
          isFocused && !error && styles.inputFocused,
          error && styles.inputError,
        ]}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? colors.primary : colors.textSecondary}
            style={styles.leftIcon}
          />
        )}
        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithIcon,
            showPasswordToggle && styles.inputWithToggle,
            style,
          ]}
          placeholderTextColor={colors.textTertiary}
          secureTextEntry={showPasswordToggle && !isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityLabel={error ? `${defaultAccessibilityLabel}, ${error}` : defaultAccessibilityLabel}
          accessibilityState={{invalid: !!error}}
          accessibilityHint={showPasswordToggle ? 'Double tap to toggle password visibility' : undefined}
          {...props}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.eyeIcon}
            activeOpacity={0.6}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            accessibilityHint="Double tap to toggle password visibility">
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && (
        <Text
          style={styles.errorText}
          accessibilityLiveRegion="polite"
          accessibilityRole="alert">
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    ...typography.label,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,
    borderWidth: 1.5,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.base,
  },
  inputFocused: {
    borderWidth: 2,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  inputWithIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithToggle: {
    paddingRight: spacing.sm,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  eyeIcon: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.sm,
  },
});

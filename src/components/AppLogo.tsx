import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {colors, typography} from '../theme';

interface AppLogoProps {
  size?: 'small' | 'medium' | 'large';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'medium',
  showText = false,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const logoSize = size === 'small' ? 48 : size === 'large' ? 80 : 64;
  const fontSize = size === 'small' ? 20 : size === 'large' ? 32 : 24;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{scale: scaleAnim}],
        },
      ]}>
      <View
        style={[
          styles.logoCircle,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
          },
        ]}>
        <Text style={[styles.logoText, {fontSize}]}>A</Text>
      </View>
      {showText && (
        <Text style={[styles.logoLabel, size === 'small' && styles.logoLabelSmall]}>
          AuthApp
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    ...typography.h2,
    color: colors.white,
    fontWeight: '800',
  },
  logoLabel: {
    marginTop: 8,
    ...typography.bodyMedium,
    color: colors.textPrimary,
    letterSpacing: 1,
  },
  logoLabelSmall: {
    fontSize: 14,
  },
});

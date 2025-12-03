import React from 'react';
import {Text, StyleSheet, TextProps, TextStyle} from 'react-native';
import {typography, colors} from '../theme';

interface TitleTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const TitleText: React.FC<TitleTextProps> = ({children, style, ...props}) => {
  return (
    <Text style={[styles.title, style]} {...props}>
      {children}
    </Text>
  );
};

interface SubtitleTextProps extends TextProps {
  children: React.ReactNode;
  style?: TextStyle;
}

export const SubtitleText: React.FC<SubtitleTextProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <Text style={[styles.subtitle, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

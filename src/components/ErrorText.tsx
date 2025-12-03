import React from 'react';
import {Text, StyleSheet} from 'react-native';

interface ErrorTextProps {
  message: string;
}

export const ErrorText: React.FC<ErrorTextProps> = ({message}) => {
  return <Text style={styles.errorText}>{message}</Text>;
};

const styles = StyleSheet.create({
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});

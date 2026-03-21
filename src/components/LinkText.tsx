// src/components/LinkText.tsx
import React from 'react';
import {
    GestureResponderEvent,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { AppConfig } from '../app.config';
import { makeTheme } from '../theme/theme';

type LinkTextProps = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  muted?: boolean;
  center?: boolean;
  marginY?: number;
  textStyle?: TextStyle;
  style?: ViewStyle;
  activeOpacity?: number;
};

export function LinkText({
  children,
  onPress,
  disabled = false,
  muted = false,
  center = true,
  marginY,
  textStyle,
  style,
  activeOpacity = 0.6,
}: LinkTextProps) {
  const theme = makeTheme(AppConfig.defaultTheme);

  const wrapper: ViewStyle = {
    alignSelf: center ? 'center' : undefined,
    marginVertical: marginY ?? 0,
  };

  const text: TextStyle[] = [
    muted || disabled ? theme.typography.variants.muted : theme.typography.variants.link,
    center && theme.styles.textCenter,
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={activeOpacity}
      hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
      style={[wrapper, style]}
      disabled={disabled}>
      <Text style={text}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({});

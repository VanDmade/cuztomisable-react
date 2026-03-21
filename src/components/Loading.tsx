// src/components/Loading.tsx
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { AppConfig } from '../app.config';
import { makeTheme } from '../theme/theme';

export const Loading: React.FC<{ text?: string; fadeOut?: boolean; loadingImageSource?: any }> = ({ text, fadeOut = false, loadingImageSource }) => {
  const theme = makeTheme(AppConfig.defaultTheme);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 4800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spin.start();

    return () => spin.stop();
  }, [rotateAnim]);

  useEffect(() => {
    if (fadeOut) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [fadeOut, fadeAnim]);

  const spinInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        theme.styles.container,
        theme.styles.rowJustifyContentCenter,
        {
          backgroundColor: theme.colors.background,
          flex: 1,
          opacity: fadeAnim,
        },
      ]}>
      <Animated.Image
        source={loadingImageSource}
        style={[
          styles.cog,
          theme.utils.mbsm,
          {
            backgroundColor: theme.colors.background,
            tintColor: theme.colors.primary,
            transform: [{ rotate: spinInterpolate }],
          },
        ]}
        resizeMode="contain" />
      {text && (
        <Text style={[theme.styles.textCenter, theme.typography.variants.body]}>
          {text}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cog: {
    width: 176,
    height: 176,
  },
});

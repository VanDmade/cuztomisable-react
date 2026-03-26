// src/components/ui/Spacer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Keyboard, Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  subtract?: number;
  cap?: number;
  animated?: boolean;
  subtractSafeArea?: boolean;
};

export function Spacer({
  subtract = 0,
  cap = 300,
  animated = true,
  subtractSafeArea = true,
}: Props) {
  const insets = useSafeAreaInsets();
  const [height, setHeight] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const raw = e?.endCoordinates?.height ?? 0;
      let height = raw - (subtractSafeArea ? insets.bottom : 0) - (subtract || 0);
      height = Math.max(0, Math.min(height, cap));
      if (animated) {
        Animated.timing(anim, { toValue: height, duration: 220, useNativeDriver: false }).start();
      } else {
        setHeight(height);
      }
    };

    const onHide = () => {
      if (animated) {
        Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
      } else {
        setHeight(0);
      }
    };

    const s1 = Keyboard.addListener(showEvent, onShow);
    const s2 = Keyboard.addListener(hideEvent, onHide);
    return () => { s1.remove(); s2.remove(); };
  }, [anim, animated, cap, insets.bottom, subtract, subtractSafeArea]);

  if (animated) return <Animated.View pointerEvents="none" style={{ height: anim }} />;
  return <View pointerEvents="none" style={{ height }} />;
}

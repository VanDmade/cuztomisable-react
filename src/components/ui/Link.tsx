// src/components/ui/Link.tsx
import React from 'react';
import {
    GestureResponderEvent,
    Text,
    TextStyle,
    TouchableOpacity,
    ViewStyle
} from 'react-native';

import { useTheme } from '../../providers/ThemeProvider';

type LinkProps = {
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

export function Link({
    children,
    onPress,
    disabled = false,
    muted = false,
    center = true,
    marginY,
    textStyle,
    style,
    activeOpacity = 0.6,
}: LinkProps) {
    const { typography, styles } = useTheme();

    const wrapper: ViewStyle = {
        alignSelf: center ? 'center' : undefined,
        marginVertical: marginY ?? 0,
    };

    const text: TextStyle[] = [
        muted || disabled
            ? typography.variants.muted
            : typography.variants.link,
        center && styles.textCenter,
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
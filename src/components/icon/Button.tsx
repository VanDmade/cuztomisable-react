// src/components/icon/Button.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

export function ButtonIcon({
    onPress,
    icon,
    color,
}: {
    onPress: () => void;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    color: string;
}) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.iconBtn} activeOpacity={0.7}>
            <MaterialCommunityIcons name={icon} size={26} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

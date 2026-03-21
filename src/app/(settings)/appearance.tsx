// src/app/(settings)/appearance.tsx
import React from 'react';
import { View } from 'react-native';

import { FormHeader, FormRadio, FormScreen } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';

export default function AppearanceScreen() {
    const { theme, appearance, setAppearance } = useTheme();

    return (
        <FormScreen paddingTop="20">
            {() => (
                <View style={[theme.styles.container, theme.styles.background, theme.utils.pxmd]}>
                    <FormHeader
                        theme={theme}
                        title="Appearance"
                        subtitle="Pick the look that works best for you." />
                    <View style={theme.styles.form}>
                        <FormRadio
                            label="Phone's default"
                            selected={appearance === 'default'}
                            onPress={() => setAppearance('default')} />
                        <FormRadio
                            label="Light mode"
                            selected={appearance === 'light'}
                            onPress={() => setAppearance('light')} />
                        <FormRadio
                            label="Dark mode"
                            selected={appearance === 'dark'}
                            onPress={() => setAppearance('dark')} />
                    </View>
                </View>
            )}
        </FormScreen>
    );
}

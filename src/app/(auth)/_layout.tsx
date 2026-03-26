// cuztomisable/app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import { View } from 'react-native';

import { PasswordProvider } from '../../contexts/PasswordContext';
import { useTheme } from '../../providers/ThemeProvider';

export default function AuthLayout() {
    const theme = useTheme();
    return (
        <PasswordProvider>
            <View style={[theme.styles.flex, theme.styles.background]}>
                <Stack
                    screenOptions={{
                        header: () => null, // Forcefully hide header
                        headerShown: false,
                        animation: 'fade',
                        animationDuration: 250,
                    }} />
            </View>
        </PasswordProvider>
    );
}

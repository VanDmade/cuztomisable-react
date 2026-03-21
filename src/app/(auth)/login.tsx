// src/app/(auth)/login.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { AppConfig } from '../../app.config';
import { Button, FormHeader, FormInput, FormScreen, LinkText } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useOnboarding } from '../../hooks/useOnboarding';

export default function LoginScreen({ logoSource }: { logoSource: any }) {
    const { theme } = useTheme();
    const router = useRouter();
    const { login } = useAuth();
    const { showMessage } = useMessage();
    const { resetOnboarding } = useOnboarding();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { busy, errors, runAction, setErrors } = useAsyncAction();

    const goToForgotPassword = () => router.push('/(auth)/forgot');
    const goToRegister = () => router.push('/(auth)/register');
    const handleReset = async () => {
        await resetOnboarding();
        router.replace('/(onboarding)');
    };

    const onSubmit = async () => {
        return runAction(async () => {
            const data = await login(username.trim(), password);
            showMessage(data.message, 'success');
            if (data?.requiresMfa) {
                router.push({
                    pathname: '/(auth)/mfa',
                    params: { token: data.token },
                });
            } else {
                router.push({ pathname: '/(tabs)/drinks' }); // You may want to make this configurable or handle post-login navigation in the app, not the package
            }
        });
    };

    return (
        <FormScreen centered>
            {() => (
                <View style={[theme.styles.container, theme.styles.background, theme.utils.pxmd]}>
                    <FormHeader
                        theme={theme}
                        title="Login"
                        subtitle={`Welcome to ${AppConfig.appName ?? 'Cuztomisable'}!`}
                        logoSource={logoSource} />
                    <View style={theme.styles.form}>
                        <FormInput
                            theme={theme}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="off"
                            value={username}
                            onChangeText={setUsername}
                            disabled={busy}
                            onClearError={() => setErrors(prev => ({ ...prev, username: undefined }))}
                            error={errors?.username} />
                        <FormInput
                            theme={theme}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                            disabled={busy}
                            onClearError={() => setErrors(prev => ({ ...prev, password: undefined }))}
                            error={errors?.password} />
                    </View>
                    <Button
                        title="Login"
                        onPress={onSubmit}
                        disabled={busy}
                        containerStyle={theme.utils.mtmd} />
                    <LinkText onPress={goToForgotPassword} style={theme.utils.mtmd} disabled={busy}>
                        Forgot password?
                    </LinkText>
                    <LinkText onPress={handleReset} style={theme.utils.mtmd} disabled={busy}>
                        Reset Onboarding
                    </LinkText>
                    <LinkText onPress={goToRegister} style={theme.utils.mtsm} muted disabled={busy}>
                        Don't have an account? <Text style={[theme.typography.variants.link, busy && theme.styles.mutedText]}>Register</Text>
                    </LinkText>
                </View>
            )}
        </FormScreen>
    );
}

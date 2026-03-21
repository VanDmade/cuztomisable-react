// cuztomisable/app/(auth)/forgot.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, FormHeader, FormInput, FormScreen, LinkText } from '../../components';
import { useMessage } from '../../contexts/MessageContext';
import { usePassword } from '../../contexts/PasswordContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';

export default function ForgotScreen({ logoSource }: { logoSource: any }) {
    const { theme } = useTheme();
    const router = useRouter();
    const { request } = usePassword();
    const { busy, errors, runAction, setErrors } = useAsyncAction();
    const { showMessage } = useMessage();
    const [username, setUsername] = useState('');

    const goToLogin = () => router.push('/(auth)/login');

    const onSubmit = () =>
        runAction(async () => {
            const data = await request(username.trim());
            showMessage(data.message, 'success');
            // Sends the user to the reset screen with the token within the "parameters" of the URL
            router.push({
                pathname: '/(auth)/reset',
                params: { token: data.token },
            });
    });

    return (
        <FormScreen centered>
            {() => (
                <View style={[theme.styles.container, theme.utils.pxmd, theme.styles.background]}>
                    <FormHeader
                        theme={theme}
                        title="Forgot Password"
                        subtitle="Enter the email associated with your account"
                        logoSource={logoSource} />
                    <View style={theme.styles.form}>
                        <FormInput
                            theme={theme}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={username}
                            onChangeText={setUsername}
                            disabled={busy}
                            onClearError={() => setErrors(prev => ({ ...prev, username: undefined }))}
                            error={errors?.username} />
                    </View>
                    <Button
                        title="Send"
                        onPress={onSubmit}
                        disabled={busy}
                        containerStyle={theme.utils.mtmd}/>
                    <LinkText onPress={goToLogin} style={theme.utils.mtmd} muted disabled={busy}>
                        Remember your password? <Text style={[theme.typography.variants.link, busy && theme.styles.mutedText]}>Login</Text>
                    </LinkText>
                </View>
            )}
        </FormScreen>
    );
}
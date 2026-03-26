// src/app/(auth)/reset.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Button, FormHeader, FormInput, FormScreen, LinkText } from '../../components';
import { PasswordRequirements } from '../../components/ui/PasswordRequirements';
import { useMessage } from '../../contexts/MessageContext';
import { usePassword } from '../../contexts/PasswordContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useCountdown } from '../../hooks/useCountdown';
import { useTheme } from '../../providers/ThemeProvider';
import { imageDefault as themeImages } from '../../theme/images';

export default function ResetScreen({ logoSource }: { logoSource?: any }) {
    const theme = useTheme();
    const router = useRouter();
    const { finalize, verify, resend } = usePassword();
    const { showMessage } = useMessage();
    const { busy, errors, runAction, setErrors } = useAsyncAction();
    const { isDone, reset } = useCountdown(30);
    const { token } = useLocalSearchParams<{ token: string; }>();
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [verified, setVerified] = useState(false);

    const onSubmit = () => {
        return runAction(async () => {
            const data = await finalize(token, code.trim(), password.trim());
            showMessage(data.message, 'success');
            router.push('../(auth)/login');
        });
    };

    const onVerify = () => {
        return runAction(async () => {
            const data = await verify(token, code.trim());
            setVerified(true);
        });
    };

    const onResend = () => {
        return runAction(async () => {
            const data = await resend(token);
            showMessage(data.message, 'success');
            reset();
        });
    };

    const goToLogin = () => router.push('/(auth)/login');

    return (
        <FormScreen centered>
            {() => (
                <View style={[theme.styles.container, theme.styles.background, theme.utils.pxmd]}>
                    {!verified ? (
                        <>
                            <FormHeader
                                theme={theme}
                                title="Reset Password"
                                subtitle="Code has been sent!"
                                logoSource={logoSource || themeImages.logo} />
                            <View style={theme.styles.form}>
                                <FormInput
                                    theme={theme}
                                    placeholder="Code"
                                    autoCapitalize="none"
                                    value={code}
                                    onChangeText={setCode}
                                    disabled={busy}
                                    capitalOnly
                                    onClearError={() => setErrors(prev => ({ ...prev, code: undefined }))}
                                    error={errors?.code} />
                            </View>
                            <Button
                                title="Verify"
                                onPress={onVerify}
                                disabled={busy || code.trim().length < 4}
                                containerStyle={theme.utils.mtmd} />
                            {isDone && (
                                <LinkText onPress={onResend} style={theme.utils.mtmd} muted disabled={busy}>
                                    Still haven&#39;t received the code?
                                    <Text
                                        style={[
                                            theme.typography.variants.link,
                                            busy && theme.styles.mutedText,
                                        ]}>Resend</Text>
                                </LinkText>
                            )}
                        </>
                    ) : (
                        <>
                            <FormHeader
                                theme={theme}
                                title="Reset Password"
                                subtitle="Your code has been verified!"
                                logoSource={logoSource || themeImages.logo} />
                            <View style={theme.styles.form}>
                                <FormInput
                                    theme={theme}
                                    placeholder="Password"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    disabled={busy}
                                    onClearError={() => setErrors(prev => ({ ...prev, password: undefined }))}
                                    error={errors?.password} />
                                <PasswordRequirements password={password} theme={theme} />
                            </View>
                            <Button
                                title="Reset Password"
                                onPress={onSubmit}
                                disabled={busy || code.trim().length < 4}
                                containerStyle={theme.utils.mtmd} />
                            <LinkText onPress={goToLogin} style={theme.utils.mtmd} muted disabled={busy}>
                                Remember your password?
                                <Text
                                    style={[
                                        theme.typography.variants.link,
                                        busy && theme.styles.mutedText,
                                    ]}>Go back to Login</Text>
                            </LinkText>
                        </>
                    )}
                </View>
            )}
        </FormScreen>
    );
}

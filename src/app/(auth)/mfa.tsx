// src/app/(auth)/mfa.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { Button, FormCheckbox, FormHeader, FormInput, FormScreen, LinkText } from '../../components';
import { useAuth } from '../../contexts/AuthContext';
import { useMessage } from '../../contexts/MessageContext';
import { useAsyncAction } from '../../hooks/useAsyncAction';
import { useCountdown } from '../../hooks/useCountdown';
import { useTheme } from '../../providers/ThemeProvider';
import { imageDefault as themeImages } from '../../theme/images';

type Channel = 'email' | 'sms';

export default function MfaScreen({ logoSource }: { logoSource?: any }) {
    const theme = useTheme();
    const router = useRouter();
    const { verifyMfaToken, sendMfaCode, finalizeMfa } = useAuth();
    const { busy, errors, runAction, setErrors } = useAsyncAction();
    const { showMessage } = useMessage();
    const { isDone, reset } = useCountdown(30);
    const { token } = useLocalSearchParams<{ token: string }>();
    const [channel, setChannel] = useState<Channel>('email');
    const [code, setCode] = useState('');
    const [email, setEmail] = useState<string | null>(null);
    const [phone, setPhone] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                if (!token) {
                    // The token is missing and the user shouldn't be here
                    showMessage('Missing token', 'danger');
                    router.push('/(auth)/login');
                    return;
                }
                const data = await verifyMfaToken(token);
                if (data.email == null || data.phone == null) {
                    setSent(true);
                    if (data.phone == null) {
                        showMessage(`The code was sent to ${data.email}.`, 'success');
                    } else {
                        showMessage(`The code was sent to ${data.phone}.`, 'success');
                    }
                }
                setEmail(data.email);
                setPhone(data.phone);
            } catch (err: any) {
                showMessage(err?.message ?? 'Invalid or expired token', 'danger');
            }
        })();
    }, [token, router, showMessage, verifyMfaToken]);

    const onSubmit = async () => {
        return runAction(async () => {
            const data = await finalizeMfa(token, code);
            showMessage(data.message, 'success');
            router.replace('/(tabs)/drinks');
        });
    };
    const onSend = async () => {
        return runAction(async () => {
            setSent(true);
            const data = await sendMfaCode(token, channel);
            showMessage(data.message, 'success');
            reset();
        });
    };

    return (
        <FormScreen centered>
            {() => (
                <View style={[theme.styles.container, theme.styles.background, theme.utils.pxmd]}>
                    <FormHeader
                        theme={theme}
                        title="Two-Step Verification"
                        subtitle="Where should the code to be sent."
                        logoSource={logoSource || themeImages.logo}
                    />
                    {!sent ? (
                        <>
                            <View style={theme.styles.form}>
                                {email && (
                                    <FormCheckbox
                                        label={email}
                                        value={channel === 'email'}
                                        onValueChange={() => setChannel('email')}
                                        disabled={busy}
                                        fullWidthPressable
                                    />
                                )}
                                {phone && (
                                    <FormCheckbox
                                        label={phone}
                                        value={channel === 'sms'}
                                        onValueChange={() => setChannel('sms')}
                                        disabled={busy}
                                        fullWidthPressable
                                    />
                                )}
                            </View>
                            <Button
                                title="Send Code"
                                onPress={onSend}
                                disabled={busy}
                                containerStyle={theme.utils.mtmd} />
                        </>
                    ) : (
                        <>
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
                                    error={errors?.code}
                                />
                            </View>
                            <Button
                                title="Verify"
                                onPress={onSubmit}
                                disabled={busy || code.trim().length < 4}
                                containerStyle={theme.utils.mtmd} />
                            {isDone && (
                                <LinkText onPress={onSend} style={theme.utils.mtmd} muted disabled={busy}>
                                    Still haven&#39;t received the code?
                                    <Text style={[theme.typography.variants.link, busy && theme.styles.mutedText]}>Resend</Text>
                                </LinkText>
                            )}
                        </>
                    )}
                </View>
            )}
        </FormScreen>
    );
}

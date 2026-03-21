// src/components/form/Toggle.tsx
import React from 'react';
import {
    Platform,
    Pressable,
    StyleSheet,
    Switch,
    Text,
    View,
} from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { makeFormStyles } from './styles';

type FormToggleProps = {
    label: string;
    value: boolean;
    onValueChange: (next: boolean) => void;
    helperText?: string;
    error?: string | string[];
    disabled?: boolean;
};

export const FormToggle: React.FC<FormToggleProps> = ({
    label,
    value,
    onValueChange,
    helperText,
    error,
    disabled = false,
}) => {
    const { theme } = useTheme();
    const formStyles = React.useMemo(() => makeFormStyles(theme), [theme]);

    const hasError = !!(error && (Array.isArray(error) ? error.length : true));
    const errorText = Array.isArray(error) ? error.join('\n') : error;

    const handlePress = () => {
        if (disabled) {
            return;
        }
        onValueChange(!value);
    };

    return (
        <View>
            <Pressable
                onPress={handlePress}
                disabled={disabled}
                style={({ pressed }) => [
                    styles.row,
                    {
                        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
                    },
                ]}>
                <View>
                    {label ? (<Text style={[formStyles.inlineLabel]}>{label}</Text>) : null}
                    {helperText ? (
                        <Text
                        style={[
                            formStyles.helper,
                        ]}>{helperText}</Text>
                    ) : null}
                </View>
            <Switch
                value={value}
                onValueChange={onValueChange}
                disabled={disabled}
                thumbColor={Platform.OS === 'android' ? (value ? theme.colors.primary : '#f4f3f4') : undefined}
                trackColor={{
                    false: hasError ? (theme.colors.danger + '55') : (theme.colors.border ?? '#CCC'),
                    true: hasError ? theme.colors.danger : (theme.colors.primary + '99'),
                }}
                style={{ height: 22 }} />
            </Pressable>
            {hasError && errorText ? (
                <Text style={[formStyles.error]}>
                    {errorText}
                </Text>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flex: 1,
        marginRight: 12,
    },
    label: {
        fontSize: 15,
        fontWeight: '500',
    },
    helper: {
        marginTop: 2,
        fontSize: 12,
    },
    error: {
        marginTop: 4,
        fontSize: 12,
    },
});

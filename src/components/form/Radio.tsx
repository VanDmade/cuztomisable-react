// src/components/form/Radio.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';
import { makeFormStyles } from './styles';

type FormRadioProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
    helperText?: string;
    error?: string | string[];
    disabled?: boolean;
};

export const FormRadio: React.FC<FormRadioProps> = ({
    label,
    selected,
    onPress,
    helperText,
    error,
    disabled = false,
}) => {
    const { theme } = useTheme();
    const formStyles = React.useMemo(() => makeFormStyles(theme), [theme]);

    const hasError = !!(error && (Array.isArray(error) ? error.length : true));
    const errorText = Array.isArray(error) ? error.join('\n') : error;

    return (
        <View style={styles.container}>
            <Pressable
                onPress={disabled ? undefined : onPress}
                disabled={disabled}
                style={({ pressed }) => [
                    styles.row,
                    {
                        opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
                    },
                ]}
                accessibilityRole="radio"
                accessibilityState={{ selected, disabled }}>
                <View
                    style={[
                        styles.outerCircle,
                        {
                            borderColor: hasError
                                ? theme.colors.danger
                                : selected
                                ? theme.colors.primary
                                : theme.colors.border ?? '#CCC',
                        },
                    ]}>
                {selected && (
                    <View
                        style={[
                            styles.innerCircle,
                            { backgroundColor: theme.colors.primary },
                        ]}/>
                )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={[formStyles.inlineLabel]}>{label}</Text>
                    {helperText ? (
                        <Text
                            style={[
                                formStyles.helper,
                            ]}>
                            {helperText}
                        </Text>
                    ) : null}
                </View>
            </Pressable>
            {hasError && errorText ? (
                <Text style={[formStyles.error]}>{errorText}</Text>
            ) : null}
        </View>
    );
};

const OUTER_SIZE = 20;
const INNER_SIZE = 12;

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    outerCircle: {
        width: OUTER_SIZE,
        height: OUTER_SIZE,
        borderRadius: OUTER_SIZE / 2,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    innerCircle: {
        width: INNER_SIZE,
        height: INNER_SIZE,
        borderRadius: INNER_SIZE / 2,
    },
    textContainer: {
        flex: 1,
    },
    label: {},
    helper: {},
    error: {},
});

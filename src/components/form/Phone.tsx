// src/components/form/Phone.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Text, TextInput, TextInputProps, View } from 'react-native';
import { AppConfig } from '../../app.config';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../theme/theme';
import { countryOptions } from '../../utils/countryOptions';
import type { DropdownOption } from './Dropdown';
import { Dropdown } from './Dropdown';
import { makeFormStyles } from './styles';

export type PhoneValue = {
    countryCode: string;
    number: string;
};

type PhoneProps = {
    theme?: Theme;
    label?: string;
    error?: string;
    disabled?: boolean;
    value?: PhoneValue;
    onChange?: (val: PhoneValue) => void;
    onClearError?: () => void;
    showCountryCode?: boolean;
    countryOptions?: DropdownOption<string | number>[];
} & Omit<TextInputProps, 'value' | 'onChangeText' | 'editable' | 'keyboardType' | 'placeholder' | 'onChange'>;

const COUNTRY_OPTIONS = countryOptions([...AppConfig.countries]);

export const Phone: React.FC<PhoneProps> = ({
    theme,
    label,
    error,
    disabled = false,
    value,
    onChange,
    onClearError,
    showCountryCode = true,
    countryOptions: countryOptionsProp,
    style,
    ...textInputProps
}) => {
    const { theme: contextTheme } = useTheme();
    const activeTheme = theme ?? contextTheme;
    const formStyles = useMemo(() => makeFormStyles(activeTheme), [activeTheme]);
    const options = useMemo(
        () => countryOptionsProp ?? COUNTRY_OPTIONS,
        [countryOptionsProp]
    );
    const defaultCountryCode = String(options[0]?.value ?? '1');
    const [internal, setInternal] = useState<PhoneValue>({
        countryCode: value?.countryCode && value?.countryCode !== '' ?
        value.countryCode : defaultCountryCode,
        number: value?.number ?? '',
    });
    const fadeAnim = useRef(new Animated.Value(error ? 1 : 0)).current;
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: error ? 1 : 0,
            duration: 150,
            useNativeDriver: true,
            }).start();
    }, [error]);
    useEffect(() => {
        if (value) {
            setInternal(value);
        }
    }, [value?.countryCode, value?.number]);

    const propagate = (next: PhoneValue) => {
        setInternal(next);
        onChange?.(next);
        if (error && onClearError) {
            onClearError();
        }
    };

    const handleCountryChange = (cc: string | number) => {
        propagate({
            ...internal,
            countryCode: String(cc),
        });
    };

    const handleNumberChange = (text: string) => {
        propagate({
            ...internal,
            number: text.replace(/[^\d]/g, ''),
        });
    };

    return (
        <View style={formStyles.wrapper}>
            {label && (<Text style={formStyles.label}>{label}</Text>)}
            <View
                style={[
                    formStyles.row,
                    formStyles.input,
                    activeTheme.utils.pynone,
                    disabled && formStyles.inputDisabled,
                    error && formStyles.errorBorder,
                    style,
                ]}>
                {showCountryCode && options.length > 1 && (<>
                    <Dropdown
                        theme={activeTheme}
                        fieldStyle={{...formStyles.rowSpaceBetween, minWidth: 75}}
                        modalTitle="Select Country"
                        placeholder="+1"
                        value={internal.countryCode}
                        options={options}
                        onSelect={handleCountryChange}
                        disabled={disabled} />
                    <View style={[formStyles.divider, {backgroundColor: activeTheme.colors.border}]} />
                </>)}
                <TextInput
                    style={[
                        activeTheme.styles.flex,
                        activeTheme.utils.pymd,
                        showCountryCode && options.length > 1 && activeTheme.utils.plmd,
                        activeTheme.utils.prmd,
                        {fontSize: activeTheme.typography.sizes.xs, color: activeTheme.colors.text},
                    ]}
                    keyboardType="phone-pad"
                    editable={!disabled}
                    placeholder="Phone Number"
                    placeholderTextColor={activeTheme.colors.muted}
                    value={internal.number}
                    onChangeText={handleNumberChange}
                    {...textInputProps} />
            </View>
            <Animated.View style={[formStyles.errorContainer, {opacity: fadeAnim}]}>
                <Text style={activeTheme.typography.variants.error}>{error || ' '}</Text>
            </Animated.View>
        </View>
    );
};

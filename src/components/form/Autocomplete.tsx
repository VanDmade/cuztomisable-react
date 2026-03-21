// src/components/form/Autocomplete.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../theme/theme';
import type { DropdownOption } from './Dropdown';
import { makeFormStyles } from './styles';

type AutocompleteProps<T = any> = {
    theme?: Theme;
    label?: string;
    helperText?: string;
    error?: string;
    disabled?: boolean;
    value?: string;
    onChangeText?: (text: string) => void;
    onSelect?: (value: T, option: DropdownOption<T>) => void;
    options: DropdownOption<T>[];
    placeholder?: string;
    minChars?: number;
    clearOnSelect?: boolean;
    fillOnSelect?: boolean;
    filterOption?: (option: DropdownOption<T>, query: string) => boolean;
};

export const FormAutocomplete = <T,>({
    theme,
    label,
    helperText,
    error,
    disabled = false,
    value,
    onChangeText,
    onSelect,
    options,
    placeholder = 'Search...',
    minChars = 1,
    clearOnSelect = false,
    fillOnSelect = true,
    filterOption,
}: AutocompleteProps<T>) => {
    const { theme: contextTheme } = useTheme();
    const activeTheme = theme ?? contextTheme;
    const formStyles = useMemo(() => makeFormStyles(activeTheme), [activeTheme]);
    const [internalValue, setInternalValue] = useState(value ?? '');

    useEffect(() => {
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    const handleChange = (text: string) => {
        if (value === undefined) {
            setInternalValue(text);
        }
        onChangeText?.(text);
    };

    const query = value !== undefined ? value : internalValue;
    const filtered = useMemo(() => {
        if (query.length < minChars) {
            return [] as DropdownOption<T>[];
        }
        const q = query.toLowerCase();
        const filter = filterOption ?? ((opt: DropdownOption<T>, qText: string) => opt.label.toLowerCase().includes(qText));
        return options.filter((opt) => filter(opt, q));
    }, [options, query, minChars, filterOption]);

    return (
        <View style={formStyles.wrapper}>
            {label ? (<Text style={formStyles.label}>{label}</Text>) : null}
            <TextInput
                value={query}
                placeholder={placeholder}
                placeholderTextColor={activeTheme.colors.muted ?? '#AAA'}
                editable={!disabled}
                style={[
                    formStyles.input,
                    disabled && formStyles.inputDisabled,
                    error && formStyles.errorBorder,
                ]}
                onChangeText={handleChange}
            />
            {helperText ? (<Text style={formStyles.helper}>{helperText}</Text>) : null}
            {error ? (<Text style={formStyles.error}>{error}</Text>) : null}
            {filtered.length > 0 ? (
                <View style={[styles.list, { borderColor: activeTheme.colors.border, backgroundColor: activeTheme.colors.background }]}
                >
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={filtered}
                        keyExtractor={(_, index) => String(index)}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => {
                                    onSelect?.(item.value, item);
                                    if (fillOnSelect) {
                                        handleChange(item.label);
                                    }
                                    if (clearOnSelect) {
                                        handleChange('');
                                    }
                                }}
                                style={({ pressed }) => [
                                    styles.listItem,
                                    { opacity: pressed ? 0.85 : 1 },
                                ]}
                            >
                                <Text style={{ color: activeTheme.colors.text }}>{item.label}</Text>
                                {!!item.description && (
                                    <Text style={[styles.description, { color: activeTheme.colors.muted }]}>
                                        {item.description}
                                    </Text>
                                )}
                            </Pressable>
                        )}
                    />
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        marginTop: 6,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        maxHeight: 220,
    },
    listItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DDD',
    },
    description: {
        marginTop: 2,
        fontSize: 12,
    },
});

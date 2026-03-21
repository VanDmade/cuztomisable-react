// src/components/form/Tags.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../theme/theme';
import { makeFormStyles } from './styles';

export type TagItem = {
    id: string;
    name: string;
    color?: string;
};

type FormTagsProps = {
    theme?: Theme;
    label?: string;
    placeholder?: string;
    notes?: string;
    disabled?: boolean;
    hideDetails?: boolean;
    minLength?: number;
    maxLength?: number;
    value: TagItem[];
    onChange: (tags: TagItem[]) => void;
    errors?: string[];
    suggestions?: TagItem[];
    palette?: string[];
};

export const FormTags: React.FC<FormTagsProps> = ({
    theme,
    label,
    placeholder = 'Add a tag',
    notes = 'Press enter once you have entered the name of the tag.',
    disabled = false,
    hideDetails = false,
    minLength = 2,
    maxLength = 32,
    value,
    onChange,
    errors,
    suggestions = [],
    palette,
}) => {
    const { theme: contextTheme } = useTheme();
    const activeTheme = theme ?? contextTheme;
    const formStyles = useMemo(() => makeFormStyles(activeTheme), [activeTheme]);
    const [draftName, setDraftName] = useState('');
    const [draftColor, setDraftColor] = useState<string | undefined>(palette?.[0]);
    const [errorList, setErrorList] = useState<string[]>(errors ?? []);

    useEffect(() => {
        if (errors) {
            setErrorList(errors);
        }
    }, [errors]);

    const filteredSuggestions = useMemo(() => {
        if (!draftName) {
            return [] as TagItem[];
        }
        const q = draftName.toLowerCase();
        return suggestions.filter((item) => item.name.toLowerCase().includes(q));
    }, [draftName, suggestions]);

    const generateColor = () => {
        const colorGenerator = () => Math.floor(256 * Math.random());
        const rgbToHex = (val: number) => {
            const hex = val.toString(16);
            return (hex.length === 1 ? '0' : '') + hex;
        };
        return `#${rgbToHex(colorGenerator())}${rgbToHex(colorGenerator())}${rgbToHex(colorGenerator())}`;
    };

    const textColor = (color: string) => {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return (r * 0.299 + g * 0.587 + b * 0.114) <= 186 ? 'white' : 'black';
    };

    const resetDraft = () => {
        setDraftName('');
        setDraftColor(palette?.[0]);
    };

    const addTag = (tag?: TagItem) => {
        setErrorList([]);
        const name = (tag?.name ?? draftName).trim();
        if (name.length < minLength) {
            setErrorList([`The tag must be at least ${minLength} characters long.`]);
            return;
        }
        if (name.length > maxLength) {
            setErrorList([`The tag must be at most ${maxLength} characters long.`]);
            return;
        }
        const color = tag?.color ?? draftColor ?? generateColor();
        const newItem: TagItem = {
            id: tag?.id ?? `NEW-${Date.now()}`,
            name,
            color,
        };
        const existingIndex = value.findIndex((item) => item.name.toLowerCase() === name.toLowerCase());
        const next = [...value];
        if (existingIndex >= 0) {
            next.splice(existingIndex, 1);
        }
        next.unshift(newItem);
        onChange(next);
        resetDraft();
    };

    const removeTag = (index: number) => {
        const next = value.filter((_, i) => i !== index);
        onChange(next);
    };

    const editTag = (tag: TagItem) => {
        if (tag.id.startsWith('NEW-')) {
            setDraftName(tag.name);
            setDraftColor(tag.color);
        }
    };

    const handleSelectSuggestion = (tag: TagItem) => {
        addTag({ ...tag, id: `EXISTING-${tag.id}` });
    };

    return (
        <View style={formStyles.wrapper}>
            {label ? (<Text style={formStyles.label}>{label}</Text>) : null}
            <View style={styles.inputRow}>
                <TextInput
                    value={draftName}
                    placeholder={placeholder}
                    placeholderTextColor={activeTheme.colors.muted ?? '#AAA'}
                    editable={!disabled}
                    style={[
                        formStyles.input,
                        styles.flex,
                        disabled && formStyles.inputDisabled,
                    ]}
                    onChangeText={setDraftName}
                    onSubmitEditing={() => addTag()}
                />
                {palette?.length ? (
                    <View style={styles.palette}>
                        {palette.map((color) => (
                            <Pressable
                                key={color}
                                onPress={() => setDraftColor(color)}
                                style={[
                                    styles.paletteDot,
                                    { backgroundColor: color, borderColor: activeTheme.colors.border },
                                    draftColor === color && styles.paletteDotActive,
                                ]}
                            />
                        ))}
                    </View>
                ) : null}
            </View>
            {draftName && filteredSuggestions.length > 0 ? (
                <View style={[styles.suggestions, { borderColor: activeTheme.colors.border }]}>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={filteredSuggestions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable
                                onPress={() => handleSelectSuggestion(item)}
                                style={({ pressed }) => [
                                    styles.suggestionRow,
                                    { opacity: pressed ? 0.85 : 1 },
                                ]}
                            >
                                <Text style={{ color: activeTheme.colors.text }}>{item.name}</Text>
                            </Pressable>
                        )}
                    />
                </View>
            ) : null}
            {notes ? (<Text style={formStyles.helper}>{notes}</Text>) : null}
            {!hideDetails && errorList.length > 0 ? (
                <View style={styles.errorList}>
                    {errorList.map((err, index) => (
                        <Text key={`${index}-${err}`} style={formStyles.error}>{err}</Text>
                    ))}
                </View>
            ) : null}
            {value.length > 0 ? (
                <View style={styles.tags}>
                    {value.map((tag, index) => (
                        <Pressable
                            key={`${tag.id}-${index}`}
                            style={[
                                formStyles.chip,
                                { backgroundColor: tag.color ?? activeTheme.colors.primary },
                            ]}
                            onPress={() => editTag(tag)}
                        >
                            <Text
                                style={[
                                    formStyles.chipText,
                                    { color: tag.color ? textColor(tag.color) : 'white' },
                                ]}
                            >
                                {tag.name}
                            </Text>
                            <Pressable onPress={() => removeTag(index)}>
                                <Text style={[formStyles.chipRemove, { color: 'white' }]}>×</Text>
                            </Pressable>
                        </Pressable>
                    ))}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    flex: {
        flex: 1,
    },
    palette: {
        flexDirection: 'row',
        gap: 6,
        marginLeft: 8,
    },
    paletteDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
    },
    paletteDotActive: {
        borderWidth: 2,
    },
    suggestions: {
        marginTop: 6,
        borderWidth: 1,
        borderRadius: 10,
        overflow: 'hidden',
        maxHeight: 160,
    },
    suggestionRow: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#DDD',
    },
    errorList: {
        marginTop: 6,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
});

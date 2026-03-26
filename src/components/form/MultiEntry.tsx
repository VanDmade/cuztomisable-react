// src/components/form/MultiEntry.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { Theme } from '../../theme/theme';
import { makeFormStyles } from './styles';

export type MultiEntryItem = {
    id?: string;
    slug?: string;
    steps?: number | string;
    alternatives?: MultiEntryItem[];
    [key: string]: any;
};

type RenderArgs<T> = {
    value: T[];
    item: T;
    index: number;
    alternativeIndex: number | null;
};

type MultiEntryProps<T extends MultiEntryItem> = {
    theme?: Theme;
    value: T[];
    onChange: (next: T[]) => void;
    template: T;
    errors?: Array<string[]> | Record<string, string[]>;
    disabled?: boolean;
    hideDetails?: boolean;
    hideDetailsWhenNoErrors?: boolean;
    removeAll?: boolean;
    startWithOne?: boolean;
    label?: string;
    notes?: string;
    addLabel?: string;
    addButton?: boolean;
    removeLabel?: string;
    slugs?: boolean;
    steps?: boolean;
    reorganize?: boolean;
    renderEntry: (args: RenderArgs<T>) => React.ReactNode;
    renderSettings?: (args: RenderArgs<T>) => React.ReactNode;
    renderOutput?: (args: RenderArgs<T>) => React.ReactNode;
    onAdd?: () => void;
    onRemove?: () => void;
};

export const FormMultiEntry = <T extends MultiEntryItem>({
    theme,
    value,
    onChange,
    template,
    errors,
    disabled = false,
    hideDetails = false,
    hideDetailsWhenNoErrors = false,
    removeAll = false,
    startWithOne = true,
    label,
    notes,
    addLabel = 'Add',
    addButton = true,
    removeLabel = 'Remove',
    slugs = false,
    steps = false,
    reorganize = true,
    renderEntry,
    renderSettings,
    renderOutput,
    onAdd,
    onRemove,
}: MultiEntryProps<T>) => {
    const activeTheme = theme ?? useTheme();
    const formStyles = useMemo(() => makeFormStyles(activeTheme), [activeTheme]);
    const [asking, setAsking] = useState<Record<string, boolean>>({});
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        if (startWithOne && value.length === 0) {
            handleAdd();
        }
    }, []);

    const setValue = (next: T[]) => onChange(next);

    const handleAdd = () => {
        const nextCounter = counter + 1;
        setCounter(nextCounter);
        const nextItem = JSON.parse(JSON.stringify(template)) as T;
        nextItem.id = nextItem.id ?? `NEW-${nextCounter}`;
        nextItem.slug = nextItem.slug ?? `slug-${Math.random().toString(16).slice(10)}`;
        setValue([...value, nextItem]);
        onAdd?.();
    };

    const handleRemove = (index: number, alternativeIndex: number | null = null) => {
        if (!removeAll && value.length === 1 && alternativeIndex === null) {
            return;
        }
        const key = `${index}${alternativeIndex !== null ? `-${alternativeIndex}` : ''}`;
        if (asking[key]) {
            setAsking((prev) => ({ ...prev, [key]: false }));
            fullyRemove(index, alternativeIndex);
        } else {
            setAsking((prev) => ({ ...prev, [key]: true }));
            setTimeout(() => {
                setAsking((prev) => ({ ...prev, [key]: false }));
            }, 2500);
        }
    };

    const fullyRemove = (index: number, alternativeIndex: number | null = null) => {
        if (!removeAll && value.length === 1 && alternativeIndex === null) {
            return;
        }
        const next = [...value];
        if (alternativeIndex !== null && Array.isArray(next[index].alternatives)) {
            next[index].alternatives = next[index].alternatives?.filter((_, i) => i !== alternativeIndex) as MultiEntryItem[];
        } else {
            next.splice(index, 1);
        }
        setValue(next as T[]);
        onRemove?.();
    };

    const reorderUp = (index: number) => {
        if (index === 0) {
            return;
        }
        const next = [...value];
        const current = next[index];
        next[index] = next[index - 1];
        next[index - 1] = current;
        setValue(next);
    };

    const reorderDown = (index: number) => {
        if (index === value.length - 1) {
            return;
        }
        const next = [...value];
        const current = next[index];
        next[index] = next[index + 1];
        next[index + 1] = current;
        setValue(next);
    };

    const getErrors = (index: number, key = '') => {
        if (!errors) {
            return [] as string[];
        }
        if (Array.isArray(errors)) {
            const errorList = errors[index] ?? [];
            return Array.isArray(errorList) ? errorList : [];
        }
        const direct = (errors as Record<string, string[]>)[String(index)] ?? [];
        if (key) {
            return (errors as Record<string, string[]>)[`${index}.${key}`] ?? direct;
        }
        return direct;
    };

    const getEntries = (item: T) => [item, ...((item.alternatives ?? []) as T[])];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    {label ? (
                        <Text style={formStyles.label}>{label}</Text>
                    ) : null}
                    {notes ? (<Text style={formStyles.helper}>{notes}</Text>) : null}
                </View>
                <View style={styles.headerRight}>
                    {addButton ? (
                        <Pressable
                            onPress={handleAdd}
                            disabled={disabled}
                            style={({ pressed }) => [
                                styles.addButton,
                                { backgroundColor: activeTheme.color.primary, opacity: pressed ? 0.85 : 1 },
                                disabled && styles.disabledButton,
                            ]}
                        >
                            <Text style={styles.addButtonText}>{addLabel}</Text>
                        </Pressable>
                    ) : null}
                </View>
            </View>
            {value.map((mainItem, index) => (
                <View key={mainItem.id ?? index} style={styles.entryGroup}>
                    {getEntries(mainItem).map((item, altIndex) => {
                        const alternativeIndex = altIndex === 0 ? null : altIndex - 1;
                        const renderArgs = { value, item: item as T, index, alternativeIndex };
                        const errorList = getErrors(index);
                        const canRemove = removeAll || value.length > 1 || alternativeIndex !== null;
                        const askKey = `${index}${alternativeIndex !== null ? `-${alternativeIndex}` : ''}`;
                        const isAsking = asking[askKey] ?? false;
                        return (
                            <View key={`${mainItem.id ?? index}-${altIndex}`} style={styles.entryRow}>
                                <View style={styles.entryControls}>
                                    {steps ? (
                                        <View style={styles.stepBadge}>
                                            <Text style={{ color: activeTheme.color.text }}>
                                                {item.steps ?? index + 1}
                                            </Text>
                                        </View>
                                    ) : null}
                                    <View style={styles.entryContent}>
                                        {renderEntry(renderArgs)}
                                    </View>
                                    {reorganize && alternativeIndex === null && value.length > 1 ? (
                                        <View style={styles.reorderGroup}>
                                            <Pressable
                                                onPress={() => reorderUp(index)}
                                                disabled={index === 0 || disabled}
                                                style={({ pressed }) => [
                                                    styles.reorderButton,
                                                    { opacity: pressed ? 0.85 : 1 },
                                                ]}
                                            >
                                                <Text style={styles.reorderIcon}>↑</Text>
                                            </Pressable>
                                            <Pressable
                                                onPress={() => reorderDown(index)}
                                                disabled={index === value.length - 1 || disabled}
                                                style={({ pressed }) => [
                                                    styles.reorderButton,
                                                    { opacity: pressed ? 0.85 : 1 },
                                                ]}
                                            >
                                                <Text style={styles.reorderIcon}>↓</Text>
                                            </Pressable>
                                        </View>
                                    ) : null}
                                    <Pressable
                                        onPress={() => handleRemove(index, alternativeIndex)}
                                        disabled={!canRemove || disabled}
                                        style={({ pressed }) => [
                                            styles.removeButton,
                                            { backgroundColor: activeTheme.color.danger, opacity: pressed ? 0.85 : 1 },
                                            (!canRemove || disabled) && styles.disabledButton,
                                        ]}
                                    >
                                        <Text style={styles.removeButtonText}>
                                            {isAsking ? 'Are you sure?' : removeLabel}
                                        </Text>
                                    </Pressable>
                                    {renderSettings ? (
                                        <View style={styles.settings}>
                                            {renderSettings(renderArgs)}
                                        </View>
                                    ) : null}
                                </View>
                                <View style={styles.outputRow}>
                                    {renderOutput ? (
                                        <View style={styles.outputLeft}>
                                            {renderOutput(renderArgs)}
                                        </View>
                                    ) : null}
                                    {slugs ? (
                                        <Text style={formStyles.helper}>{item.slug}</Text>
                                    ) : null}
                                </View>
                                {!hideDetails && (hideDetailsWhenNoErrors ? errorList.length > 0 : true) ? (
                                    <View style={styles.errorBlock}>
                                        {errorList.map((err, errIndex) => (
                                            <Text key={`${mainItem.id ?? index}-err-${errIndex}`} style={formStyles.error}>{err}</Text>
                                        ))}
                                    </View>
                                ) : null}
                            </View>
                        );
                    })}
                </View>
            ))}
            {!addButton ? (
                <Pressable
                    onPress={handleAdd}
                    disabled={disabled}
                    style={({ pressed }) => [
                        styles.addButton,
                        { backgroundColor: activeTheme.color.primary, opacity: pressed ? 0.85 : 1 },
                        disabled && styles.disabledButton,
                    ]}
                >
                    <Text style={styles.addButtonText}>{addLabel}</Text>
                </Pressable>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        marginLeft: 12,
    },
    addButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    addButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    disabledButton: {
        opacity: 0.6,
    },
    entryGroup: {
        marginBottom: 12,
    },
    entryRow: {
        marginBottom: 12,
    },
    entryControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
    },
    stepBadge: {
        minWidth: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#DDD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    entryContent: {
        flex: 1,
        minWidth: 160,
    },
    reorderGroup: {
        flexDirection: 'row',
        gap: 6,
    },
    reorderButton: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#DDD',
    },
    reorderIcon: {
        fontSize: 12,
    },
    removeButton: {
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    removeButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 12,
    },
    settings: {
        marginLeft: 6,
    },
    outputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    outputLeft: {
        flex: 1,
    },
    errorBlock: {
        marginTop: 6,
    },
});

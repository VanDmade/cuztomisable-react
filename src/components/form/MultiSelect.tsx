// src/components/form/MultiSelect.tsx
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextStyle,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Theme } from '../../theme/theme';
import type { DropdownOption } from './Dropdown';
import { makeFormStyles } from './styles';

export type MultiSelectHandle = {
    open: () => void;
    close: () => void;
};

type MultiSelectProps<T = any> = {
    theme?: Theme;
    value: T[];
    onChange: (val: T[]) => void;
    options: DropdownOption<T>[];
    placeholder?: string;
    disabled?: boolean;
    bordered?: boolean;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
    fieldStyle?: ViewStyle;
    modalTitle?: string;
    showField?: boolean;
    maxSelections?: number;
};

export const FormMultiSelect = forwardRef(function FormMultiSelectInner<T = any>(
    {
        theme,
        value,
        onChange,
        options,
        placeholder = 'Select...',
        disabled = false,
        bordered = false,
        containerStyle,
        textStyle,
        fieldStyle,
        modalTitle = 'Select options',
        showField = true,
        maxSelections,
    }: MultiSelectProps<T>,
    ref: React.Ref<MultiSelectHandle>
) {
    const { theme: contextTheme } = useTheme();
    const activeTheme = theme ?? contextTheme;
    const formStyles = useMemo(() => makeFormStyles(activeTheme), [activeTheme]);
    const [visible, setVisible] = useState(false);
    const [height, setHeight] = useState(0);
    const opacity = useRef(new Animated.Value(0)).current;
    const sheetY = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
        open: () => {
            if (!disabled) {
                setVisible(true);
            }
        },
        close: () => {
            animateOutAnd(() => setVisible(false));
        },
    }));

    useEffect(() => {
        if (!visible) {
            return;
        }
        opacity.setValue(0);
        sheetY.setValue(height || 200);
        const easeOut = Easing.out(Easing.cubic);
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 180, easing: easeOut, useNativeDriver: true }),
            Animated.timing(sheetY, { toValue: 0, duration: 220, easing: easeOut, useNativeDriver: true }),
        ]).start();
    }, [visible, height, opacity, sheetY]);

    const animateOutAnd = (cb: () => void) => {
        const easeIn = Easing.in(Easing.cubic);
        Animated.parallel([
            Animated.timing(opacity, { toValue: 0, duration: 160, easing: easeIn, useNativeDriver: true }),
            Animated.timing(sheetY, { toValue: height || 200, duration: 160, easing: easeIn, useNativeDriver: true }),
        ]).start(({ finished }) => finished && cb());
    };

    const open = () => {
        if (disabled) {
            return;
        }
        setVisible(true);
    };

    const close = () => animateOutAnd(() => setVisible(false));

    const toggleValue = (val: T) => {
        const exists = value.some((v) => v === val);
        if (exists) {
            onChange(value.filter((v) => v !== val));
            return;
        }
        if (maxSelections && value.length >= maxSelections) {
            return;
        }
        onChange([...value, val]);
    };

    const selectedOptions = options.filter((opt) => value.some((v) => v === opt.value));

    return (
        <>
            {showField ? (
                <TouchableOpacity
                    style={[
                        styles.field,
                        activeTheme.utils.pxsm,
                        bordered && [{ borderWidth: 1, borderColor: activeTheme.colors.border }, formStyles.input, activeTheme.utils.pxmd],
                        fieldStyle,
                        containerStyle,
                        disabled && formStyles.inputDisabled,
                    ]}
                    onPress={open}
                    disabled={disabled}>
                    {selectedOptions.length > 0 ? (
                        <View style={styles.chips}>
                            {selectedOptions.map((opt) => (
                                <View key={String(opt.value)} style={[formStyles.chip, { backgroundColor: activeTheme.colors.background }]}
                                >
                                    <Text style={[formStyles.chipText, textStyle, { color: activeTheme.colors.text }]} numberOfLines={1}>
                                        {opt.selectedText ?? opt.label}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text
                            style={[
                                { color: activeTheme.colors.text },
                                activeTheme.typography.variants.placeholder,
                                textStyle,
                            ]}
                            numberOfLines={1}>
                            {placeholder}
                        </Text>
                    )}
                    <Text style={[formStyles.chevron, textStyle]}>▼</Text>
                </TouchableOpacity>
            ) : null}
            <Modal visible={visible} transparent animationType="none" onRequestClose={close}>
                <Pressable style={activeTheme.styles.backdropHitbox} onPress={close}>
                    <Animated.View style={[activeTheme.styles.backdrop, { opacity }]} />
                </Pressable>
                <Animated.View
                    onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
                    style={[
                        styles.dropdown,
                        activeTheme.utils.pblg,
                        { transform: [{ translateY: sheetY }], backgroundColor: activeTheme.colors.background },
                    ]}>
                    <View style={[styles.dropdownHeader, activeTheme.utils.pxmd, activeTheme.utils.pymd]}>
                        <Text style={[styles.dropdownHeaderText, { color: activeTheme.colors.text }]}>{modalTitle}</Text>
                        <TouchableOpacity onPress={close}>
                            <Text style={{ color: activeTheme.colors.link, fontWeight: '600' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        keyboardShouldPersistTaps="handled"
                        data={options}
                        keyExtractor={(_, idx) => String(idx)}
                        renderItem={({ item }) => {
                            const selected = value.some((v) => v === item.value);
                            return (
                                <TouchableOpacity
                                    style={[
                                        activeTheme.styles.row,
                                        activeTheme.styles.rowSpaceBetween,
                                        activeTheme.utils.pymd,
                                        activeTheme.utils.pxmd,
                                        selected && activeTheme.styles.rowSelected,
                                    ]}
                                    onPress={() => toggleValue(item.value)}>
                                    <View style={activeTheme.styles.rowLeft}>
                                        <Text style={[activeTheme.styles.rowLabel, { color: activeTheme.colors.text }]}>{item.label}</Text>
                                        {!!item.description && (
                                            <Text style={[activeTheme.styles.rowDesc, { color: activeTheme.colors.muted }]}>{item.description}</Text>
                                        )}
                                    </View>
                                    <Text style={{ color: selected ? activeTheme.colors.primary : activeTheme.colors.muted }}>
                                        {selected ? 'Selected' : ' '}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }} />
                </Animated.View>
            </Modal>
        </>
    );
}) as <T = any>(p: MultiSelectProps<T> & { ref?: React.Ref<MultiSelectHandle> }) => React.ReactElement;

const styles = StyleSheet.create({
    field: {
        minHeight: 44,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1,
    },
    dropdown: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        maxHeight: '60%',
    },
    dropdownHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#CCC',
    },
    dropdownHeaderText: {
        fontWeight: '600',
        fontSize: 16,
    },
});

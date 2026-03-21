// cuztomisable/components/BottomNav.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ButtonIcon } from '../components/icon';
import { useTheme } from '../contexts/ThemeContext';

import { Dropdown, type DropdownHandle, type DropdownOption } from '../components/form/Dropdown';

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type BottomNavItem = {
    key: string;
    route: string;
    icon: IconName;
    position?: 'left' | 'right';
};

type Props = {
    items: BottomNavItem[];
    actions?: DropdownOption<string>[];
    plusTitle?: string;
    plusActionRoute?: string;
    plusActionRoutes?: Record<string, string>;
    enablePlusDropdown?: boolean;
    activeKey?: string;
    dropdownKey?: string;
    dropdownOptions?: DropdownOption<string>[];
    dropdownTitle?: string;
};

export const BottomNav: React.FC<Props> = ({
    items,
    actions = [] as DropdownOption<string>[],
    plusTitle = 'Quick actions',
    plusActionRoute,
    plusActionRoutes,
    enablePlusDropdown = true,
    activeKey,
    dropdownKey,
    dropdownOptions = [] as DropdownOption<string>[],
    dropdownTitle = 'Select an option',
}) => {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const frozenBottomInset = useMemo(() => insets.bottom, []);
    const navHeight = useMemo(() => 66 + frozenBottomInset, [frozenBottomInset]);
    const plusDropdownRef = useRef<DropdownHandle>(null);
    const navDropdownRef = useRef<DropdownHandle>(null);
    const safeItems = useMemo(() => (items ?? []).slice(0, 6), [items]);
    const showPlusDropdown = enablePlusDropdown && actions.length > 0;
    const showPlus = showPlusDropdown || !!plusActionRoute || !!plusActionRoutes;
    const showNavDropdown = !!dropdownKey && dropdownOptions.length > 0;

    const leftItems = useMemo(
        () => safeItems.filter(i => (i.position ?? 'left') !== 'right'),
        [safeItems]
    );
    const rightItems = useMemo(
        () => safeItems.filter(i => (i.position ?? 'left') === 'right'),
        [safeItems]
    );

    const go = (path: string) => router.push(path as any);
    const resolvePlusRoute = () => {
        if (activeKey && plusActionRoutes?.[activeKey]) {
            return plusActionRoutes[activeKey];
        }
        return plusActionRoute;
    };
    const handleItemPress = (item: BottomNavItem) => {
        if (showNavDropdown && item.key === dropdownKey) {
            navDropdownRef.current?.open();
            return;
        }
        go(item.route);
    };

    return (
        (leftItems.length > 0 || rightItems.length > 0 || showPlus ?
        <View style={[theme.styles.positionRelative, { height: navHeight }]}>
            {showNavDropdown && (
                <Dropdown
                    ref={navDropdownRef}
                    theme={theme}
                    showField={false}
                    modalTitle={dropdownTitle}
                    options={dropdownOptions}
                    onSelect={(route) => go(route)} />
            )}
            {showPlus && (
                showPlusDropdown ? (
                    <Dropdown
                        ref={plusDropdownRef}
                        theme={theme}
                        showField={false}
                        modalTitle={plusTitle}
                        options={actions}
                        onSelect={(route) => go(route)} />
                ) : null
            )}
            <View
                style={[
                theme.styles.container,
                theme.styles.background,
                {
                    height: navHeight,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingBottom: frozenBottomInset,
                },
            ]}>
                {showPlus ? (
                    <View style={[theme.styles.flex, theme.styles.row, theme.styles.alignCenter, theme.styles.rowSpaceBetween]}>
                        <View style={[theme.styles.flex, theme.styles.alignCenter]}>
                            <View style={[theme.styles.row, theme.styles.alignCenter, {gap: 24}]}>
                                {leftItems.map(item => (
                                    <ButtonIcon
                                        key={item.key}
                                        icon={item.icon}
                                        color={theme.colors.text}
                                        onPress={() => handleItemPress(item)} />
                                    ))}
                            </View>
                        </View>
                        <View style={{ width: 64 }} />
                        <View style={[theme.styles.flex, theme.styles.alignCenter]}>
                            <View style={[theme.styles.row, theme.styles.alignCenter, {gap: 24}]}>
                                {rightItems.map(item => (
                                    <ButtonIcon
                                        key={item.key}
                                        icon={item.icon}
                                        color={theme.colors.text}
                                        onPress={() => handleItemPress(item)} />
                                    ))}
                            </View>
                        </View>
                        <View style={[styles.fabWrap, theme.styles.alignCenter, theme.styles.positionAbsolute]} pointerEvents="box-none">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => {
                                    if (showPlusDropdown) {
                                        plusDropdownRef.current?.open();
                                    } else {
                                        const route = resolvePlusRoute();
                                        if (route) {
                                            go(route);
                                        }
                                    }
                                }}
                                style={[
                                    styles.fab,
                                    theme.utils.circle64,
                                    theme.styles.alignCenter,
                                    theme.styles.justifyCenter,
                                    {
                                        backgroundColor: theme.colors.primary,
                                        borderColor: theme.colors.border,
                                    },
                                ]}>
                                <MaterialCommunityIcons name="plus" size={28} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={[theme.styles.flex, theme.styles.row, theme.styles.alignCenter, theme.styles.rowSpaceEvenly]}>
                        {safeItems.map(item => (
                            <ButtonIcon
                                key={item.key}
                                icon={item.icon}
                                color={theme.colors.text}
                                onPress={() => handleItemPress(item)} />
                            ))}
                    </View>
                )}
            </View>
        </View> : null)
    );
};

const styles = StyleSheet.create({
    fabWrap: {
        left: 0,
        right: 0,
        top: -16,
    },
    fab: {
        borderWidth: 1,
    },
});

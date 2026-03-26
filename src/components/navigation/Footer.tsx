import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '../../providers/ThemeProvider';

import { Dropdown, type DropdownHandle, type DropdownOption } from '../../components/form/Dropdown';

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export type FooterNavItem = {
	key: string;
	route: string;
	icon: IconName;
	position?: 'left' | 'right';
};

type Props = {
	items: FooterNavItem[];
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

export const Footer: React.FC<Props> = ({
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
	const theme = useTheme();
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
	const handleItemPress = (item: FooterNavItem) => {
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
					borderTopColor: theme.color.border,
					borderTopWidth: 1,
					paddingBottom: frozenBottomInset,
				},
			]}>
				{showPlus ? (
					<View style={[theme.styles.flex, theme.styles.row, theme.styles.alignCenter, theme.styles.rowSpaceBetween]}>
						<View style={[theme.styles.flex, theme.styles.alignCenter]}>
							{/* ...rest of the BottomNav rendering logic... */}
						</View>
					</View>
				) : null}
			</View>
		</View>
		: null)
	);
};
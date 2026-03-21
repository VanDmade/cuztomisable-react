import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigationHistory } from '../hooks/useNavigationHistory';

type Props = {
    title?: string;
    logo?: boolean;
    settings?: boolean;
    back?: boolean;
    logoSource?: any;
    backImageSource?: any;
    profileImageSource?: any;
};

export const TopNav: React.FC<Props> = ({
    title = null,
    logo = false,
    settings = false,
    back = false,
    logoSource,
    backImageSource,
    profileImageSource,
}) => {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { pathname } = useNavigationHistory();
    const { user } = useAuth();

    const goToHome = () => {
        if (pathname != '/drinks') {
            router.push('/(tabs)/drinks');
        }
    };
    const goToSettings = () => router.push('/(settings)');
    const goBack = () => router.back();

    return (
        <View style={[
            theme.styles.container,
            theme.styles.row,
            theme.styles.rowSpaceBetween,
            theme.styles.alignCenter,
            theme.styles.background,
            theme.utils.ptlg,
            theme.utils.pxmd,
            {
            height: (66 + insets.top),
            borderBottomColor: theme.colors.border,
            borderBottomWidth: 1,
            },
        ]}>
            <View style={[ theme.styles.row, theme.styles.alignCenter ]}>
                <TouchableOpacity onPress={goToHome} activeOpacity={0.8}>
                    {logo ? (<Image
                        source={logoSource}
                        style={styles.item}
                        resizeMode="contain" />) : (<></>)}
                </TouchableOpacity>
                <TouchableOpacity onPress={goBack} activeOpacity={0.8}>
                    {back ? (<Image
                        source={backImageSource}
                        style={styles.item}
                        resizeMode="cover" />) : (<></>)}
                </TouchableOpacity>
                <Text style={[theme.typography.variants.title, theme.utils.plsm]}>{title}</Text>
            </View>
            <View style={[ theme.styles.row, theme.styles.alignCenter ]}>
                <TouchableOpacity onPress={goToSettings} activeOpacity={0.8}>
                    {settings ? (<Image
                        source={user?.image ? {uri: user.image} : profileImageSource}
                        style={[styles.item, {borderColor: theme.colors.primary, borderWidth: 1}]}
                        resizeMode="cover" />
                        ) : null}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    item: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});

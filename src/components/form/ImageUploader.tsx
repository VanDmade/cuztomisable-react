// src/components/form/ImageUploader.tsx
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useMemo } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { makeFormStyles } from './styles';

type Props = {
    theme?: ReturnType<typeof import('../../theme/theme').createTheme>;
    value?: string | string[] | null;
    onChange: (uri: string | string[] | null) => void;
    size?: number;
    circle?: boolean;
    square?: boolean;
    label?: string;
    multiple?: boolean;
    maxSelections?: number;
    allowCamera?: boolean;
    thumbnail?: string | null;
    onThumbnailChange?: (uri: string | null) => void;
    defaultImageSource?: any;
};

export const ImageUploader: React.FC<Props & { defaultImageSource: any }> = ({
    theme,
    value,
    onChange,
    size = 120,
    circle = true,
    square = true,
    label = null,
    multiple = false,
    maxSelections,
    allowCamera = true,
    thumbnail = null,
    onThumbnailChange,
    defaultImageSource,
}) => {
    const activeTheme = theme ?? useTheme();
    const formStyles = useMemo(() => makeFormStyles(activeTheme), [activeTheme]);
    const defaultImage = defaultImageSource;
    const valueList = useMemo(() => {
        if (!value) {
            return [] as string[];
        }
        return Array.isArray(value) ? value : [value];
    }, [value]);
    const isMulti = multiple || Array.isArray(value);
    const effectiveThumbnail = thumbnail ?? (valueList[0] ?? null);
    const askForPermission = useCallback(async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need access to your photos so you can upload a profile image.');
            return false;
        }
        return true;
    }, []);

    const handleRemoveImage = useCallback(async () => {
        onChange(null);
    }, [onChange]);

    const handleRemoveAt = useCallback((uri: string) => {
        const next = valueList.filter((item) => item !== uri);
        onChange(isMulti ? next : (next[0] ?? null));
        if (effectiveThumbnail === uri) {
            onThumbnailChange?.(next[0] ?? null);
        }
    }, [valueList, onChange, isMulti, effectiveThumbnail, onThumbnailChange]);

    const handlePickImage = useCallback(async () => {
        const ok = await askForPermission();
        if (!ok) {
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.9,
            ...(square ? { aspect: [1, 1] } : {}),
            ...(isMulti ? { allowsMultipleSelection: true } : {}),
            ...(isMulti && maxSelections ? { selectionLimit: maxSelections } : {}),
        });
        if (!result.canceled) {
            const uris = result.assets.map((asset) => asset.uri).filter(Boolean);
            if (isMulti) {
                const combined = [...valueList, ...uris].filter((item, idx, arr) => arr.indexOf(item) === idx);
                onChange(combined);
                if (!effectiveThumbnail && combined[0]) {
                    onThumbnailChange?.(combined[0]);
                }
            } else {
                const uri = uris[0] ?? null;
                onChange(uri);
            }
        }
    }, [askForPermission, onChange, square, isMulti, valueList, maxSelections, effectiveThumbnail, onThumbnailChange]);

    const handleTakePhoto = useCallback(async () => {
        if (!allowCamera) {
            return;
        }
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission required', 'We need camera access so you can take a profile photo.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.9,
            ...(square ? { aspect: [1, 1] } : {}),
        });
        if (!result.canceled) {
            const uri = result.assets[0]?.uri ?? null;
            if (isMulti && uri) {
                const combined = [...valueList, uri].filter((item, idx, arr) => arr.indexOf(item) === idx);
                onChange(combined);
                if (!effectiveThumbnail && combined[0]) {
                    onThumbnailChange?.(combined[0]);
                }
            } else {
                onChange(uri);
            }
        }
    }, [onChange, allowCamera, square, isMulti, valueList, effectiveThumbnail, onThumbnailChange]);

    return (
        <View style={[activeTheme.styles.alignCenter]}>
            {isMulti ? (
                <View style={styles.grid}>
                    {valueList.length === 0 ? (
                        <Image
                            source={defaultImage}
                            style={{
                                width: size,
                                height: size,
                                borderRadius: circle ? (size / 2) : 8,
                                borderWidth: 1,
                                borderColor: activeTheme.color.border,
                            }} />
                    ) : (
                        valueList.map((uri) => (
                            <View key={uri} style={styles.gridItem}>
                                <Image
                                    source={{ uri }}
                                    style={{
                                        width: size,
                                        height: size,
                                        borderRadius: circle ? (size / 2) : 8,
                                        borderWidth: 1,
                                        borderColor: activeTheme.color.border,
                                    }} />
                                <Pressable
                                    onPress={() => handleRemoveAt(uri)}
                                    style={[{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        backgroundColor: activeTheme.color.primary,
                                    }, activeTheme.utils.circle28, activeTheme.styles.alignCenter, activeTheme.styles.justifyCenter]}>
                                    <Text style={{ color: 'white', fontSize: 18, lineHeight: 18 }}>×</Text>
                                </Pressable>
                                {onThumbnailChange ? (
                                    <Pressable
                                        onPress={() => onThumbnailChange(uri)}
                                        style={[styles.thumbBadge, { backgroundColor: activeTheme.color.primary }]}
                                    >
                                        <Text style={styles.thumbBadgeText}>
                                            {effectiveThumbnail === uri ? 'Thumbnail' : 'Set Thumbnail'}
                                        </Text>
                                    </Pressable>
                                ) : null}
                            </View>
                        ))
                    )}
                </View>
            ) : (
                <View>
                    <Image
                        source={valueList[0] ? { uri: valueList[0] } : defaultImage}
                        style={{
                            width: size,
                            height: size,
                            borderRadius: circle ? (size / 2) : 0,
                            borderWidth: 1,
                            borderColor: activeTheme.color.border,
                        }} />
                    {valueList[0] && (
                        <Pressable
                            onPress={handleRemoveImage}
                            style={[{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                backgroundColor: activeTheme.color.primary,
                            }, activeTheme.utils.circle28, activeTheme.styles.alignCenter, activeTheme.styles.justifyCenter]}>
                            <Text style={{ color: 'white', fontSize: 18, lineHeight: 18 }}>×</Text>
                        </Pressable>
                    )}
                </View>
            )}
            <View style={[activeTheme.utils.mtsm, styles.actionRow]}>
                <Pressable onPress={handlePickImage}><Text style={[activeTheme.typography.variants.link]}>Select From Gallery</Text></Pressable>
                {allowCamera ? (
                    <Pressable onPress={handleTakePhoto}><Text style={[activeTheme.typography.variants.link]}>Take Photo</Text></Pressable>
                ) : null}
            </View>
            {label ? (<Text style={[activeTheme.utils.mtsm, formStyles.helper]}>{label}</Text>) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    gridItem: {
        margin: 6,
    },
    thumbBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        right: 6,
        paddingVertical: 4,
        paddingHorizontal: 6,
        borderRadius: 10,
        alignItems: 'center',
    },
    thumbBadgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
});
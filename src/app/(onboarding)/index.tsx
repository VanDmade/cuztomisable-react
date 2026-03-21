// src/app/(onboarding)/index.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
} from 'react-native';

import { AppConfig } from '../../app.config';
import { Button, OnboardingSlide } from '../../components';
import { useOnboarding } from '../../hooks/useOnboarding';

const { width } = Dimensions.get('window');
type Slide = {
    image: any;
    title: string;
    subtitle?: string | null;
    description: string;
};
const SLIDES: ReadonlyArray<Slide> = AppConfig.onboarding;

export default function OnboardingScreen() {
    const router = useRouter();
    const listRef = useRef<FlatList<Slide>>(null);
    const [index, setIndex] = useState(0);
    const [skipDisabled, setSkipDisabled] = useState(true);
    const isLast = index === SLIDES.length - 1;
    const { markComplete } = useOnboarding();

    useEffect(() => {
        const timer = setTimeout(() => setSkipDisabled(false), 5000);
        return () => clearTimeout(timer);
    }, [index]);

    const gotoIndex = (i: number) => {
        listRef.current?.scrollToIndex({ index: i, animated: true });
        setIndex(i);
    };

    const onNext = () => {
        if (!isLast) {
            gotoIndex(index + 1);
        } else {
            completeOnboarding();
        }
    };

    const onSkip = () => { completeOnboarding(); };
    const onDone = () => { completeOnboarding(); };

    const completeOnboarding = async () => {
        try {
            await markComplete();
        } catch {
            // ignore storage errors; still navigate
        }
        // Replace with your real post-onboarding route:
        router.replace('/(auth)/login');
    };

    const onMomentumEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const x = e.nativeEvent.contentOffset.x;
        const next = Math.round(x / width);
        if (next !== index) {
            setIndex(next);
        }
    };

    const keyExtractor = (_: Slide, i: number) => `slide-${i}`;

    const renderItem = ({ item }: { item: Slide }) => (
        <View style={{ width }}>
            <OnboardingSlide
                image={item.image}
                title={item.title}
                subtitle={item.subtitle}
                description={item.description} />
        </View>
    );
    const Dots = useMemo(() => (
        <View style={styles.dotsRow} accessibilityRole="tablist">
            {SLIDES.map((_, i) => (
                <View
                    key={`dot-${i}`}
                    style={[styles.dot, i === index && styles.dotActive]}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: i === index }} />
            ))}
        </View>
    ), [index]);
    return (
        <View style={styles.screen}>
            <FlatList
                ref={listRef}
                data={SLIDES}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={onMomentumEnd}
                scrollEventThrottle={16}
                bounces={false} />
            {Dots}
            <View style={styles.footer}>
                {!isLast && !skipDisabled ? (
                    <Button
                        title="Skip"
                        variant="text"
                        onPress={onSkip}
                        testID="btn-skip"
                        containerStyle={styles.skipBtn}
                        align="center" />
                ) : (
                    <View />
                )}
                {!isLast ? (
                    <Button
                        title="Next"
                        variant="solid"
                        onPress={onNext}
                        testID="btn-next"
                        intent="secondary"
                        containerStyle={styles.nextBtn}
                        align="center" />
                ) : (
                    // edge-to-edge Done button: cancel footer padding with negative marginHorizontal
                    <Button
                        title="Done"
                        variant="solid"
                        onPress={onDone}
                        testID="btn-done"
                        containerStyle={styles.nextBtn}
                        align="center" />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    dotsRow: {
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 8,
        marginTop: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.35,
        backgroundColor: '#000',
    },
    dotActive: {
        width: 18,
        opacity: 0.9,
    },
    footer: {
        paddingHorizontal: 48,
        paddingVertical: 16,
        paddingBottom: 48,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    skipBtn: {
        width: '30%',
    },
    nextBtn: {
        flex: 1,
    },
    footerSpacer: {
        height: 40,
    },
    primaryBtn: {
        flex: 1,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
    },
    primaryBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    textBtn: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        minWidth: 124,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        opacity: 0.9,
    },
});

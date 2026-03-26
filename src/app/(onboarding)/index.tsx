// src/app/(onboarding)/index.tsx

import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StyleSheet,
    View,
} from 'react-native';

import { Button } from '../../components';
import { Slide as OnboardingSlide } from '../../components/onboarding/Slide';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useConfig } from '../../providers/ConfigProvider';
import { useTheme } from '../../providers/ThemeProvider';

const { width } = Dimensions.get('window');

type Slide = {
    image: any;
    title: string;
    subtitle?: string | null;
    description: string;
};

export default function OnboardingScreen() {
    const router = useRouter();
    const listRef = useRef<FlatList<Slide>>(null);

    const [index, setIndex] = useState(0);
    const [skipDisabled, setSkipDisabled] = useState(true);

    const { markComplete } = useOnboarding();

    const config = useConfig();
    const { image } = useTheme();

    const slides: Slide[] = useMemo(() => {
        const onboarding = config.onboarding ?? [];

        return onboarding.map((slide) => ({
            ...slide,
            image: image.onboarding?.[slide.image] ?? null,
        }));
    }, [config.onboarding, image]);

    const isLast = index === slides.length - 1;

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

    const onSkip = () => completeOnboarding();
    const onDone = () => completeOnboarding();

    const completeOnboarding = async () => {
        try {
            await markComplete();
        } catch {
            // ignore storage errors
        }
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

    const Dots = useMemo(
        () => (
            <View style={styles.dotsRow} accessibilityRole="tablist">
                {slides.map((_, i) => (
                    <View
                        key={`dot-${i}`}
                        style={[styles.dot, i === index && styles.dotActive]}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: i === index }}
                    />
                ))}
            </View>
        ),
        [index, slides]
    );

    return (
        <View style={styles.screen}>
            <FlatList
                ref={listRef}
                data={slides}
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
                        align="center"
                    />
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
                        align="center"
                    />
                ) : (
                    <Button
                        title="Done"
                        variant="solid"
                        onPress={onDone}
                        testID="btn-done"
                        containerStyle={styles.nextBtn}
                        align="center"
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
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
});
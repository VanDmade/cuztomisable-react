// src/components/onboarding/Slide.tsx

import React from 'react';
import { Image, ImageSourcePropType, Text, View } from 'react-native';

import { useTheme } from '../../providers/ThemeProvider';

type Props = {
    image: ImageSourcePropType;
    title: string;
    subtitle?: string | null;
    description: string;
};

export const Slide: React.FC<Props> = (props) => {
    const { image, title, subtitle, description } = props;
    const { color, styles, typography, utils } = useTheme();

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor: color.background,
                    paddingHorizontal: 24,
                },
            ]}>
            {image && (
                <Image
                    source={image}
                    style={[
                        {
                            width: 240,
                            height: 240,
                        },
                        styles.alignSelfCenter,
                        utils.mbmd,
                    ]}
                    resizeMode="contain"
                />
            )}
            <Text
                style={[
                    typography.variants.title,
                    styles.textCenter,
                    utils.mbsm,
                ]}>
                {title}
            </Text>
            {subtitle && (
                <Text
                    style={[
                        typography.variants.subtitle,
                        styles.textCenter,
                        utils.mbsm,
                    ]}>
                    {subtitle}
                </Text>
            )}
            <Text
                style={[
                    typography.variants.body,
                    styles.textCenter,
                    { color: color.muted },
                ]}>
                {description}
            </Text>
        </View>
    );
};
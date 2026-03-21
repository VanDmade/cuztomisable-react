// src/components/list/Title.tsx
import React from 'react';
import { Text, View } from 'react-native';

import { useTheme } from '../../contexts/ThemeContext';

type Props = {
    title: string;
    subtitle?: string;
};

export const ListTitle: React.FC<Props> = ({
    title,
    subtitle,
}) => {
    const { theme } = useTheme();
    return (
        <View style={{backgroundColor: theme.colors.border}}>
            <Text
                style={[
                    theme.utils.pysm,
                    theme.utils.pxmd,
                    {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.xs,
                        letterSpacing: 0.8,
                    }
                ]}>{title}</Text>
            {subtitle ? (
                <Text style={{fontSize: theme.typography.sizes.xxs}}>{subtitle}</Text>
            ) : null}
        </View>
    );
};

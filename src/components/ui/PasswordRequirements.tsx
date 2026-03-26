// src/components/ui/PasswordRequirements.tsx

import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useConfig } from '../../providers/ConfigProvider';
import { useTheme } from '../../providers/ThemeProvider';
import { validatePassword } from '../../utils/validators/validatePassword';

type Props = {
    password: string;
};

export const PasswordRequirements: React.FC<Props> = ({ password }) => {
    const { color, styles, utils } = useTheme();
    const config = useConfig();

    const results = useMemo(
        () => validatePassword(password, config.passwordRequirements),
        [password, config.passwordRequirements]
    );

    const policy = config.passwordRequirements;
    const { minimum, maximum, numbers, symbols, lowercase, uppercase } = policy;

    const RequirementRow = ({ ok, label }: { ok: boolean; label: string }) => (
        <View style={[styles.row, styles.rowSpaceBetween]}>
            <MaterialCommunityIcons
                name={ok ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                size={20}
                color={ok ? color.success : color.text}
            />
            <Text
                style={[
                    styles.flex,
                    utils.mlsm,
                    { color: ok ? color.success : color.text },
                ]}
            >
                {label}
            </Text>
        </View>
    );

    return (
        <View>
            <RequirementRow
                ok={results.lengthMinOk && results.lengthMaxOk}
                label={
                    maximum
                        ? `Between ${minimum}-${maximum} characters`
                        : `At least ${minimum} characters`
                }
            />

            {numbers > 0 && (
                <RequirementRow
                    ok={results.numbersOk}
                    label={
                        numbers === 1
                            ? 'Contains a number'
                            : `Contains ${numbers}+ numbers`
                    }
                />
            )}

            {symbols > 0 && (
                <RequirementRow
                    ok={results.symbolsOk}
                    label={
                        symbols === 1
                            ? 'Contains a symbol'
                            : `Contains ${symbols}+ symbols`
                    }
                />
            )}

            {lowercase > 0 && (
                <RequirementRow
                    ok={results.lowercaseOk}
                    label={
                        lowercase === 1
                            ? 'Contains a lowercase letter'
                            : `Contains ${lowercase}+ lowercase letters`
                    }
                />
            )}

            {uppercase > 0 && (
                <RequirementRow
                    ok={results.uppercaseOk}
                    label={
                        uppercase === 1
                            ? 'Contains an uppercase letter'
                            : `Contains ${uppercase}+ uppercase letters`
                    }
                />
            )}
        </View>
    );
};
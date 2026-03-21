// src/components/PasswordRequirements.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { AppConfig } from '../app.config';
import { Theme } from '../theme/theme';
import { validatePassword } from '../utils/validators/validatePassword';

type Props = {
    password: string;
    theme: Theme;
};

export const PasswordRequirements: React.FC<Props> = ({ password, theme }) => {
    const results = useMemo(() => validatePassword(password), [password]);
    const policy = AppConfig.passwordRequirements;
    const { minimum, maximum, numbers, symbols, lowercase, uppercase } = policy;
    const RequirementRow = ({ ok, label }: { ok: boolean; label: string; }) => (
        <View style={[theme.styles.row, theme.styles.rowSpaceBetween]}>
            <MaterialCommunityIcons
                name={ok ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
                size={20}
                color={ok ? theme.colors.success : theme.colors.text} />
            <Text style={[theme.styles.flex, theme.utils.mlsm, { color: ok ? theme.colors.success : theme.colors.text }]}>
                {label}
            </Text>
        </View>
    );
    return (
        <View>
            <RequirementRow
                ok={results.lengthMinOk && results.lengthMaxOk}
                label={ maximum ? `Between ${minimum}-${maximum} characters` : `At least ${minimum} characters` } />
            {numbers > 0 && (
                <RequirementRow
                    ok={results.numbersOk}
                    label={ numbers === 1 ? 'Contains a number' : `Contains ${numbers}+ numbers` } />
            )}
            {symbols > 0 && (
                <RequirementRow
                    ok={results.symbolsOk}
                    label={ symbols === 1 ? 'Contains a symbol' : `Contains ${symbols}+ symbols` } />
            )}
            {lowercase > 0 && (
                <RequirementRow
                    ok={results.lowercaseOk}
                    label={ lowercase === 1 ? 'Contains a lowercase letter' : `Contains ${lowercase}+ lowercase letters` } />
            )}
            {uppercase > 0 && (
                <RequirementRow
                    ok={results.uppercaseOk}
                    label={ uppercase === 1 ? 'Contains an uppercase letter' : `Contains ${uppercase}+ uppercase letters` } />
            )}
        </View>
    );
};

// src/app/(settings)/about.tsx
import React from 'react';
import { Text, View } from 'react-native';

import { AppConfig } from '../../app.config';
import { FormHeader, FormScreen } from '../../components';
import { useTheme } from '../../contexts/ThemeContext';

export default function AboutScreen({ logoSource }: { logoSource: any }) {
    const { theme } = useTheme();
    const baseText = { color: theme.colors.text };

    return (
        <FormScreen paddingTop="20">
            {() => (
                <View style={[theme.styles.container, theme.styles.background, theme.utils.pxmd]}>
                    <FormHeader
                        theme={theme}
                        title={`About ${AppConfig.appName}`} 
                        subtitle="Built to save you time. Designed to scale."
                        logoSource={logoSource} />
                    <View style={theme.styles.form}>
                        <Text style={baseText}>Cuztomisable is a flexible, developer-focused framework designed to help teams spin up complete user
                        and role-management systems in minutes instead of weeks. Built on a modern Laravel backend and crafted
                        for real-world SaaS needs, Cuztomisable lets you define your entire authentication flow, permissions,
                        roles, UI elements, and settings through a simple configuration file. It generates consistent, secure,
                        and production-ready screens, APIs, and logic for login, registration, MFA, password resets, company-level
                        enforcement rules, and more—while remaining fully customizable at every layer. Whether you’re building a
                        new project or standardizing auth across multiple apps, Cuztomisable gives you a clean, extendable
                        foundation that saves time, reduces repeated boilerplate, and scales with your product.</Text>
                    </View>
                </View>
            )}
        </FormScreen>
    );
}

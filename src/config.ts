// cuztomisable/config.ts
// Utility to merge user config with package default config

import { AppConfig, AppConfigType } from './defaultConfig';

/**
 * Deep merge two config objects. User config overrides defaults.
 * Only shallow merge for simplicity; can be extended for deep merge.
 */
export function mergeConfig(userConfig: Partial<AppConfigType>): AppConfigType {
    return {
        ...AppConfig,
        ...userConfig,
        passwordRequirements: {
            ...AppConfig.passwordRequirements,
            ...(userConfig.passwordRequirements || {})
        },
        colors: {
            ...AppConfig.colors,
            ...(userConfig.colors || {})
        },
        spacing: {
            ...AppConfig.spacing,
            ...(userConfig.spacing || {})
        },
        typography: {
            ...AppConfig.typography,
            ...(userConfig.typography || {})
        },
        layout: {
            ...AppConfig.layout,
            ...(userConfig.layout || {})
        },
        features: {
            ...AppConfig.features,
            ...(userConfig.features || {})
        },
        navigation: {
            ...AppConfig.navigation,
            ...(userConfig.navigation || {})
        },
    };
}

// Usage example (in user app):
// import { mergeConfig, AppConfig } from 'cuztomisable/config';
// const myConfig = mergeConfig({ appName: 'MyApp', colors: { light: { primary: '#000' } } });

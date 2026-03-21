// cuztomisable/app.config.ts
// Application configuration and constants.
export type ThemeMode = 'light' | 'dark';

export const AppConfig = {
    assets: {
        logo: 'assets/images/logo.png',
        profile: 'assets/images/profile.png',
        loading: 'assets/images/loading.png',
        back: 'assets/images/back.png',
    },
    appName: 'Cuztomisable',
    version: 'v1.0',
    locale: 'en-US',
    defaultTheme: 'light' as ThemeMode,
    supportEmail: 'michaelvanderwerkerllc@gmail.com',
    privacyPolicyLastUpdated: '11/21/2025',
    baseUrl: 'http://192.168.10.147:8000/api/',
    followSystemTheme: true,
    passwordRequirements: {
        numbers: 1,
        symbols: 1,
        minimum: 6,
        maximum: null,
        lowercase: 1,
        uppercase: 1,
    },
    countries: [
        { label: 'United States & Canada', code: 'US', dialCode: 1 },
        { label: 'United Kingdom', code: 'GB', dialCode: 44 },
        { label: 'Australia', code: 'AU', dialCode: 61 },
    ],
    colors: {
        light: {
            primary: '#F97316',
            secondary: '#9A3412',
            accent: '#FB923C',
            ternary: '#3B82F6',
            danger: '#C62828',
            success: '#4CAF50',
            info: '#0284C7',
            warning: '#DC6A00',
            light: '#FFF8F3',
            background: '#FFFFFF',
            surface: '#FFFFFF',
            text: '#1A1A1A',
            muted: '#6B6B6B',
            white: '#FFFFFF',
            border: '#E6E6E6',
            link: '#0A66C2',
        },
        dark: {
            primary: '#F97316',
            secondary: '#FB923C',
            accent: '#FFB777',
            ternary: '#4A2A1C',
            danger: '#EF5350',
            success: '#81C784',
            info: '#29B6F6',
            warning: '#FFB74D',
            light: '#2A2A2A',
            background: '#121212',
            surface: '#1E1E1E',
            text: '#F1F1F1',
            muted: '#6B6B6B',
            white: '#FFFFFF',
            border: '#3A3A3A',
            link: '#64B5F6',
        },
    },
    spacing: {
        base: 8,
        screenPadding: 20,
    },
    typography: {
        fontFamily: {
            regular: 'System',
            bold: 'System',
        },
        sizes: {
            xxs: 10,
            xs: 12,
            sm: 16,
            md: 20,
            lg: 24,
            xl: 32,
            xxl: 36,
        },
        weights: {
            light: '300',
            regular: '400',
            medium: '500',
            bold: '700',
        },
    },
    layout: {
        radius: {
            sm: 4,
            md: 8,
            lg: 16,
            pill: 9999,
        },
    },
    features: {
        enableAdvancedRoles: true,
        debugMode: __DEV__,
    },
    onboarding: [
        {
            image: 'assets/images/onboarding/slide1.png',
            title: 'Welcome to Cuztomisable',
            subtitle: null,
            description: 'Build powerful apps with a streamlined foundation designed to help you launch faster than ever.',
        },
        {
            image: 'assets/images/onboarding/slide2.png',
            title: 'Idea to Product — Fast',
            subtitle: null,
            description: 'Turn concepts into real, working features in record time with tools built for rapid development.',
        },
        {
            image: 'assets/images/onboarding/slide3.png',
            title: 'Configure Everything',
            subtitle: 'Endless customization',
            description: 'A simple, flexible config file gives you control over authentication, roles, UI flows, and more. No boilerplate required.',
        },
        {
            image: 'assets/images/onboarding/slide4.png',
            title: 'Build Your Product, Not the Plumbing',
            subtitle: null,
            description: 'Skip repetitive setup like auth, user management, and permissions — Cuztomisable handles it for you.',
        },
        {
            image: 'assets/images/onboarding/slide5.png',
            title: 'Seamless Experience for Your Users',
            subtitle: null,
            description: 'Every screen is designed to be responsive, intuitive, and lightning-fast — right out of the box.',
        },
    ],
    navigation: {
        items: [
            { key: 'drinks', route: '/(tabs)/drinks', icon: 'glass-cocktail', position: 'left' },
            { key: 'ingredients', route: '/(tabs)/ingredients', icon: 'food-apple-outline', position: 'left' },
            { key: 'shopping', route: '/(tabs)/shopping-list', icon: 'clipboard-list-outline', position: 'right' },
            { key: 'bar-management', route: '/(tabs)/bar-management', icon: 'glass-wine', position: 'right' },
        ],
        enablePlusDropdown: false,
        plusActionRoute: '/(tabs)/drinks/form',
        plusActionRoutes: {
            drinks: '/(tabs)/drinks/form',
            ingredients: '/(tabs)/ingredients/form',
            glassware: '/(tabs)/glassware/form',
            equipment: '/(tabs)/equipment/form',
        },
        plusTitle: 'Form',
        actions: [
            { label: 'Drink form', value: '/(tabs)/drinks/form' },
            { label: 'Ingredient form', value: '/(tabs)/ingredients/form' },
            { label: 'Glassware form', value: '/(tabs)/glassware/form' },
            { label: 'Equipment form', value: '/(tabs)/equipment/form' },
        ],
        dropdown: {
            key: 'ingredients',
            title: 'Quick Links',
            options: [
                { label: 'Ingredients', value: '/(tabs)/ingredients' },
                { label: 'Glassware', value: '/(tabs)/glassware' },
                { label: 'Equipment', value: '/(tabs)/equipment' },
            ],
        },
    },
} as const;

export type AppConfigType = typeof AppConfig;

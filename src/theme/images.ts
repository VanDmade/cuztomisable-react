// src/theme/images.ts

export const imageDefault = {
    onboarding: {
        slide1: require('../../assets/images/onboarding/slide1.png'),
        slide2: require('../../assets/images/onboarding/slide2.png'),
        slide3: require('../../assets/images/onboarding/slide3.png'),
        slide4: require('../../assets/images/onboarding/slide4.png'),
        slide5: require('../../assets/images/onboarding/slide5.png'),
    },

    logo: require('../../assets/images/logo.png'),
    profile: require('../../assets/images/profile.png'),
    back: require('../../assets/images/back.png'),
    settings: require('../../assets/images/settings.png'),
    loading: require('../../assets/images/loading.png'),
} as const;

export type Images = typeof imageDefault;
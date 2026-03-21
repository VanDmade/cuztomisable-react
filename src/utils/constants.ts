// Hard constants & app enums (not user-editable "config")
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  themeOverride: 'theme_override', // 'light' | 'dark' | 'system'
} as const;

export const ROUTES = {
  tabs: '/(tabs)',
  login: '/(auth)/login',
  register: '/(auth)/register',
  forgot: '/(auth)/forgot',
  settings: '/(protected)/settings',
} as const;

export const LIMITS = {
  passwordMin: 8,
  passwordMax: 128,
  nameMax: 80,
  noteMax: 5000,
} as const;

export const REGEX = {
  email:
    // RFC 5322-ish, pragmatic
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phoneDigits: /^\+?[0-9]{7,15}$/,
  // at least one letter and one number
  passwordSimple: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,
} as const;

export const EVENTS = {
  userLoggedIn: 'user:logged_in',
  userLoggedOut: 'user:logged_out',
} as const;

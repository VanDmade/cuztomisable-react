// api/api.ts
import axios from 'axios';
import { Platform } from 'react-native';

import { AppConfig } from '../app.config';
import { attachInterceptors } from './interceptors';

// Derived values
const APP_NAME = AppConfig.appName;
const APP_VERSION = AppConfig.version;
const DEVICE_TYPE = Platform.OS === 'android' ? 'Android' : (Platform.OS === 'ios' ? 'iOS' : 'Other');

export const api = axios.create({
  baseURL: AppConfig.baseUrl,
  headers: {
    'X-App-Platform': 'mobile',
    'User-Agent': `${APP_NAME}/${APP_VERSION} (${DEVICE_TYPE})`,
    Accept: 'application/json',
  },
});

attachInterceptors(api);
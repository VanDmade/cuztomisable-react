// api/api.ts

import axios, { AxiosInstance } from 'axios';
import { Platform } from 'react-native';
import { attachInterceptors } from './interceptors';

export type ApiConfig = {
    baseUrl: string;
    appName: string;
    version: string;
};

export function createApi(config: ApiConfig): AxiosInstance {
    const DEVICE_TYPE =
        Platform.OS === 'android'
            ? 'Android'
            : Platform.OS === 'ios'
            ? 'iOS'
            : 'Other';

    const api = axios.create({
        baseURL: config.baseUrl,
        headers: {
            'X-App-Platform': 'mobile',
            'User-Agent': `${config.appName}/${config.version} (${DEVICE_TYPE})`,
            Accept: 'application/json',
        },
    });

    attachInterceptors(api);

    return api;
}
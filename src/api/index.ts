export { api } from './api';
export { attachInterceptors } from './interceptors';
export type { NormalizedError as ApiError } from './interceptors';

// (optional) tiny helpers so callers don’t import axios types everywhere
export type { AxiosRequestConfig } from 'axios';


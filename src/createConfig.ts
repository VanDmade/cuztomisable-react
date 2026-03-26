import merge from 'lodash.merge';
import { defaultConfig } from './defaultConfig';

export function createConfig(userConfig: any = {}) {
    return merge({}, defaultConfig, userConfig);
}
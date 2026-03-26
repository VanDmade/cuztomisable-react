import React, { createContext, useContext, useMemo } from 'react';
import { createConfig } from '../createConfig';

type Config = ReturnType<typeof createConfig>;

const ConfigContext = createContext<Config | undefined>(undefined);

let _config: Config | null = null;

interface ConfigProviderProps {
    config: any;
    children: React.ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ config, children }) => {
    const mergedConfig = useMemo(() => {
        return createConfig(config);
    }, [config]);
    _config = mergedConfig;
    return (
        <ConfigContext.Provider value={mergedConfig}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const ctx = useContext(ConfigContext);
    if (ctx === undefined) {
        throw new Error('useConfig must be used inside ConfigProvider');
    }
    return ctx;
};

// 👇 ADD THIS
export const getConfig = (): Config => {
    if (!_config) {
        throw new Error('Config not initialized');
    }
    return _config;
};
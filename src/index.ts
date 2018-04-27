
export * from './config';

import {Config, ConfigRowData} from './config';

export function config(object?: ConfigRowData): Config {
    const conf = new Config();
    return object ? conf.mergeObject(object) : conf;
}

export function configFromString(str: string, type: 'json' | 'yaml' | 'yml'): Config {
    switch (type) {
        case 'json':
            return config(JSON.parse(str));
        case 'yaml':
        case 'yml':
            const loadYaml = require.main.require('js-yaml').safeLoad;
            return config(loadYaml(str));
        default:
            throw new Error('Unknown config type');
    }
}

export function configFromFileSync(filename: string, type?: 'json' | 'yaml' | 'yml'): Config {
    const fs = require('fs');
    return configFromString(
        fs.readFileSync(filename),
        type || (filename.match(/\.([a-z0-9]+)$/)[1] as 'json' | 'yaml' | 'yml'),
    );
}

export function configFromEnv({
    varNamePrefix = 'APP_',
    env = process.env,
}: {
    varNamePrefix?: string;
    env?: NodeJS.ProcessEnv;
} = {}): Config {
    const data = {};
    for (const i of Object.keys(env)) {
        const name = i.toUpperCase();
        if (name.startsWith(varNamePrefix)) {
            data[name.slice(varNamePrefix.length).replace(/_/g, '.')] = env[i];
        }
    }
    return new Config({data});
}

export function basicConfig({
    envVarNamePrefix = 'APP_',
    env = process.env,
}: {
    envVarNamePrefix?: string;
    env?: NodeJS.ProcessEnv;
} = {}): Config {
    const {join} = require('path');
    const NODE_ENV = env.NODE_ENV || 'development';
    const NODE_CONFIG_DIR = env.NODE_CONFIG_DIR || join(process.cwd(), 'config');
    return configFromFileSync(join(NODE_CONFIG_DIR, `default.yml`))
        .merge(configFromFileSync(join(NODE_CONFIG_DIR, `${NODE_ENV}.yml`)))
        .merge(configFromEnv({varNamePrefix: envVarNamePrefix, env}));
}

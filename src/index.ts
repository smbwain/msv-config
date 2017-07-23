
import Config from './config';
import {ConfigRowData, ConfigEnv} from '../types';

export function config(object? : ConfigRowData) : Config {
    const config = new Config();
    return object ? config.mergeObject(object) : config;
}

export function configFromString(str : string, type : string) : Config {
    switch(type) {
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

export function configFromFileSync(filename : string, type? : string) : Config {
    const fs = require('fs');
    return configFromString(fs.readFileSync(filename), type || filename.match(/\.([a-z0-9]+)$/)[1]);
}

export function configFromEnv({
    varNamePrefix = 'APP_',
    env = process.env
} : {
    varNamePrefix? : string,
    env?: ConfigEnv
} = {}) : Config {
    const data = {...this._data};
    for(let i in env) {
        const name = i.toUpperCase();
        if(name.startsWith(varNamePrefix)) {
            data[name.slice(varNamePrefix.length).replace(/_/g, '.')] = env[i];
        }
    }
    return new Config({data});
}

export function basicConfig({
    envVarNamePrefix = 'APP_',
    env = process.env
} : {
    envVarNamePrefix? : string,
    env? : ConfigEnv
} = {}) : Config {
    const {join} = require('path');
    const NODE_ENV = env.NODE_ENV || 'development';
    const NODE_CONFIG_DIR = env.NODE_CONFIG_DIR || join(process.cwd(), 'config');
    return configFromFileSync(join(NODE_CONFIG_DIR, `default.yml`))
        .merge(configFromFileSync(join(NODE_CONFIG_DIR, `${NODE_ENV}.yml`)))
        .merge(configFromEnv({varNamePrefix: envVarNamePrefix, env}));
}
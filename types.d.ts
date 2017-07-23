
export interface Config {
    merge(config : Config) : Config;
    mergeObject(raw : ConfigRowData, options? : {addPrefix? : string}) : Config;
    get(confName : string, defaultValue? : string) : string;
    has(confName : string) : boolean;
    sub(prefix : string) : Config;
}

export type ConfigRowData = {
    [name: string]: string | ConfigRowData
};

export type ConfigData = {
    [name: string]: string
};

export type ConfigEnv = {
    [envKey : string] : string
};

export function config(object? : ConfigRowData) : Config;
export function configFromString(str : string, type : string) : Config;
export function configFromFileSync(filename : string, type? : string) : Config;
export function loadFromEnv(options? : {
    varNamePrefix? : string,
    env?: ConfigEnv
}) : Config;
export function basicConfig(options? : {
    envVarNamePrefix? : string,
    env? : ConfigEnv
}) : Config;
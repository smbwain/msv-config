
export interface ConfigInterface {
    merge(config : ConfigInterface) : ConfigInterface;
    mergeObject(raw : ConfigRowData, options? : {addPrefix? : string}) : ConfigInterface;
    get(confName : string, defaultValue? : string) : string;
    has(confName : string) : boolean;
    sub(prefix : string) : ConfigInterface;
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

export function config(object? : ConfigRowData) : ConfigInterface;
export function configFromString(str : string, type : string) : ConfigInterface;
export function configFromFileSync(filename : string, type? : string) : ConfigInterface;
export function configFromEnv(options? : {
    varNamePrefix? : string,
    env?: ConfigEnv
}) : ConfigInterface;
export function basicConfig(options? : {
    envVarNamePrefix? : string,
    env? : ConfigEnv
}) : ConfigInterface;
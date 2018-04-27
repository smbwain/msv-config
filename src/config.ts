
export interface ConfigRowData {
    [name: string]: string | ConfigRowData;
}

export interface ConfigData {
    [name: string]: string;
}

export class Config {
    protected data: ConfigData;

    constructor({data = {}}: {data?: ConfigData} = {}) {
        this.data = data;
    }

    public merge(config: Config): Config {
        return new Config({data: {...this.data, ...config.data}});
    }

    public mergeObject(raw: ConfigRowData, { addPrefix = '' }: {addPrefix?: string} = {}): Config {
        const data = {...this.data};
        function addRaw(subRaw, rawPrefix) {
            if (typeof subRaw === 'object' && subRaw) {
                for (const i in subRaw) {
                    if (subRaw.hasOwnProperty(i)) {
                        addRaw(subRaw[i], (rawPrefix ? rawPrefix + '.' : '') + i);
                    }
                }
                return;
            }
            data[(addPrefix + rawPrefix).toUpperCase()] = subRaw;
        }
        addRaw(raw, '');
        return new Config({data});
    }

    public get(confName: string, defaultValue?: string): string {
        confName = confName.toUpperCase();
        if (!(confName in this.data)) {
            if (arguments.length >= 2) {
                return defaultValue;
            }
            throw new Error(`No config "${confName}"`);
        }

        return this.data[confName];
    }

    public has(confName: string): boolean {
        return confName.toUpperCase() in this.data;
    }

    public sub(prefix: string): Config {
        prefix = prefix.toUpperCase() + '.';
        const data = {};
        for (const i in this.data) {
            if (this.data.hasOwnProperty(i) && i.startsWith(prefix)) {
                data[i.slice(prefix.length)] = this.data[i];
            }
        }
        return new Config({data});
    }
}

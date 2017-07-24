
import {ConfigInterface, ConfigData, ConfigRowData} from '../types';

export default class Config implements ConfigInterface {

    protected _data : ConfigData;

    constructor({data = {}} : {data? : ConfigData} = {}) {
        this._data = data;
    }

    merge(config : Config) : Config {
        return new Config({data: {...this._data, ...config._data}});
    }

    mergeObject(raw : ConfigRowData, { addPrefix = '' } : {addPrefix? : string} = {}) : Config {
        const data = {...this._data};
        function addRaw(raw, rawPrefix) {
            if(typeof raw == 'object' && raw) {
                for(const i in raw) {
                    if(raw.hasOwnProperty(i)) {
                        addRaw(raw[i], (rawPrefix ? rawPrefix+'.' : '')+i);
                    }
                }
                return;
            }
            data[(addPrefix+rawPrefix).toUpperCase()] = raw;
        }
        addRaw(raw, '');
        return new Config({data});
    }

    get(confName : string, defaultValue? : string) : string {
        confName = confName.toUpperCase();
        if(!(confName in this._data)) {
            if(arguments.length >= 2) {
                return defaultValue;
            }
            throw new Error(`No config "${confName}"`);
        }

        return this._data[confName];
    }

    has(confName : string) : boolean {
        return confName.toUpperCase() in this._data;
    }

    sub(prefix : string) : Config {
        prefix = prefix.toUpperCase()+'.';
        const data = {};
        for(const i in this._data) {
            if(this._data.hasOwnProperty(i) && i.startsWith(prefix)) {
                data[i.slice(prefix.length)] = this._data[i];
            }
        }
        return new Config({data});
    }
}
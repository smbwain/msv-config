import * as assert from 'assert';
import { config, Config, configFromEnv } from '../index';

describe('msv-config', () => {
    let conf: Config;

    it('should init from object and read', () => {
        conf = config({
            appName: 'myApp',
            db: {
                user: 'root',
            },
        });
    });

    it('should merge env vars', () => {
        conf = conf.merge(
            configFromEnv({
                env: {
                    APP_DB_USER: 'someUser',
                    APP_DB_PASSWORD: 'somePassword',
                    APP_AAA_BBB: 'ccc',
                },
            }),
        );
    });

    it('should merge object', () => {
        conf = conf.mergeObject({
            uuu: {
                a: '5',
            },
        });
    });

    it('should read', () => {
        assert.equal(conf.get('appName'), 'myApp');
        assert.equal(conf.get('appname'), 'myApp');
        assert.equal(conf.get('appName', '123'), 'myApp');
        assert.equal(conf.get('appname', '123'), 'myApp');
        assert.equal(conf.get('upName', '123'), '123');
        assert.throws(() => {
            conf.get('upName');
        });
    });

    it('should read subconfigs', () => {
        assert.equal(conf.get('db.user'), 'someUser');
        assert.equal(conf.get('DB.user'), 'someUser');

        const dbConf = conf.sub('db');
        assert.equal(dbConf.get('user'), 'someUser');
        assert.equal(dbConf.get('password'), 'somePassword');

        assert.equal(conf.get('aaa.bbb'), 'ccc');
        assert.equal(conf.get('uuu.a'), '5');
    });
});

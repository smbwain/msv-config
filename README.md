msv-config
==========

This module implements simple config container for configuration which could be read from file, environment variables or somewhere else.

This library is a part of msv project.

How to use
----------

Config could be created from object

```js
import {config} from 'msv-config';

const conf = config({
  appName: 'myApp'
});
```

Config could be loaded from file

```yaml
# conf.yaml
appName: myApp
db:
  host: 127.0.0.1
  user: me
```

```js
// myApp.js
import {configFromFileSync} from 'msv-config';

const conf = configFromFileSync('./conf.yaml');
```

Config could be read with environment variables

```bash
APP_DB_USER=root node myApp
```

```js
import {configFromFileSync, configFromEnv} from 'msv-config';

const conf = configFromFileSync('./conf.yaml').merge(
    configFromEnv()
);
```

You could read values from config

```js
conf.get('appName')

// or

conf.get('appName', 'defaultValue')
```

Configs could be nested

```js
conf.get('db.user')

// or

const dbConf = conf.sub('db');
dbConf.get('user')
```

To be compatible with environment variables, config variable names are case insensitive config values are always strings.

So convert them yourself if needed.

```js
server.listen(
    parseInt(config.get('listen.port'))
);
```

As you could see few snippets ago, configs could be merged

```js
// between each other
const newConf = conf.merge(otherConf);

// or with object
const oneMoreConf = conf.mergeObject({
  db: {
    type: 'mysql'
  }
});

```

Configs are immutable, so calling merge/mergeObject returns new config instance and doesn't affect original config.
 
API
---

### Exported methods:

#### config(object? : ConfigRowData) : Config

```
type ConfigRowData = {
    [name : string] : string | ConfigRowData
}
```

Create new config object.


#### configFromString(str : string, type : string) : Config

Load config from string. At the moment _type_ could be: json or yaml.


#### configFromFileSync(filename : string, type? : string) : Config

Load config from file (synchronously! which should be ok, as you read your config once on the app start).

At the moment, _type_ could be: json or yaml. If _type_ isn't passed, it tries to get type from file extension.


#### configFromEnv(options?)

```
configFromEnv({
  varNamePrefix = 'app',
  env = process.env
} : {
  varNamePrefix? : string,
  env? : {[envKey : string] : string}
}) : Config;
```

Read config from environment variables.

_varNamePrefix_ is prefix which used with your env variables names. By default it's "APP_".

You could also pass your source instead of node's process.env, if needed.
 
So, if you want to have config:
```json
{
    "appName": "myApp",
    "db": {
      "host": "127.0.0.1"
    }
}
```

You could set in your envs:
```
APP_APPNAME=myApp
APP_DB_HOST=127.0.0.1
```


#### basicConfig(options?)

```
configFromEnv({
  varNamePrefix = 'app',
  env = process.env
} : {
  varNamePrefix? : string,
  env? : {[envKey : string] : string}
}) : Config;
```

Create config by merging:

* file <NODE_CONFIG_DIR>/default.yml
* file <NODE_CONFIG_DIR>/<NODE_ENV>.yml
* environment variables with passed prefix (or "APP_" by default)

_NODE_CONFIG_DIR_ and _NODE_ENV_ are retrieved from env variables.
By default NODE_CONFIG_DIR={cwd}/config and NODE_ENV=development

#### config.get(confName : string, defaultValue? : string) : string;

Get config with given name.
If there no config and no defaultValue passed, error will be thrown.

```yaml
# conf.yaml
appName: myApp
db:
  host: 127.0.0.1
  user: me
```

```
const conf = configFromFileSync('./conf.yaml');

conf.get('appName') // 'myApp'
conf.get('db.host') // '127.0.0.1'
conf.get('prjName', 'noName') // 'noName'
conf.get('prjName') // throws Error
```

#### config.has(confName : string) : boolean;

Check if there is config with given name.

#### config.sub(prefix : string) : Config;

Returns sub config.

```yaml
# conf.yaml
appName: myApp
db:
  host: 127.0.0.1
  user: me
```

```
const conf = configFromFileSync('./conf.yaml');

const dbConfig = conf.sub('db');
dbConfig.get('host') // 127.0.0.1
dbConfig.get('host') // me
```

#### config.merge(config : Config) : Config;

Merge one config with another and return result.

```yaml
# conf.yaml
appName: myApp
db:
  host: 127.0.0.1
  user: me
```

```bash
APP_APPNAME=newApp
APP_DB_USER=root node myApp
```

```js
import {configFromFileSync, configFromEnv} from 'msv-config';

const conf = configFromFileSync('./conf.yaml').merge(
    configFromEnv()
);

conf.get('appName'); // 'newApp'
conf.get('db.host'); // '127.0.0.1'
conf.get('db.user'); // 'root'
```

#### config.mergeObject(raw : ConfigRowData, options? : {addPrefix? : string}) : Config;
 
```
type ConfigRowData = {
    [name: string]: string | ConfigRowData
}
```

Merge config with object and return result.

```yaml
# conf.yaml
appName: myApp
db:
  host: 127.0.0.1
  user: me
```

```js
import {configFromFileSync, configFromEnv} from 'msv-config';

const conf = configFromFileSync('./conf.yaml').mergeObject(
    appName: "newApp",
    db: {
        user: 'root'
    }
);

conf.get('appName'); // 'newApp'
conf.get('db.host'); // '127.0.0.1'
conf.get('db.user'); // 'root'
```

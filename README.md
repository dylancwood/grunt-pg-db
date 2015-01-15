# grunt-pg-db

> Execute commands on a postgres database from grunt.
> This module uses the node-pg-db (https://github.com/sehrope/node-pg-db) module to execute SQL commands against PostgreSQL databases. There are a few other modules that are similar to this one:

* grunt-pg: https://github.com/moneytribeaustralia/grunt-pg
* grunt-pg-utils: https://github.com/TopCS/grunt-pg-utils

Unlike the above modules, grunt-pg-db enables you to **run abritrary sql on a remote or local DB without installing psql**.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-pg-db --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-pg-db');
```

## Target options
All targets may have the following options

### options.connection
Type: `string` or `object`
Default value: `process.env.DATABASE_URL`

If not provided, node-pg-db will default to process.env.DATABASE_URL. 

If provided as a string, the string should be follow the standard database url convention: `postgres://username:password@host:port/database`

If provided as an object, the following parameters are allowed (note that this is governed by node-postgres, not this module).
```
user
database
port
host
password
binary
ssl
client_encoding
application_name
fallback_application_name
```
### options.sql (required)
Type: `string` or `array`
Default value: `none`

#### string example:
```js
"SET search_path TO schema1, schema2, public;"
```

If an array is provided, each SQL statement will be executed **synchronously and in-order**

#### array of strings example:
```js
[
    'CREATE DATABASE tempdb WITH TEMPLATE prddb OWNER devs;',
    'ALTER DATABASE tempdb SET search_path TO  schema1, schema2;'
]
```

#### array of objects example:
```js
[
    {
        sql: 'CREATE DATABASE $1 WITH TEMPLATE prddb OWNER devs;',
        params: ['tempdb']
    },
    {
        sql: 'ALTER DATABASE $1 SET search_path TO  $2, $3;',
        params: ['tempdb', 'schema1', 'schema2']
    }
]
```
### options.params
Type: `array`
Default value: `none`

This option is only ever applied when a single sql string is assigned to the sql option. 

## Usage Example:

The following task config will replace an existing database with the name 'devdb' with a copy of a database named 'tempdb'

```js
var credentials = grunt.readJSON('credentials.json');

grunt.loadNpmTasks('grunt-git');

grunt.initConfig({
    pgdb: {
        copyTempDBToDev: {
            options: {
                connection: credentials.dbAdmin.repdb,
                sql: [
                    'CREATE DATABASE tempdevdb WITH TEMPLATE tempdb OWNER devs;',
                    'ALTER DATABASE tempdevdb SET search_path TO schema1, schema2;',
                    "SELECT pg_terminate_backend(procpid) FROM pg_stat_activity WHERE procpid <> pg_backend_pid() AND datname = 'devdb';",
                    "DROP DATABASE devdb;",
                    "SELECT pg_terminate_backend(procpid) FROM pg_stat_activity WHERE procpid <> pg_backend_pid() AND datname = 'tempdevdb';",
                    "ALTER DATABASE tempdevdb RENAME TO devdb;"
                ]
            }
        }
    }
});
```


## Contributing
This is a very simple module. If it does not meet your needs, please feel free to extend it by submitting a pull request.
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/). 

# npm-cli-login

Allows you to log in to NPM without STDIN, STDOUT. Use in places like CI build systems.
Also creates/modifies entries in the ~/.npmrc file for authentication.  

## different from https://www.npmjs.com/package/npm-cli-login
add a --strict flag to enable connect https registry with untrusted SSL certificate 

### Installation

    npm install -g mboff-npm-cli-login

Use -g flag to use mboff-npm-cli-login via the CLI

### Usage

##### CLI

`npm-cli-login` expects the following environment variables to be set before you can use it to authenticate:

- `NPM_USER`: NPM username
- `NPM_PASS`: NPM password
- `NPM_EMAIL`: NPM email
- `NPM_REGISTRY`: (optional) Private NPM registry to log in to (Default: https://registry.npmjs.org)
- `NPM_SCOPE`: (optional) Private NPM scope
- `NPM_RC_PATH`: (optional) Path to a custom .npmrc file you want to update (Default: `~/`)  (Do note this is the path of the file, not the file itself)

Once the required ones are set, you can just run the following to log in:

    npm-cli-login

You can also export variables and run it all in one line:

    NPM_USER=testUser NPM_PASS=testPass NPM_EMAIL=test@example.com npm-cli-login

There is also support for command line arguments:

- `-u`: NPM Username
- `-p`: NPM Password
- `-e`: NPM Email
- `-r`: NPM Registry
- `-s`: NPM Scope
- `--quotes`: Set to `false` by default. Specifies whether your auth token requires quotes. This might required when your auth token has special characters, like `=`, `?` etc.
- `--config-path`: Set to `~/` by default. Can be used to configure a custom .npmrc file to edit (Do note this is the path of the file, not the file itself)

For example: ```npm-cli-login -u testUser -p testPass -e test@example.com```

Or: ```npm-cli-login -u testUser -p testPass -e test@example.com -r https://private.npm.com -s @privateNPM --quotes --config-path="./custom/path/"```

Do note that at least one of the two ways must be configured, that is, you must either provide the required fields (username, password and email) using the environment variables or the command line arguments (or both)

##### Programmatic API

To use the package programmatically, just require the module and pass in your NPM auth details as arguments:

    var npmLogin = require('npm-cli-login');
    npmLogin(username, password, email [, registry, scope, quotes, configPath]);

##### Example

Logging in to the NPM registry:

```
var npmLogin = require('npm-cli-login'),
    username = 'testUser',
    password = 'testPass',
    email = 'test@example.com'

npmLogin(username, password, email)
```

Logging in to private NPM registries:

```
var npmLogin = require('npm-cli-login'),
    username = 'testUser',
    password = 'testPass',
    email = 'test@example.com',
    registry = 'https://npm.example.com',
    scope = '@myScope',
    quotes = false,
    configPath: './custom/path/'

npmLogin(username, password, email, registry, scope, configPath)
```

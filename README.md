# isomorphic-env-webpack-plugin

Webpack plugin and utilities to pass environment variables from server to client via server-side rendering.

## Installation

```sh
# yarn
yarn add isomorphic-env-webpack-plugin

# or npm
npm install isomorphic-env-webpack-plugin
```

## Credits

It was built in [alfabank.com](https://alfabank.com) by [@aapolkovsky](https://github.com/aapolkovsky) and later rewritten in [aviasales.com](https://aviasales.com) by [@7rulnik](https://github.com/@7rulnik). Thanks to these awesome companies to make it open source.

<p align="center">
  <br/>
  <a href="https://alfabank.com">
    <img src="/media/alfabank.svg" alt="Sponsored by Alfa Bank" width="30%">
  </a>
  <br/>
  <br/>
  <a href="https://aviasales.com">
    <img src="/media/aviasales.svg" alt="Sponsored by Aviasales" width="30%">
  </a>
</p>

## Motivation

Sometimes you want to change frontend configuration without rebuilding it.

For example, you need to change hostname time to time.

So you will have something like this in source code

```js
fetch(process.env.GOOGLE_HOST)
```

But if you will use [DefinePlugin](https://webpack.js.org/plugins/define-plugin/) or [EnvironmentPlugin](https://webpack.js.org/plugins/environment-plugin/) you will get hardcoded values into bundle. Like this:

```js
// After run GOOGLE_HOST=http://google.com webpack
fetch('http://google.com')
```

And later, if you need to change `GOOGLE_HOST` you need build your app again.

With this plugin you can set environment variables on a server and pass it to client without rebuilding entire frontend.

## Configuration

### 1. Setup webpack plugin for client config

```js
const {
	IsomorphicEnvWebpackPlugin,
} = require('isomorphic-env-webpack-plugin/plugin')
module.exports = {
	// ...
	plugins: [new IsomorphicEnvWebpackPlugin()],
}
```

> Note that you can't use `DefinePlugin` after `IsomorphicEnvWebpackPlugin`.

It will replace your env variables from this:

```js
console.log(process.env.GOOGLE_HOST)
```

to this:

```js
console.log(self.__ISOMORPHIC_ENV.GOOGLE_HOST)
```

### 2. Inject variables into HTML before your script tags

```js
import { getScriptTag } from 'isomorphic-env-webpack-plugin'

const scriptTag = getScriptTag()

function render() {
	return `
    <!doctype html>
    <html>
      <head>
        ...
      </head>
      <body>
        ...
        ${scriptTag}
        <script src="./main.js"></script>
      </body>
    </html>
  `
}
```

It will inject script tag with variables for client-side:

```html
<!-- ... -->
<script>
	self.__ISOMORPHIC_ENV__ = {
		GOOGLE_HOST: 'https://google.com',
	}
</script>
<script src="./main.js"></script>
```

### 3. Add server runtime

> It's optional, but without it you can't use server prefixes: `S_`, `SC_`, `CS_`.

```js
// Note, that import should be before any process.env usage
import 'isomorphic-env-webpack-plugin/runtime'

import express from 'express'
// ...
```

It will add aliases for server-side variables. So you can access it without prefix:

```js
// S_GOOGLE_HOST="https://google.com" node server.js
process.env.S_GOOGLE_HOST === process.env.GOOGLE_HOST // true
```

## Usage

We have 4 prefixes for env variables:

- `S_` — variable for server-side and will not be exposed to client-side. For example: `S_YOUR_SERVER_ENV`. It works only with server runtime and exists just for more obvious separataion. If you don't want to use runtime you can use just normal `YOUR_SERVER_ENV`.
- `C_` — variable for client-side. For example: `C_YOUR_CLIENT_ENV`.
- `CS_` — same variable for server-side and client-side. For example: `CS_BOTH_CLIENT_AND_SERVER_ENV`. Works only with server runtime.
- `SC_` — same as `CS_`. The only reason to have it that you don't need to remember which variant is correct: `SC_` or `CS_`.

In code you should access them without prefix:

```js
// S_YOUR_SERVER_ENV
process.env.YOUR_SERVER_ENV

// C_YOUR_CLIENT_ENV
process.env.YOUR_CLIENT_ENV

// CS_BOTH_CLIENT_AND_SERVER_ENV or SC_BOTH_CLIENT_AND_SERVER_ENV
process.env.BOTH_CLIENT_AND_SERVER_ENV
```

### Diferent values on client and server

If you want to use different values on server and client you need to set both `C_` and `S_` variables:

```sh
C_SOME_ENV="I'm client env" S_SOME_ENV="I'm server env" node server.js
```

```js
// server.js
process.env.SOME_ENV // I'm server env
```

```js
// client.js
process.env.SOME_ENV // I'm client env
```

### Same value on client and server

If you want to use same value on server and client you need to set `CS_` or `SC_` variable

> It requires server runtime

```sh
CS_SOME_ENV="I'm equal on server and client" node server.js
```

```js
// server.js
process.env.SOME_ENV // I'm equal on server and client
```

```js
// client.js
process.env.SOME_ENV // I'm equal on server and client
```

## Options

If you don't comfortable with `self.__ISOMORPHIC_ENV__` you can change it:

```js
// Pass variableName into plugin
new IsomorphicEnvWebpackPlugin({ variableName: '__SOME_CUSTOM_VARIABLE__' })

// And don't forget to pass same value into getScriptTag
getScriptTag('__SOME_CUSTOM_VARIABLE__')
```

After that you will have this script tag in your HTML:

```html
<script>
	self.__SOME_CUSTOM_VARIABLE__ = {
		GOOGLE_HOST: 'https://google.com',
	}
</script>
```

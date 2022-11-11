# unplugin-dev-proxy

[![NPM version](https://img.shields.io/npm/v/unplugin-dev-proxy?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-dev-proxy)

🛰 A plugin that enhance dev proxy with transform response json data to ts, mock data, identity auth, etc.

# Features

- [x] transform response data to typescript declare file.
- [ ] mock data.
- [ ] identity auth.

# Quick Start

## install
```bash
npm i unplugin-dev-proxy -D
```

## usage

### Feature 1: transform response json data to TypeScript type

#### `app.tsx`
```tsx
axios.get('/api/search?keywords=MELANCHOLY')
```
for example, if the backend return as below

```json
{
  "data": 1
}
```

it will create `@types/GET_Search.d.ts` as below
```ts
declare interface GETSearchResponseType {
  data: number
}
```

#### File naming rule
 `${options.rootDir}/${req.Method}_${pathname(req.url)}`

what is `pathname` function? for example

```ts
pathname('/api/search?keywords=hello') === 'ApiSearch'
```
#### Type naming rule

the rule of type name is `${req.Method}${pathname(req.url)}${options.suffix}`

## Options

[options](https://github.com/imyangyong/unplugin-dev-proxy/blob/main/src/types.ts)

## Config

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import DevProxy from 'unplugin-dev-proxy/vite'

const r = (p: string) => resolve(__dirname, p)

export default defineConfig({
  plugins: [
    DevProxy({
      '/api': {
        target: 'https://autumnfish.cn',
        json2ts: {
          rootDir: r('@types'),
        }
      }
    }),
  ]
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import DevProxy from 'unplugin-dev-proxy/rollup'

export default {
  plugins: [
    DevProxy({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-dev-proxy/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-dev-proxy/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-dev-proxy/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import DevProxy from 'unplugin-dev-proxy/esbuild'

build({
  plugins: [DevProxy()],
})
```

<br></details>

import type { ServerOptions } from 'http-proxy'
import type { WithRequiredProperty } from '@imyangyong/utils'

export interface Json2TsOptions {
  /*
  * the root dir path generate type file
  *
  * @default '@types/'
  */
  rootDir?: string
  /*
  * encoding
  *
  * @default 'utf-8'
  */
  encoding?: BufferEncoding
  /*
  * the suffix of generated root type
  *
  * @default 'ResponseType'
  */
  suffix?: string
  /*
  * should overwrite in next time
  *
  * @default true
  */
  overwrite?: boolean
  /*
  * use `declare` to decorate type or it will be `export`
  *
  * @default true
  */
  declare?: boolean
  /*
  * the request url should be ignored
  *
  * @default null
  */
  ignore?: RegExp | RegExp[] | null
}

export type ProxyOption = WithRequiredProperty<ServerOptions, 'target'> & { json2ts?/* response data transform to typescript type */: Json2TsOptions }

export type Proxy = Record<string/* route */, ProxyOption>

export interface Options {
  /*
  * proxy server options
  *
  * @example
  * {
  *   '/api': {
  *     target: 'https://xxx.com',
  *   }
  * }
  */
  proxy: Proxy
}

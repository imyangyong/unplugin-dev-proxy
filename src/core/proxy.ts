import type { IncomingMessage, ServerResponse } from 'http'
import httpProxy from 'http-proxy'
import type { ProxyOption } from '../types'
import { transformJSONToTs } from './json2ts'

const proxy = httpProxy.createProxyServer()

/**
 * req.url => chunks[],
 */
const chunksMap = new Map()
/**
 * req.url => option,
 */
const optionsMap = new Map()

proxy.on('proxyRes', (proxyRes, req) => {
  chunksMap.set(req.url, [])

  proxyRes.on('data', (chunk) => {
    chunksMap.get(req.url).push(chunk)
  })

  proxyRes.on('end', () => {
    if (optionsMap.get(req.url)?.json2ts)
      transformJSONToTs(req, chunksMap.get(req.url), optionsMap.get(req.url).json2ts)
  })
})

export const proxyWeb = (req: IncomingMessage, res: ServerResponse, option: ProxyOption) => {
  optionsMap.set(req.url, option)
  proxy.web(req, res, {
    changeOrigin: true,
    ...option,
  })
}

export default proxy

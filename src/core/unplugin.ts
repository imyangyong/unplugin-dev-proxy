import events from 'node:events'
import { createUnplugin } from 'unplugin'
import type { Options } from '../types'
import { proxyWeb } from './proxy'

const ee = events.EventEmitter

export default createUnplugin<Options | undefined>((options) => {
  return {
    name: 'unplugin-dev-proxy',
    vite: {
      configureServer(server) {
        ee.setMaxListeners(0)
        if (options) {
          for (const [route, option] of Object.entries(options.proxy)) {
            server.middlewares.use(route, (req, res) => {
              proxyWeb(req, res, option)
            })
          }
        }
      },
    },
  }
})

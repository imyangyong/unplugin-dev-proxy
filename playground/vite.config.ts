import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../src/vite'

export default defineConfig({
  plugins: [
    Inspect(),
    Unplugin({
      proxy: {
        '/pmc-server': {
          target: 'http://qaboss.yeepay.com/pmc-server',
          json2ts: {
            ignore: [/\/file\/upload\//],
            overwrite: false,
          },
        },
      },
    }),
  ],
})

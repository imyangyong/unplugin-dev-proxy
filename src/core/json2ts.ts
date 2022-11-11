import * as fs from 'fs'
import type { IncomingMessage } from 'http'
import JsonToTS from 'json-to-ts'
import MagicString from 'magic-string'
import { toArray } from '@imyangyong/utils'
import parse from 'url-parse'
import type { Json2TsOptions } from '../types'

function parseUrl(req: IncomingMessage) {
  const parsedUrl = parse(req.url!).pathname.split('/').map(name => `${(name[0] || '').toUpperCase()}${name.slice(1)}`).join('')
  return `${req.method!.toString().toUpperCase()}_${parsedUrl}.d.ts`
}

function isIgnore(req: IncomingMessage, ignore: Json2TsOptions['ignore']) {
  if (ignore) {
    const ignoreList = toArray(ignore)
    for (const ignore of ignoreList) {
      if (ignore.test(req.url!))
        return true
    }
  }

  return false
}

function writeFileSyncRecursive(
  filename: string,
  content: string,
  charset: BufferEncoding = 'utf-8',
) {
  // -- normalize path separator to '/' instead of path.sep,
  // -- as / works in node for Windows as well, and mixed \\ and / can appear in the path
  let filepath = filename.replace(/\\/g, '/')

  // -- preparation to allow absolute paths as well
  let root = ''
  if (filepath[0] === '/') {
    root = '/'
    filepath = filepath.slice(1)
  }
  else if (filepath[1] === ':') {
    root = filepath.slice(0, 3) // c:\
    filepath = filepath.slice(3)
  }

  // -- create folders all the way down
  const folders = filepath.split('/').slice(0, -1) // remove last item, file
  folders.reduce(
    (acc, folder) => {
      const folderPath = `${acc + folder}/`
      if (!fs.existsSync(folderPath))
        fs.mkdirSync(folderPath)

      return folderPath
    },
    root, // first 'acc', important
  )

  // -- write file
  fs.writeFileSync(root + filepath, content, charset)
}

export const transformJSONToTs = (
  req: IncomingMessage,
  chunks: Uint8Array[],
  options: Json2TsOptions,
) => {
  const {
    suffix = 'ResponseType',
    encoding = 'utf-8',
    rootDir = '@types',
    overwrite = true,
    declare = true,
    ignore = null,
  } = options

  if (isIgnore(req, ignore))
    return

  const name = parseUrl(req)
  let dir = rootDir

  if (rootDir.endsWith('/')) {
    const splitDir = rootDir.split('/')
    dir = splitDir.slice(0, splitDir.length - 1).join('')
  }

  dir = `${dir}/${name}`

  const isFileExist = fs.existsSync(dir)

  if (overwrite || !isFileExist) {
    try {
      const json = JSON.parse(Buffer.concat(chunks).toString(encoding))
      const code = new MagicString(JsonToTS(json).toLocaleString().replaceAll('},interface', '}\ninterface'))
      const typename = name.split('_')

      code.replace('interface RootObject', `${declare ? 'declare' : 'export'} interface ${typename[0]}${typename[1].replace('.d.ts', '')}${suffix}`)

      writeFileSyncRecursive(dir, code.toString())
    }
    catch (err) {
      // eslint-disable-next-line no-console
      console.log(`[proxy-json2ts Error] ${(err as Error)}`)
    }
  }
}

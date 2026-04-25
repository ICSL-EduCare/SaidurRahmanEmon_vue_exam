import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('./dist', import.meta.url)))
const port = Number(process.env.PORT || 9000)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
}

const send = (res, status, body, type = 'text/plain; charset=utf-8') => {
  res.writeHead(status, { 'Content-Type': type })
  res.end(body)
}

createServer((req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host}`)
  const cleanPath = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(root, cleanPath)

  if (!filePath.startsWith(root)) {
    send(res, 403, 'Forbidden')
    return
  }

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html')
  }

  if (!existsSync(filePath)) {
    filePath = join(root, 'index.html')
  }

  const type = types[extname(filePath)] || 'application/octet-stream'
  send(res, 200, readFileSync(filePath), type)
}).listen(port, () => {
  console.log(`Restaurant POS running at http://localhost:${port}`)
})

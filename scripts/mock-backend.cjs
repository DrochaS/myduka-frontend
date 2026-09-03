const http = require('http')

const port = process.env.PORT || 5000

function sendJSON(res, status, obj) {
  const body = JSON.stringify(obj)
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  })
  res.end(body)
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => (data += chunk))
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

const server = http.createServer(async (req, res) => {
  const url = req.url
  if (req.method === 'POST' && url === '/auth/register') {
    try {
      const body = await parseBody(req)
      if (!body.email || !body.password || !body.full_name) {
        return sendJSON(res, 400, { message: 'Missing fields' })
      }
      const user = {
        id: 1,
        name: body.full_name,
        email: body.email,
        role: body.role || 'merchant',
      }
      return sendJSON(res, 201, { user, access_token: 'mock-token' })
    } catch (err) {
      return sendJSON(res, 400, { message: 'Invalid JSON' })
    }
  }

  if (req.method === 'POST' && url === '/auth/login') {
    try {
      const body = await parseBody(req)
      if (!body.email || !body.password) return sendJSON(res, 400, { message: 'Missing fields' })
      const user = { id: 1, name: 'Demo User', email: body.email, role: 'merchant' }
      return sendJSON(res, 200, { user, access_token: 'mock-token' })
    } catch (err) {
      return sendJSON(res, 400, { message: 'Invalid JSON' })
    }
  }

  sendJSON(res, 404, { message: 'Not found' })
})

server.listen(port, () => {
  console.log(`Mock backend listening on http://localhost:${port}`)
})

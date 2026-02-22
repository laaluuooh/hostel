import http from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dataFile = path.join(__dirname, 'data.json')
const port = Number(process.env.PORT || 5000)

const defaultData = {
  students: [
    { id: 'CSE1001', name: 'Student One', password: 'student@123' },
    { id: 'CSE1002', name: 'Student Two', password: 'student@123' },
  ],
  wardenPassword: 'warden@123',
  menu: [],
  notifications: [],
  complaints: [],
}

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

const readBody = async (req) => {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 1_000_000) {
      throw new Error('Request body too large')
    }
  }
  if (!raw) return {}
  return JSON.parse(raw)
}

const ensureDataFile = async () => {
  try {
    await fs.access(dataFile)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2), 'utf8')
  }
}

const readData = async () => {
  await ensureDataFile()
  const text = await fs.readFile(dataFile, 'utf8')
  try {
    return JSON.parse(text)
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(defaultData, null, 2), 'utf8')
    return structuredClone(defaultData)
  }
}

const writeData = async (data) => {
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8')
}

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    sendJson(res, 400, { ok: false, message: 'Invalid request URL' })
    return
  }

  if (req.method === 'OPTIONS') {
    sendJson(res, 200, { ok: true })
    return
  }

  const url = new URL(req.url, `http://${req.headers.host}`)

  try {
    if (req.method === 'GET' && url.pathname === '/api/health') {
      sendJson(res, 200, { ok: true, message: 'Backend is running' })
      return
    }

    if (req.method === 'GET' && url.pathname === '/') {
      sendJson(res, 200, {
        ok: true,
        message: 'Smart Hostel backend is running',
        health: '/api/health',
      })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/student/login') {
      const { collegeId, password } = await readBody(req)
      if (!collegeId || !password) {
        sendJson(res, 400, { ok: false, message: 'collegeId and password are required' })
        return
      }
      const data = await readData()
      const student = data.students.find(
        (s) => s.id.toLowerCase() === String(collegeId).toLowerCase() && s.password === password
      )
      if (!student) {
        sendJson(res, 401, { ok: false, message: 'Invalid college ID or password' })
        return
      }
      sendJson(res, 200, { ok: true, student: { id: student.id, name: student.name } })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/auth/warden/login') {
      const { password } = await readBody(req)
      if (!password) {
        sendJson(res, 400, { ok: false, message: 'password is required' })
        return
      }
      const data = await readData()
      if (password !== data.wardenPassword) {
        sendJson(res, 401, { ok: false, message: 'Invalid warden password' })
        return
      }
      sendJson(res, 200, { ok: true })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/students') {
      const data = await readData()
      const students = data.students.map((student) => ({
        id: student.id,
        name: student.name || '',
      }))
      sendJson(res, 200, { ok: true, students })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/students') {
      const { id, password, name } = await readBody(req)
      const studentId = String(id || '').trim()
      const studentPassword = String(password || '').trim()
      const studentName = String(name || '').trim()

      if (!studentId || !studentName || !studentPassword) {
        sendJson(res, 400, { ok: false, message: 'id, name, and password are required' })
        return
      }

      const data = await readData()
      const exists = data.students.some((student) => student.id.toLowerCase() === studentId.toLowerCase())
      if (exists) {
        sendJson(res, 409, { ok: false, message: 'Student ID already exists' })
        return
      }

      const student = {
        id: studentId,
        name: studentName,
        password: studentPassword,
      }

      data.students = [student, ...data.students]
      await writeData(data)
      sendJson(res, 201, { ok: true, student: { id: student.id, name: student.name } })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/menu') {
      const data = await readData()
      sendJson(res, 200, { ok: true, menu: data.menu })
      return
    }

    if (req.method === 'PUT' && url.pathname === '/api/menu') {
      const { menu } = await readBody(req)
      if (!Array.isArray(menu)) {
        sendJson(res, 400, { ok: false, message: 'menu must be an array' })
        return
      }
      const data = await readData()
      data.menu = menu
      await writeData(data)
      sendJson(res, 200, { ok: true, menu: data.menu })
      return
    }

    if (req.method === 'DELETE' && url.pathname.startsWith('/api/menu/')) {
      const id = decodeURIComponent(url.pathname.replace('/api/menu/', ''))
      const data = await readData()
      data.menu = data.menu.filter((item) => item.id !== id)
      await writeData(data)
      sendJson(res, 200, { ok: true, menu: data.menu })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/notifications') {
      const data = await readData()
      sendJson(res, 200, { ok: true, notifications: data.notifications })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/notifications') {
      const { text } = await readBody(req)
      if (!text || !String(text).trim()) {
        sendJson(res, 400, { ok: false, message: 'Notification text is required' })
        return
      }
      const data = await readData()
      data.notifications = [{ id: randomUUID(), text: String(text).trim(), createdAt: Date.now() }, ...data.notifications]
      await writeData(data)
      sendJson(res, 201, { ok: true, notifications: data.notifications })
      return
    }

    if (req.method === 'GET' && url.pathname === '/api/complaints') {
      const data = await readData()
      sendJson(res, 200, { ok: true, complaints: data.complaints })
      return
    }

    if (req.method === 'POST' && url.pathname === '/api/complaints') {
      const { text } = await readBody(req)
      if (!text || !String(text).trim()) {
        sendJson(res, 400, { ok: false, message: 'Complaint text is required' })
        return
      }
      const data = await readData()
      data.complaints = [{ id: randomUUID(), text: String(text).trim(), createdAt: Date.now() }, ...data.complaints]
      await writeData(data)
      sendJson(res, 201, { ok: true, complaints: data.complaints })
      return
    }

    if (req.method === 'DELETE' && url.pathname === '/api/complaints') {
      const data = await readData()
      data.complaints = []
      await writeData(data)
      sendJson(res, 200, { ok: true, complaints: [] })
      return
    }

    sendJson(res, 404, {
      ok: false,
      message: 'Route not found',
      hint: 'Try GET /api/health',
    })
  } catch (error) {
    sendJson(res, 500, { ok: false, message: error.message || 'Unexpected server error' })
  }
})

server.listen(port, () => {
  console.log(`Smart Hostel backend running on http://localhost:${port}`)
})

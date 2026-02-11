const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value))
}

export const getMenu = () => read('menu', [])
export const setMenu = (menu) => write('menu', menu)

export const getComplaints = () => read('complaints', [])
export const addComplaint = (text) => {
  const existing = getComplaints()
  const item = { id: crypto.randomUUID(), text, createdAt: Date.now() }
  write('complaints', [item, ...existing])
}
export const clearComplaints = () => write('complaints', [])

export const getNotifications = () => read('notifications', [])
export const addNotification = (text) => {
  const existing = getNotifications()
  const item = { id: crypto.randomUUID(), text, createdAt: Date.now() }
  write('notifications', [item, ...existing])
}
export const removeMenuItem = (id) => {
  const next = getMenu().filter((m) => m.id !== id)
  setMenu(next)
}

const getUsers = () => read('users', [])
const setUsers = (users) => write('users', users)

const toHex = (buffer) => Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('')
export const hashPassword = async (password) => {
  const enc = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', enc)
  return toHex(digest)
}

export const addUser = async ({ name, email, phone, password }) => {
  const users = getUsers()
  const exists = users.find((u) => (email && u.email === email) || (phone && u.phone === phone))
  if (exists) return { ok: false, reason: 'exists' }
  const pwd = await hashPassword(password)
  const user = { id: crypto.randomUUID(), name, email: email || '', phone: phone || '', password: pwd, createdAt: Date.now() }
  setUsers([user, ...users])
  return { ok: true, user }
}

export const verifyStudent = async (identifier, password) => {
  const users = getUsers()
  const candidate = users.find((u) => u.email === identifier || u.phone === identifier)
  if (!candidate) return null
  const pwd = await hashPassword(password)
  if (candidate.password !== pwd) return null
  return candidate
}

export const getAuth = () => read('auth', null)
export const setAuth = (auth) => write('auth', auth)
export const clearAuth = () => write('auth', null)

export const getWardenPassword = () => read('warden_password', 'warden@123')
export const setWardenPassword = (p) => write('warden_password', p)
export const verifyWarden = async (password) => {
  const target = getWardenPassword()
  const pwd = await hashPassword(password)
  const hashedTarget = await hashPassword(target)
  return pwd === hashedTarget
}

export const getTheme = () => read('theme', 'light')
export const setTheme = (t) => write('theme', t)

export const listUsers = () => read('users', [])

export const getFee = (studentId) => {
  const fees = read('fees', {})
  return fees[studentId] || null
}
export const setFee = (studentId, { total, paid }) => {
  const fees = read('fees', {})
  fees[studentId] = { total: Number(total) || 0, paid: Number(paid) || 0, updatedAt: Date.now() }
  write('fees', fees)
}

export const getLeaves = () => read('leaves', [])
export const addLeave = ({ title, start, end, note }) => {
  const leaves = getLeaves()
  const item = { id: crypto.randomUUID(), title, start, end, note: note || '', createdAt: Date.now() }
  write('leaves', [item, ...leaves])
}
export const removeLeave = (id) => {
  const leaves = getLeaves().filter((l) => l.id !== id)
  write('leaves', leaves)
}

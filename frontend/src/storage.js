const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

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

const api = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

export const verifyStudent = async (collegeId, password) => {
  const data = await api('/api/auth/student/login', {
    method: 'POST',
    body: JSON.stringify({ collegeId, password }),
  })
  return data.student
}

export const getWardenPassword = () => ''
export const setWardenPassword = () => {}
export const verifyWarden = async (password) => {
  await api('/api/auth/warden/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  })
  return true
}

export const getStudents = async () => {
  const data = await api('/api/students')
  return data.students || []
}

export const addStudent = async ({ id, password, name }) => {
  const data = await api('/api/students', {
    method: 'POST',
    body: JSON.stringify({ id, password, name }),
  })
  return data.student
}

export const getMenu = async () => {
  const data = await api('/api/menu')
  return data.menu || []
}

export const setMenu = async (menu) => {
  const data = await api('/api/menu', {
    method: 'PUT',
    body: JSON.stringify({ menu }),
  })
  return data.menu || []
}

export const removeMenuItem = async (id) => {
  const data = await api(`/api/menu/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
  return data.menu || []
}

export const getNotifications = async () => {
  const data = await api('/api/notifications')
  return data.notifications || []
}

export const addNotification = async (text) => {
  const data = await api('/api/notifications', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
  return data.notifications || []
}

export const getComplaints = async () => {
  const data = await api('/api/complaints')
  return data.complaints || []
}

export const addComplaint = async (text) => {
  const data = await api('/api/complaints', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
  return data.complaints || []
}

export const clearComplaints = async () => {
  const data = await api('/api/complaints', {
    method: 'DELETE',
  })
  return data.complaints || []
}

export const getAuth = () => read('auth', null)
export const setAuth = (auth) => write('auth', auth)
export const clearAuth = () => write('auth', null)

export const getTheme = () => read('theme', 'light')
export const setTheme = (theme) => write('theme', theme)

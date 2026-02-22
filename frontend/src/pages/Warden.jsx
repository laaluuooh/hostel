import { useEffect, useState } from 'react'
import {
  addNotification,
  addStudent,
  clearComplaints,
  getAuth,
  getComplaints,
  getMenu,
  getNotifications,
  getStudents,
  removeMenuItem,
  setMenu,
} from '../storage'
import { Link } from 'react-router-dom'

const Warden = () => {
  const [day, setDay] = useState('')
  const [items, setItems] = useState('')
  const [menu, setMenuState] = useState([])

  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [studentPassword, setStudentPassword] = useState('')
  const [students, setStudents] = useState([])

  const [notice, setNotice] = useState('')
  const [notifications, setNotifications] = useState([])
  const [complaints, setComplaints] = useState([])
  const [status, setStatus] = useState('')

  useEffect(() => {
    const load = async () => {
      const [menuResult, notificationsResult, complaintsResult, studentsResult] = await Promise.allSettled([
        getMenu(),
        getNotifications(),
        getComplaints(),
        getStudents(),
      ])

      if (menuResult.status === 'fulfilled') setMenuState(menuResult.value)
      if (notificationsResult.status === 'fulfilled') setNotifications(notificationsResult.value)
      if (complaintsResult.status === 'fulfilled') setComplaints(complaintsResult.value)
      if (studentsResult.status === 'fulfilled') setStudents(studentsResult.value)

      if (menuResult.status === 'rejected' || notificationsResult.status === 'rejected' || complaintsResult.status === 'rejected') {
        setStatus('Unable to load dashboard data')
      } else if (studentsResult.status === 'rejected') {
        setStatus('Student list service is unavailable. Restart backend to enable it.')
      }
    }

    load()
  }, [])

  const addNewStudent = async (e) => {
    e.preventDefault()
    if (!studentId.trim() || !studentName.trim() || !studentPassword.trim()) {
      setStatus('Student ID, name, and password are required')
      return
    }

    try {
      const created = await addStudent({
        id: studentId.trim(),
        password: studentPassword,
        name: studentName.trim(),
      })
      setStudents((prev) => [created, ...prev])
      setStudentId('')
      setStudentName('')
      setStudentPassword('')
      setStatus('Student account added')
    } catch (error) {
      setStatus(error.message || 'Failed to add student')
    }
  }

  const uploadMenu = async (e) => {
    e.preventDefault()
    if (!day.trim() || !items.trim()) return

    const next = [{ id: crypto.randomUUID(), day: day.trim(), items: items.trim(), createdAt: Date.now() }, ...menu]
    try {
      const saved = await setMenu(next)
      setMenuState(saved)
      setDay('')
      setItems('')
      setStatus('Weekly menu updated')
    } catch {
      setStatus('Failed to update menu')
    }
  }

  const postNotice = async (e) => {
    e.preventDefault()
    if (!notice.trim()) return

    try {
      const latest = await addNotification(notice.trim())
      setNotifications(latest)
      setNotice('')
      setStatus('New update published')
    } catch {
      setStatus('Failed to publish update')
    }
  }

  const refreshComplaints = async () => {
    try {
      const latest = await getComplaints()
      setComplaints(latest)
      setStatus('Complaints refreshed')
    } catch {
      setStatus('Failed to refresh complaints')
    }
  }

  const deleteMenuItem = async (id) => {
    try {
      const latest = await removeMenuItem(id)
      setMenuState(latest)
      setStatus('Menu item removed')
    } catch {
      setStatus('Failed to remove menu item')
    }
  }

  const clearAllComplaints = async () => {
    try {
      await clearComplaints()
      setComplaints([])
      setStatus('All complaints cleared')
    } catch {
      setStatus('Failed to clear complaints')
    }
  }

  const auth = getAuth()
  if (!auth || auth.role !== 'warden') {
    return (
      <div className="card">
        <h2>Warden Area</h2>
        <p className="muted">Please login as warden to continue.</p>
        <div className="actions">
          <Link className="btn btn-primary" to="/login">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid dashboard-grid">
      <div className="card full-span dashboard-banner">
        <p className="eyebrow">Warden Dashboard</p>
        <h2>Add students, update weekly menu and notices, and view anonymous complaints</h2>
        {status && <p className="muted">{status}</p>}
      </div>

      <div className="card">
        <h2>Add New Student</h2>
        <form onSubmit={addNewStudent}>
          <label>
            Student ID
            <input className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="Example: CSE1003" />
          </label>
          <label>
            Student Name
            <input className="input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Student name" />
          </label>
          <label>
            Password
            <input className="input" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} placeholder="Set initial password" />
          </label>
          <div className="actions">
            <button className="btn btn-success" type="submit">Add Student</button>
          </div>
        </form>

        <h3>Students List</h3>
        {students.length === 0 && <p className="muted">No students added yet.</p>}
        <ul className="list">
          {students.map((student) => (
            <li key={student.id} className="list-item">{student.name || 'Unnamed Student'} ({student.id})</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Update Weekly Menu</h2>
        <form onSubmit={uploadMenu}>
          <label>
            Day
            <input className="input" value={day} onChange={(e) => setDay(e.target.value)} placeholder="Example: Monday" />
          </label>
          <label>
            Menu Items
            <input className="input" value={items} onChange={(e) => setItems(e.target.value)} placeholder="Example: Idli, Sambar, Tea" />
          </label>
          <div className="actions">
            <button className="btn btn-success" type="submit">Update Menu</button>
          </div>
        </form>

        <h3>Current Week Menu</h3>
        {menu.length === 0 && <p className="muted">No menu uploaded yet.</p>}
        <ul className="list">
          {menu.map((m) => (
            <li key={m.id} className="list-item list-item-row">
              <span><strong>{m.day}</strong> - {m.items}</span>
              <button className="btn btn-danger btn-sm" type="button" onClick={() => deleteMenuItem(m.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card full-span">
        <h2>Update Notices / Updates</h2>
        <form onSubmit={postNotice}>
          <label>
            New Update
            <textarea className="textarea" value={notice} onChange={(e) => setNotice(e.target.value)} placeholder="Write update for students..." />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Publish Update</button>
          </div>
        </form>

        <h3>Published Updates</h3>
        {notifications.length === 0 && <p className="muted">No updates published yet.</p>}
        <ul className="list">
          {notifications.map((n) => (
            <li key={n.id} className="list-item">{n.text}</li>
          ))}
        </ul>
      </div>

      <div className="card full-span">
        <h2>Anonymous Complaints</h2>
        <div className="actions">
          <button className="btn btn-primary" type="button" onClick={refreshComplaints}>Refresh</button>
          <button className="btn btn-danger" type="button" onClick={clearAllComplaints}>Clear All</button>
        </div>
        {complaints.length === 0 && <p className="muted">No complaints available.</p>}
        <ul className="list">
          {complaints.map((c) => (
            <li key={c.id} className="list-item">{c.text}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Warden

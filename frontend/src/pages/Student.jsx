import { useEffect, useState } from 'react'
import { getMenu, getNotifications, addComplaint, getAuth } from '../storage'
import { Link } from 'react-router-dom'

const Student = () => {
  const [menu, setMenu] = useState([])
  const [notifications, setNotifications] = useState([])
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    const load = async () => {
      try {
        const [menuData, notificationsData] = await Promise.all([getMenu(), getNotifications()])
        setMenu(menuData)
        setNotifications(notificationsData)
      } catch {
        setStatus('Unable to load data. Please try again.')
      }
    }
    load()
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return

    try {
      await addComplaint(text.trim())
      setText('')
      setStatus('Complaint submitted anonymously')
      setTimeout(() => setStatus(''), 2000)
    } catch {
      setStatus('Failed to submit complaint')
    }
  }

  const auth = getAuth()
  if (!auth || auth.role !== 'student') {
    return (
      <div className="card">
        <h2>Student Area</h2>
        <p className="muted">Please login as student to continue.</p>
        <div className="actions">
          <Link className="btn btn-primary" to="/login">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid dashboard-grid">
      <div className="card full-span dashboard-banner">
        <p className="eyebrow">Student Dashboard</p>
        <h2>Weekly updates and anonymous complaints</h2>
      </div>

      <div className="card">
        <h2>Current Week Food Menu</h2>
        {menu.length === 0 && <p className="muted">No menu items uploaded yet.</p>}
        <ul className="list">
          {menu.map((m) => (
            <li key={m.id} className="list-item">
              <strong>{m.day}</strong> - {m.items}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Notifications</h2>
        {notifications.length === 0 && <p className="muted">No notifications available.</p>}
        <ul className="list">
          {notifications.map((n) => (
            <li key={n.id} className="list-item">{n.text}</li>
          ))}
        </ul>
      </div>

      <div className="card full-span">
        <h2>Post Complaint (Anonymous)</h2>
        <form onSubmit={submit}>
          <label>
            Complaint
            <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your complaint here..." />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Submit Complaint</button>
            {status && <span className="status-chip">{status}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Student

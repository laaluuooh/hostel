import { useEffect, useState } from 'react'
import { getMenu, getNotifications, addComplaint, getAuth, getFee, getLeaves } from '../storage'
import { Link } from 'react-router-dom'

const Student = () => {
  const [menu, setMenu] = useState([])
  const [notifications, setNotifications] = useState([])
  const [text, setText] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    setMenu(getMenu())
    setNotifications(getNotifications())
  }, [])

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    addComplaint(text.trim())
    setText('')
    setStatus('Complaint submitted')
    setTimeout(() => setStatus(''), 2000)
  }

  const auth = getAuth()
  if (!auth || auth.role !== 'student') {
    return (
      <div className="card">
        <h2>Student Area</h2>
        <p className="muted">Please login or register to continue.</p>
        <div className="actions">
          <Link className="btn btn-primary" to="/login">Login</Link>
          <Link className="btn btn-success" to="/register">Register</Link>
        </div>
      </div>
    )
  }
  return (
    <div className="grid">
      <div className="card">
        <h2>Hostel Fee</h2>
        {getFee(auth.studentId) ? (
          <p className="muted">
            Total {getFee(auth.studentId).total}, Paid {getFee(auth.studentId).paid}, Due {Math.max(0, getFee(auth.studentId).total - getFee(auth.studentId).paid)}
          </p>
        ) : (
          <p className="muted">No fee record available yet.</p>
        )}
      </div>

      <div className="card">
        <h2>Today's Menu</h2>
        {menu.length === 0 && <p className="muted">No menu items yet.</p>}
        <ul className="list">
          {menu.map((m) => (
            <li key={m.id} className="list-item">
              <strong>{m.day}</strong> — {m.items}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Notifications</h2>
        {notifications.length === 0 && <p className="muted">No notifications.</p>}
        <ul className="list">
          {notifications.map((n) => (
            <li key={n.id} className="list-item">{n.text}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Leaves</h2>
        {getLeaves().length === 0 && <p className="muted">No leaves declared.</p>}
        <ul className="list">
          {getLeaves().map((l) => (
            <li key={l.id} className="list-item">
              <strong>{l.title}</strong> — {l.start} to {l.end} {l.note ? `— ${l.note}` : ''}
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>Anonymous Complaint</h2>
        <form onSubmit={submit}>
          <label>
            Message
            <textarea className="textarea" value={text} onChange={(e) => setText(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Submit</button>
            {status && <span className="muted">{status}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Student

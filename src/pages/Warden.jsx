import { useEffect, useState } from 'react'
import { getMenu, setMenu, removeMenuItem, getComplaints, clearComplaints, addNotification, getNotifications, getAuth, listUsers, getFee, setFee, getLeaves, addLeave, removeLeave } from '../storage'
import { Link } from 'react-router-dom'

const Warden = () => {
  const [day, setDay] = useState('')
  const [items, setItems] = useState('')
  const [menu, setMenuState] = useState([])
  const [complaints, setComplaints] = useState([])
  const [notice, setNotice] = useState('')
  const [notifications, setNotifications] = useState([])
  const [students, setStudents] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [totalFee, setTotalFee] = useState('')
  const [paidFee, setPaidFee] = useState('')
  const [currentFee, setCurrentFee] = useState(null)
  const [leaveTitle, setLeaveTitle] = useState('')
  const [leaveStart, setLeaveStart] = useState('')
  const [leaveEnd, setLeaveEnd] = useState('')
  const [leaveNote, setLeaveNote] = useState('')
  const [leaves, setLeaves] = useState([])

  useEffect(() => {
    setMenuState(getMenu())
    setComplaints(getComplaints())
    setNotifications(getNotifications())
    setStudents(listUsers())
    setLeaves(getLeaves())
  }, [])

  const addMenu = (e) => {
    e.preventDefault()
    if (!day.trim() || !items.trim()) return
    const next = [{ id: crypto.randomUUID(), day: day.trim(), items: items.trim(), createdAt: Date.now() }, ...menu]
    setMenu(next)
    setMenuState(next)
    setDay('')
    setItems('')
  }

  const postNotice = (e) => {
    e.preventDefault()
    if (!notice.trim()) return
    addNotification(notice.trim())
    setNotifications(getNotifications())
    setNotice('')
  }

  const refreshComplaints = () => {
    setComplaints(getComplaints())
  }

  const selectStudent = (id) => {
    setSelectedStudent(id)
    setCurrentFee(id ? getFee(id) : null)
    setTotalFee(id && getFee(id) ? getFee(id).total : '')
    setPaidFee(id && getFee(id) ? getFee(id).paid : '')
  }

  const saveFee = (e) => {
    e.preventDefault()
    if (!selectedStudent) return
    setFee(selectedStudent, { total: totalFee, paid: paidFee })
    setCurrentFee(getFee(selectedStudent))
  }

  const declareLeave = (e) => {
    e.preventDefault()
    if (!leaveTitle.trim() || !leaveStart || !leaveEnd) return
    addLeave({ title: leaveTitle.trim(), start: leaveStart, end: leaveEnd, note: leaveNote.trim() })
    setLeaves(getLeaves())
    setLeaveTitle('')
    setLeaveStart('')
    setLeaveEnd('')
    setLeaveNote('')
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
    <div className="grid">
      <div className="card">
        <h2>Add Menu</h2>
        <form onSubmit={addMenu}>
          <label>
            Day
            <input className="input" value={day} onChange={(e) => setDay(e.target.value)} />
          </label>
          <label>
            Items
            <input className="input" value={items} onChange={(e) => setItems(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn btn-success" type="submit">Add</button>
          </div>
        </form>
        <h3>Current Menu</h3>
        {menu.length === 0 && <p className="muted">No items.</p>}
        <ul className="list">
          {menu.map((m) => (
            <li key={m.id} className="list-item">
              <strong>{m.day}</strong> — {m.items}
              <button className="btn btn-danger" style={{ marginLeft: 10 }} onClick={() => { removeMenuItem(m.id); setMenuState(getMenu()) }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Post Notification</h2>
        <form onSubmit={postNotice}>
          <label>
            Message
            <textarea className="textarea" value={notice} onChange={(e) => setNotice(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Publish</button>
          </div>
        </form>
        <h3>Notifications</h3>
        {notifications.length === 0 && <p className="muted">None yet.</p>}
        <ul className="list">
          {notifications.map((n) => (
            <li key={n.id} className="list-item">{n.text}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Student Fee Report</h2>
        <label>
          Student
          <select className="select" value={selectedStudent} onChange={(e) => selectStudent(e.target.value)}>
            <option value="">Select a student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name} {s.email ? `(${s.email})` : s.phone ? `(${s.phone})` : ''}</option>
            ))}
          </select>
        </label>
        {selectedStudent && (
          <form onSubmit={saveFee}>
            <label>
              Total Fee
              <input className="input" type="number" value={totalFee} onChange={(e) => setTotalFee(e.target.value)} />
            </label>
            <label>
              Paid
              <input className="input" type="number" value={paidFee} onChange={(e) => setPaidFee(e.target.value)} />
            </label>
            <div className="actions">
              <button className="btn btn-success" type="submit">Save</button>
            </div>
          </form>
        )}
        {currentFee ? (
          <p className="muted">Current: Total {currentFee.total}, Paid {currentFee.paid}, Due {Math.max(0, currentFee.total - currentFee.paid)}</p>
        ) : selectedStudent ? (
          <p className="muted">No fee record yet.</p>
        ) : null}
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>Declare Leave</h2>
        <form onSubmit={declareLeave}>
          <label>
            Title
            <input className="input" value={leaveTitle} onChange={(e) => setLeaveTitle(e.target.value)} />
          </label>
          <div className="grid">
            <label>
              Start
              <input className="input" type="date" value={leaveStart} onChange={(e) => setLeaveStart(e.target.value)} />
            </label>
            <label>
              End
              <input className="input" type="date" value={leaveEnd} onChange={(e) => setLeaveEnd(e.target.value)} />
            </label>
          </div>
          <label>
            Note
            <textarea className="textarea" value={leaveNote} onChange={(e) => setLeaveNote(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Add Leave</button>
          </div>
        </form>
        <h3>Leaves</h3>
        {leaves.length === 0 && <p className="muted">No leaves declared.</p>}
        <ul className="list">
          {leaves.map((l) => (
            <li key={l.id} className="list-item">
              <strong>{l.title}</strong> — {l.start} to {l.end} {l.note ? `— ${l.note}` : ''}
              <button className="btn btn-danger" style={{ marginLeft: 10 }} onClick={() => { removeLeave(l.id); setLeaves(getLeaves()) }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card" style={{ gridColumn: '1 / -1' }}>
        <h2>Anonymous Complaints</h2>
        <div className="actions" style={{ marginBottom: 10 }}>
          <button className="btn btn-primary" onClick={refreshComplaints}>Refresh</button>
          <button className="btn btn-danger" onClick={() => { clearComplaints(); setComplaints([]) }}>Clear All</button>
        </div>
        {complaints.length === 0 && <p className="muted">No complaints.</p>}
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

import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import { verifyStudent, verifyWarden, setAuth } from '../storage'

const Login = () => {
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [studentPwd, setStudentPwd] = useState('')
  const [wardenPwd, setWardenPwd] = useState('')
  const [error, setError] = useState('')
  const loginStudent = async (e) => {
    e.preventDefault()
    setError('')
    const user = await verifyStudent(studentId.trim(), studentPwd)
    if (!user) {
      setError('Invalid student credentials')
      return
    }
    setAuth({ role: 'student', studentId: user.id })
    navigate('/student')
  }
  const loginWarden = async (e) => {
    e.preventDefault()
    setError('')
    const ok = await verifyWarden(wardenPwd)
    if (!ok) {
      setError('Invalid warden password')
      return
    }
    setAuth({ role: 'warden' })
    navigate('/warden')
  }
  return (
    <div className="grid">
      <div className="card">
        <h1>Student Login</h1>
        <form onSubmit={loginStudent}>
          <label>
            Email or Phone
            <input className="input" value={studentId} onChange={(e) => setStudentId(e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" className="input" value={studentPwd} onChange={(e) => setStudentPwd(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn btn-success" type="submit">Login</button>
            <Link to="/register" className="nav-link" style={{ padding: 0 }}>Register</Link>
          </div>
        </form>
      </div>
      <div className="card">
        <h1>Warden Login</h1>
        <form onSubmit={loginWarden}>
          <label>
            Password
            <input type="password" className="input" value={wardenPwd} onChange={(e) => setWardenPwd(e.target.value)} />
          </label>
          <div className="actions">
            <button className="btn btn-primary" type="submit">Login</button>
          </div>
        </form>
      </div>
      {error && <div className="card" style={{ gridColumn: '1 / -1' }}><p className="muted">{error}</p></div>}
    </div>
  )
}

export default Login

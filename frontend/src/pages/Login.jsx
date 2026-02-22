import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { verifyStudent, verifyWarden, setAuth } from '../storage'

const Login = () => {
  const navigate = useNavigate()
  const [collegeId, setCollegeId] = useState('')
  const [studentPwd, setStudentPwd] = useState('')
  const [wardenPwd, setWardenPwd] = useState('')
  const [showWarden, setShowWarden] = useState(false)
  const [error, setError] = useState('')

  const loginStudent = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await verifyStudent(collegeId.trim(), studentPwd)
      setAuth({ role: 'student', studentId: user.id })
      navigate('/student')
    } catch {
      setError('Invalid college ID or password')
    }
  }

  const loginWarden = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verifyWarden(wardenPwd)
      setAuth({ role: 'warden' })
      navigate('/warden')
    } catch {
      setError('Invalid warden password')
    }
  }

  return (
    <section className="section-stack">
      <article className="card form-card">
        <h1>Student Login</h1>
        <form onSubmit={loginStudent}>
          <label>
            College ID
            <input className="input" value={collegeId} onChange={(e) => setCollegeId(e.target.value)} placeholder="Enter college ID" />
          </label>
          <label>
            Password
            <input type="password" className="input" value={studentPwd} onChange={(e) => setStudentPwd(e.target.value)} placeholder="Enter password" />
          </label>
          <div className="actions">
            <button className="btn btn-success" type="submit">Student Login</button>
          </div>
        </form>

        <div className="warden-login">
          <button className="btn btn-secondary" type="button" onClick={() => setShowWarden((value) => !value)}>
            {showWarden ? 'Hide Warden Login' : 'Warden Login'}
          </button>
        </div>

        {showWarden && (
          <form onSubmit={loginWarden} className="warden-form">
            <label>
              Warden Password
              <input type="password" className="input" value={wardenPwd} onChange={(e) => setWardenPwd(e.target.value)} placeholder="Enter warden password" />
            </label>
            <div className="actions">
              <button className="btn btn-primary" type="submit">Login as Warden</button>
            </div>
          </form>
        )}

        {error && <p className="status-message">{error}</p>}
      </article>
    </section>
  )
}

export default Login

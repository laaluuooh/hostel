import { useState } from 'react'
import { addUser, setAuth } from '../storage'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    if (!email.trim() && !phone.trim()) {
      setError('Provide email or phone')
      return
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    const res = await addUser({ name: name.trim(), email: email.trim(), phone: phone.trim(), password })
    if (!res.ok) {
      setError('User already exists')
      return
    }
    setAuth({ role: 'student', studentId: res.user.id })
    navigate('/student')
  }

  return (
    <div className="card form-card">
      <h1>Student Registration</h1>
      <form onSubmit={submit}>
        <label>
          Name
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Email
          <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Phone
          <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label>
          Confirm Password
          <input type="password" className="input" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <div className="actions">
          <button className="btn btn-success" type="submit">Register</button>
        </div>
      </form>
      {error && <p className="muted">{error}</p>}
    </div>
  )
}

export default Register

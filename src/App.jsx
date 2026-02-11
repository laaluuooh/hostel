import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Student from './pages/Student'
import Warden from './pages/Warden'
import Register from './pages/Register'

const App = () => {
  return (
    <div>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/student" element={<Student />} />
          <Route path="/warden" element={<Warden />} />
        </Routes>
      </main>
    </div>
  )
}

export default App

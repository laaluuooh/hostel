import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getTheme, setTheme } from '../storage'

const Header = () => {
  const [theme, setThemeState] = useState(getTheme())
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    setTheme(theme)
  }, [theme])
  return (
    <header className="header">
      <div className="brand">Smart Hostel</div>
      <nav className="nav">
        <a href="/#home" className="nav-link">Home</a>
        <a href="/#about" className="nav-link">About</a>
        <a href="/#contact" className="nav-link">Contact</a>
        <NavLink to="/login" className="nav-link">Login</NavLink>
        <button className="btn" style={{ marginLeft: 8 }} onClick={() => setThemeState(theme === 'light' ? 'dark' : 'light')}>
          {theme === 'light' ? 'Dark' : 'Light'}
        </button>
      </nav>
    </header>
  )
}

export default Header

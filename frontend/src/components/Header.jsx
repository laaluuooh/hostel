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
      <div className="header-inner container">
        <NavLink to="/" className="brand">
          <span className="brand-mark">SH</span>
          <span className="brand-text">
            <strong>Smart Hostel</strong>
            <small>Management</small>
          </span>
        </NavLink>

        <div className="header-right">
          <nav className="nav">
            <a href="/#home" className="nav-link">Home</a>
            <a href="/#about" className="nav-link">About</a>
            <a href="/#contact" className="nav-link">Contact</a>
          </nav>

          <div className="header-actions">
            <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
            <button
              className="btn btn-theme"
              type="button"
              onClick={() => setThemeState(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

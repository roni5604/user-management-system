// src/components/Navbar.jsx

import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ sessionUser, setSessionUser }) {
  const navigate = useNavigate()

  // If someone clicks 'Logout':
  const handleLogout = () => {
    setSessionUser(null) // Clears user in App's state => triggers re-render
    navigate('/login')
  }

  // Check if admin
  const isAdmin =
    sessionUser &&
    sessionUser.username === 'admin' &&
    sessionUser.password === 'ad12343211ad'

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/login">
          ניהול משתמשים
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* No user */}
            {!sessionUser && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    התחברות
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    הרשמה
                  </Link>
                </li>
              </>
            )}

            {/* Regular user */}
            {sessionUser && !isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    דף הבית
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/edit-details">
                    ערוך פרופיל
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    התנתק
                  </button>
                </li>
              </>
            )}

            {/* Admin */}
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    דף הבית
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">
                    ניהול משתמשים
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/edit-details">
                    ערוך פרופיל
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>
                    התנתק
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

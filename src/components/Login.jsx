// src/components/Login.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

function Login({ sessionUser, setSessionUser }) {
  const [users] = useLocalStorage('users', [])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    )
    if (foundUser) {
      setSessionUser(foundUser) // Sets user in App => triggers Navbar update
      if (foundUser.username === 'admin' && foundUser.password === 'ad12343211ad') {
        navigate('/admin')
      } else {
        navigate('/profile')
      }
    } else {
      setError('שם המשתמש או הסיסמה אינם נכונים.')
    }
  }

  return (
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">התחברות</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">שם משתמש:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="שם המשתמש שלך"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">סיסמה:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="הסיסמה שלך"
          />
        </div>

        {error && <div className="text-danger mb-3">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          התחבר
        </button>
      </form>
    </div>
  )
}

export default Login

// src/App.jsx

import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import RootLayout from './layout/RootLayout'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './components/Profile'
import EditDetails from './components/EditDetails'
import SystemAdmin from './components/SystemAdmin'

function App() {
  // English Comments:
  // 1) Maintain "sessionUser" in App state (instead of each component).
  // 2) Load from sessionStorage on mount (if any).
  // 3) Save to sessionStorage whenever sessionUser changes.
  //    This ensures the user session persists on reload, but also
  //    triggers immediate re-render for the navbar.

  const [sessionUser, setSessionUser] = useState(null)

  // On app mount, read sessionUser from sessionStorage if present
  useEffect(() => {
    const stored = sessionStorage.getItem('sessionUser')
    if (stored) {
      setSessionUser(JSON.parse(stored))
    }
  }, [])

  // Whenever sessionUser changes, persist to sessionStorage
  useEffect(() => {
    if (sessionUser) {
      sessionStorage.setItem('sessionUser', JSON.stringify(sessionUser))
    } else {
      sessionStorage.removeItem('sessionUser')
    }
  }, [sessionUser])

  // Also, we still seed the admin user into localStorage if not present
  useEffect(() => {
    const addDefaultAdmin = () => {
      const usersInStorage = JSON.parse(localStorage.getItem('users')) || []
      const adminUserExists = usersInStorage.some(u => u.username === 'admin')
      if (!adminUserExists) {
        usersInStorage.push({
          username: 'admin',
          password: 'ad12343211ad',
          firstName: 'Admin',
          lastName: 'Superuser',
          email: 'admin@admin.com',
          dateOfBirth: '1990-01-01',
          city: 'AdminCity',
          streetName: 'AdminStreet',
          streetNumber: '1',
          image: '',
        })
        localStorage.setItem('users', JSON.stringify(usersInStorage))
      }
    }
    addDefaultAdmin()
  }, [])

  return (
    <Routes>
      {/* Default route -> redirect to /login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/*
        We pass sessionUser and setSessionUser as props to RootLayout,
        so it can forward them to the Navbar (and beyond).
      */}
      <Route
        path="/"
        element={
          <RootLayout sessionUser={sessionUser} setSessionUser={setSessionUser} />
        }
      >
        <Route
          path="login"
          element={
            <Login sessionUser={sessionUser} setSessionUser={setSessionUser} />
          }
        />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile />} />
        <Route path="edit-details" element={<EditDetails />} />
        <Route path="admin" element={<SystemAdmin />} />
      </Route>
    </Routes>
  )
}

export default App

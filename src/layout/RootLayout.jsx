// src/layout/RootLayout.jsx

import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'

function RootLayout({ sessionUser, setSessionUser }) {
  // English Comments:
  // We receive sessionUser/setSessionUser from App,
  // then pass them to <Navbar />. This ensures the navbar always sees
  // the latest user state, so it can update without a refresh.

  return (
    <div>
      <Navbar sessionUser={sessionUser} setSessionUser={setSessionUser} />
      <div className="container mt-4">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout

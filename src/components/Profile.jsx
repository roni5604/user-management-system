// src/components/Profile.jsx

import React from 'react'
import { useNavigate } from 'react-router-dom'
import useSessionStorage from '../hooks/useSessionStorage'

function Profile() {
  const [sessionUser, setSessionUser] = useSessionStorage('sessionUser', null)
  const navigate = useNavigate()

  if (!sessionUser) {
    navigate('/login')
    return null
  }

  const {
    firstName,
    lastName,
    city,
    streetName,
    apartmentNumber,
    dateOfBirth,
    image,
  } = sessionUser

  // Full name in the title
  const fullName = `${firstName} ${lastName}`

  // Full address
  const address = `${city}, ${streetName}, דירה ${apartmentNumber}`

  // When user clicks "למשחק", we can show an alert or navigate to a link
  const handleGameClick = () => {
    // Example: open a new tab to your favorite online game
    window.open('https://www.chess.com', '_blank')
  }

  // Logout
  const handleLogout = () => {
    setSessionUser(null)
    navigate('/login')
  }

  return (
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
      <div className="row g-3 align-items-center">
        {/* Left side: user details */}
        <div className="col-md-8">
          <h4 className="mb-2">{fullName}</h4>
          <p className="mb-1">
            <strong>כתובת מלאה:</strong> {address}
          </p>
          <p className="mb-1">
            <strong>תאריך לידה:</strong> {dateOfBirth}
          </p>
        </div>

        {/* Right side: user's image */}
        <div className="col-md-4 text-end">
          {image ? (
            <img
              src={image} // <-- This is the Base64 string
              alt="Avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          ) : (
            <img
              src="https://via.placeholder.com/120?text=No+Image"
              alt="No avatar"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
          )}
        </div>
      </div>

      {/* The three buttons at the bottom */}
      <div className="d-flex justify-content-center mt-4">
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate('/edit-details')}
        >
          עדכן פרטים
        </button>

        <button
          className="btn btn-primary me-2"
          onClick={handleGameClick}
        >
          למשחק
        </button>

        <button
          className="btn btn-danger"
          onClick={handleLogout}
        >
          התנתק
        </button>
      </div>
    </div>
  )
}

export default Profile

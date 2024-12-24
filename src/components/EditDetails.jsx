// src/components/EditDetails.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useSessionStorage from '../hooks/useSessionStorage'
import useLocalStorage from '../hooks/useLocalStorage'

const cityOptions = [
  'תל אביב',
  'חיפה',
  'ירושלים',
  'באר שבע',
  'ראשון לציון',
  'נתניה',
  'אילת',
  'אשדוד',
  'פתח תקווה',
]

// We can reuse the same Hebrew regex from Register
const hebrewRegex = /^[\u0590-\u05FF\s]+$/
// We’ll keep the logic simpler for demonstration here

function EditDetails() {
  const [sessionUser, setSessionUser] = useSessionStorage('sessionUser', null)
  const [users, setUsers] = useLocalStorage('users', [])
  const navigate = useNavigate()

  if (!sessionUser) {
    navigate('/login')
    return null
  }

  const [firstName, setFirstName] = useState(sessionUser.firstName)
  const [lastName, setLastName] = useState(sessionUser.lastName)
  const [dateOfBirth, setDateOfBirth] = useState(sessionUser.dateOfBirth)
  const [city, setCity] = useState(sessionUser.city)
  const [streetName, setStreetName] = useState(sessionUser.streetName)
  const [apartmentNumber, setApartmentNumber] = useState(sessionUser.apartmentNumber)
  
  // Keep the user’s current image in base64
  const [imageBase64, setImageBase64] = useState(sessionUser.image || '')
  const [error, setError] = useState('')

  // We create a local preview from the Base64
  // Actually we can just use `imageBase64` in an <img src> directly.

  // file -> base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (err) => reject(err)
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await fileToBase64(file)
      setImageBase64(base64)
    }
  }

  const handleUpdate = (e) => {
    e.preventDefault()
    // Basic checks
    if (!cityOptions.includes(city)) {
      setError('יש לבחור עיר מהרשימה בלבד.')
      return
    }
    if (!hebrewRegex.test(streetName)) {
      setError('שם הרחוב חייב להיות בעברית בלבד.')
      return
    }
    if (!/^\d+$/.test(apartmentNumber)) {
      setError('מספר דירה חייב להיות מספר חיובי או אפס.')
      return
    }

    // Update user in localStorage
    const updatedUsers = users.map((u) => {
      if (u.username === sessionUser.username) {
        return {
          ...u,
          firstName,
          lastName,
          dateOfBirth,
          city,
          streetName,
          apartmentNumber,
          image: imageBase64, // store new Base64 if changed
        }
      }
      return u
    })

    setUsers(updatedUsers)

    // Update session user
    const updatedSessionUser = updatedUsers.find((u) => u.username === sessionUser.username)
    setSessionUser(updatedSessionUser)

    navigate('/profile')
  }

  return (
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
      <h2 className="text-center mb-4">עריכת פרטים</h2>
      <form onSubmit={handleUpdate}>
        <div className="mb-3">
          <label className="form-label">שם פרטי:</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">שם משפחה:</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">תאריך לידה:</label>
          <input
            type="date"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </div>

        {/* City (autocomplete) */}
        <div className="mb-3">
          <label className="form-label">עיר:</label>
          <input
            type="text"
            className="form-control"
            list="city-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <datalist id="city-list">
            {cityOptions
              .filter(c => c.startsWith(city))
              .map((c) => (
                <option key={c} value={c} />
              ))}
          </datalist>
        </div>

        <div className="mb-3">
          <label className="form-label">שם רחוב:</label>
          <input
            type="text"
            className="form-control"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">מספר דירה:</label>
          <input
            type="text"
            className="form-control"
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
          />
        </div>

        {/* Show current image + option to upload new */}
        <div className="mb-3">
          <label className="form-label">תמונה נוכחית:</label>
          <div>
            {imageBase64 ? (
              <img
                src={imageBase64}
                alt="Current"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  marginBottom: '1rem',
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
                  marginBottom: '1rem',
                }}
              />
            )}
          </div>

          <label className="form-label">העלאת תמונה חדשה:</label>
          <input
            type="file"
            className="form-control"
            accept=".jpg,.jpeg"
            onChange={handleImageChange}
          />
        </div>

        {error && <div className="text-danger mb-3">{error}</div>}

        <button type="submit" className="btn btn-primary w-100">
          עדכן פרטים
        </button>
      </form>
    </div>
  )
}

export default EditDetails

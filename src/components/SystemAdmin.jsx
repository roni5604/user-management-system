// src/components/SystemAdmin.jsx

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import useSessionStorage from '../hooks/useSessionStorage'
import { FaEdit, FaTrash } from 'react-icons/fa'

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

function formatDateWithWords(dateStr) {
  // dateStr = "YYYY-MM-DD"
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  // parts[0] = YYYY, parts[1] = MM, parts[2] = DD
  const year = parts[0]
  const monthIndex = parseInt(parts[1], 10) - 1 // zero-based
  const day = parts[2]
  const monthName = monthNames[monthIndex] || ''
  return `${day} ${monthName} ${year}`
}

function SystemAdmin() {
  const [users, setUsers] = useLocalStorage('users', [])
  const [sessionUser, setSessionUser] = useSessionStorage('sessionUser', null)

  const [editingUser, setEditingUser] = useState(null)
  const [editedFirstName, setEditedFirstName] = useState('')
  const [editedLastName, setEditedLastName] = useState('')
  const [editedDateOfBirth, setEditedDateOfBirth] = useState('')
  const [editedCity, setEditedCity] = useState('')
  const [editedStreetName, setEditedStreetName] = useState('')
  const [editedApartmentNumber, setEditedApartmentNumber] = useState('')
  
  const navigate = useNavigate()

  const isAdmin =
    sessionUser &&
    sessionUser.username === 'admin' &&
    sessionUser.password === 'ad12343211ad'

  if (!isAdmin) {
    navigate('/login')
    return null
  }

  const handleEdit = (user) => {
    setEditingUser(user.username)
    setEditedFirstName(user.firstName)
    setEditedLastName(user.lastName)
    setEditedDateOfBirth(user.dateOfBirth)
    setEditedCity(user.city)
    setEditedStreetName(user.streetName)
    setEditedApartmentNumber(user.apartmentNumber)
  }

  const handleSave = (username) => {
    const updatedUsers = users.map((u) => {
      if (u.username === username) {
        return {
          ...u,
          firstName: editedFirstName,
          lastName: editedLastName,
          dateOfBirth: editedDateOfBirth,
          city: editedCity,
          streetName: editedStreetName,
          apartmentNumber: editedApartmentNumber,
        }
      }
      return u
    })
    setUsers(updatedUsers)
    setEditingUser(null)

    // If admin edits themselves
    if (sessionUser.username === username) {
      const updatedSessionUser = updatedUsers.find((u) => u.username === username)
      setSessionUser(updatedSessionUser)
    }
  }

  const handleDelete = (username) => {
    const filtered = users.filter((u) => u.username !== username)
    setUsers(filtered)
    // If admin deletes themselves
    if (sessionUser.username === username) {
      setSessionUser(null)
      navigate('/login')
    }
  }

  return (
    <div className="card p-4 shadow">
      <h2 className="mb-4 text-center">ניהול משתמשים (אדמין)</h2>
      <div style={{ overflowX: 'auto' }}>
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">שם משתמש + תמונה</th>
              <th scope="col">תאריך לידה</th>
              <th scope="col">כתובת</th>
              <th scope="col">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isEditing = editingUser === user.username
              const fullName = `${user.firstName} ${user.lastName}`
              const birthDateWords = formatDateWithWords(user.dateOfBirth)
              const addressCombined = `${user.city}, ${user.streetName}, דירה ${user.apartmentNumber}`

              return (
                <tr key={user.username}>
                  {/* USERNAME + PICTURE in one cell */}
                  <td>
                    {isEditing ? (
                      // Editing the name
                      <div>
                        <input
                          className="form-control mb-1"
                          type="text"
                          value={editedFirstName}
                          onChange={(e) => setEditedFirstName(e.target.value)}
                        />
                        <input
                          className="form-control"
                          type="text"
                          value={editedLastName}
                          onChange={(e) => setEditedLastName(e.target.value)}
                        />
                        {/* We won't let admin edit the image here for simplicity */}
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {user.image ? (
                          <img
                            src={user.image} // Base64
                            alt="User"
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              backgroundColor: '#ccc',
                            }}
                          />
                        )}
                        {/* Show Full Name or username */}
                        <span>{fullName}</span>
                      </div>
                    )}
                  </td>

                  {/* BIRTH DATE with words */}
                  <td>
                    {isEditing ? (
                      <input
                        className="form-control"
                        type="date"
                        value={editedDateOfBirth}
                        onChange={(e) => setEditedDateOfBirth(e.target.value)}
                      />
                    ) : (
                      birthDateWords
                    )}
                  </td>

                  {/* ADDRESS = city, street, apt */}
                  <td>
                    {isEditing ? (
                      <div className="d-flex flex-column">
                        <input
                          className="form-control mb-1"
                          type="text"
                          value={editedCity}
                          onChange={(e) => setEditedCity(e.target.value)}
                          placeholder="עיר"
                        />
                        <input
                          className="form-control mb-1"
                          type="text"
                          value={editedStreetName}
                          onChange={(e) => setEditedStreetName(e.target.value)}
                          placeholder="שם רחוב"
                        />
                        <input
                          className="form-control"
                          type="text"
                          value={editedApartmentNumber}
                          onChange={(e) => setEditedApartmentNumber(e.target.value)}
                          placeholder="מספר דירה"
                        />
                      </div>
                    ) : (
                      addressCombined
                    )}
                  </td>

                  {/* ACTIONS (edit/delete) */}
                  <td style={{ width: '120px' }}>
                    {isEditing ? (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleSave(user.username)}
                        >
                          שמור
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditingUser(null)}
                        >
                          בטל
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleEdit(user)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(user.username)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <button
        onClick={() => navigate('/profile')}
        className="btn btn-dark w-100 mt-3"
      >
        חזור לדף הבית
      </button>
    </div>
  )
}

export default SystemAdmin

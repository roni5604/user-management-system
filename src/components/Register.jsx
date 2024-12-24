// src/components/Register.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'

// Regex for 7-12 chars, containing uppercase, digit, special char
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{7,12}$/

// Predefined list of valid cities
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

// Only Hebrew letters (and spaces)
const hebrewRegex = /^[\u0590-\u05FF\s]+$/
// Only English letters (and spaces)
const englishRegex = /^[A-Za-z\s]+$/

function Register() {
  // Retrieve user list from localStorage
  const [users, setUsers] = useLocalStorage('users', [])

  // Main form states
  const [username, setUsername] = useState('')
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(null)

  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // We'll store the uploaded image as a Base64 string
  const [imageBase64, setImageBase64] = useState('')
  const [previewUrl, setPreviewUrl] = useState(null)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [city, setCity] = useState('')
  const [streetName, setStreetName] = useState('')
  const [apartmentNumber, setApartmentNumber] = useState('')

  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  // 1) Check if username is available
  useEffect(() => {
    if (!username.trim()) {
      setIsUsernameAvailable(null)
    } else {
      const exists = users.some(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      )
      setIsUsernameAvailable(!exists)
    }
  }, [username, users])

  // 2) Create a preview URL from the Base64 image
  useEffect(() => {
    if (!imageBase64) {
      setPreviewUrl(null)
      return
    }
    // Base64 can be used directly as <img src={imageBase64} />
    setPreviewUrl(imageBase64)
  }, [imageBase64])

  // Convert a File to Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Helper function to calculate age from date-of-birth
  const calculateAge = (dob) => {
    const birthDate = new Date(dob)
    const diffMs = Date.now() - birthDate.getTime()
    const ageDate = new Date(diffMs)
    return Math.abs(ageDate.getUTCFullYear() - 1970)
  }

  // Called when user selects an image file
  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const base64 = await fileToBase64(file)
      setImageBase64(base64)
    }
  }

  // Autocomplete for city
  const filteredCities = cityOptions.filter((c) => c.startsWith(city))

  const handleRegister = (e) => {
    e.preventDefault()
    const newErrors = {}

    // Validate username
    if (!username.trim()) {
      newErrors.username = 'יש להזין שם משתמש.'
    }

    // Validate first name (Hebrew OR English only, no mixing)
    const isHebrewF = hebrewRegex.test(firstName)
    const isEnglishF = englishRegex.test(firstName)
    if (!firstName.trim()) {
      newErrors.firstName = 'יש להזין שם פרטי.'
    } else if (!(isHebrewF ^ isEnglishF)) {
      // '^' => XOR
      newErrors.firstName = 'השם הפרטי חייב להיות בעברית או באנגלית בלבד, ללא שילוב.'
    }

    // Validate last name
    const isHebrewL = hebrewRegex.test(lastName)
    const isEnglishL = englishRegex.test(lastName)
    if (!lastName.trim()) {
      newErrors.lastName = 'יש להזין שם משפחה.'
    } else if (!(isHebrewL ^ isEnglishL)) {
      newErrors.lastName = 'שם המשפחה חייב להיות בעברית או באנגלית בלבד, ללא שילוב.'
    }

    // Validate password
    if (!passwordRegex.test(password)) {
      newErrors.password =
        'הסיסמה חייבת להיות באורך 7 עד 12 תווים, ולכלול לפחות אות גדולה, מספר ותו מיוחד.'
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'אישור הסיסמה אינו תואם לסיסמה.'
    }

    // Validate image presence
    if (!imageBase64) {
      newErrors.image = 'יש להעלות תמונה.'
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !email.endsWith('.com')) {
      newErrors.email = 'האימייל חייב להסתיים ב-.com'
    }

    // Validate date of birth
    const age = calculateAge(dateOfBirth)
    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'יש להזין תאריך לידה.'
    } else if (age < 18 || age > 120) {
      newErrors.dateOfBirth = 'הגיל חייב להיות בין 18 ל-120.'
    }

    // Validate city from list
    if (!cityOptions.includes(city)) {
      newErrors.city = 'יש לבחור עיר מהרשימה בלבד.'
    }

    // Validate street name (Hebrew only)
    if (!streetName.trim()) {
      newErrors.streetName = 'יש להזין שם רחוב.'
    } else if (!hebrewRegex.test(streetName)) {
      newErrors.streetName = 'שם הרחוב חייב להכיל אותיות בעברית בלבד.'
    }

    // Validate apartmentNumber (non-negative integer)
    if (!apartmentNumber.trim()) {
      newErrors.apartmentNumber = 'יש להזין מספר דירה.'
    } else if (!/^\d+$/.test(apartmentNumber)) {
      newErrors.apartmentNumber = 'מספר דירה חייב להיות מספר חיובי או אפס.'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // If all validations pass, create the new user object
    const newUser = {
      username,
      password,
      image: imageBase64, // store Base64 string
      firstName,
      lastName,
      email,
      dateOfBirth,
      city,
      streetName,
      apartmentNumber,
    }

    // Add new user to localStorage
    setUsers([...users, newUser])

    // Reset form fields
    setUsername('')
    setPassword('')
    setConfirmPassword('')
    setImageBase64('')
    setPreviewUrl(null)
    setFirstName('')
    setLastName('')
    setEmail('')
    setDateOfBirth('')
    setCity('')
    setStreetName('')
    setApartmentNumber('')
    setErrors({})

    // Navigate to login
    navigate('/login')
  }

  return (
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: '600px' }}>
      <h2 className="mb-4 text-center">הרשמה</h2>
      <form onSubmit={handleRegister}>
        {/* USERNAME */}
        <div className="mb-3">
          <label className="form-label">שם משתמש:</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="לדוגמה: user123"
            />
            {isUsernameAvailable === true && (
              <span className="username-availability text-success">✓</span>
            )}
            {isUsernameAvailable === false && (
              <span className="username-availability text-danger">✗</span>
            )}
          </div>
          {errors.username && <div className="text-danger">{errors.username}</div>}
        </div>

        {/* FIRST NAME */}
        <div className="mb-3">
          <label className="form-label">שם פרטי:</label>
          <input
            type="text"
            className="form-control"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="לדוגמה: משה / Moshe"
          />
          {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
        </div>

        {/* LAST NAME */}
        <div className="mb-3">
          <label className="form-label">שם משפחה:</label>
          <input
            type="text"
            className="form-control"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="לדוגמה: כהן / Cohen"
          />
          {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
        </div>

        {/* PASSWORD */}
        <div className="mb-3">
          <label className="form-label">סיסמה:</label>
          <div className="input-group">
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="הקלד סיסמה"
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'הסתר' : 'הצג'}
            </button>
          </div>
          {errors.password && <div className="text-danger">{errors.password}</div>}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-3">
          <label className="form-label">אישור סיסמה:</label>
          <input
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="הקלד שוב את הסיסמה"
          />
          {errors.confirmPassword && (
            <div className="text-danger">{errors.confirmPassword}</div>
          )}
        </div>

        {/* IMAGE (Base64) */}
        <div className="mb-3">
          <label className="form-label">העלאת תמונה:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageChange}
            accept=".jpg,.jpeg"
          />
          {errors.image && <div className="text-danger">{errors.image}</div>}
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="preview-img"
            />
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-3">
          <label className="form-label">אימייל:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="someone@example.com"
          />
          {errors.email && <div className="text-danger">{errors.email}</div>}
        </div>

        {/* DATE OF BIRTH */}
        <div className="mb-3">
          <label className="form-label">תאריך לידה:</label>
          <input
            type="date"
            className="form-control"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
          {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
        </div>

        {/* CITY (Autocomplete from cityOptions) */}
        <div className="mb-3">
          <label className="form-label">עיר:</label>
          <input
            type="text"
            className="form-control"
            list="city-list"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="בחר עיר מהרשימה..."
          />
          <datalist id="city-list">
            {filteredCities.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
          {errors.city && <div className="text-danger">{errors.city}</div>}
        </div>

        {/* STREET NAME (Hebrew only) */}
        <div className="mb-3">
          <label className="form-label">שם רחוב:</label>
          <input
            type="text"
            className="form-control"
            value={streetName}
            onChange={(e) => setStreetName(e.target.value)}
            placeholder="לדוגמה: הרצל"
          />
          {errors.streetName && <div className="text-danger">{errors.streetName}</div>}
        </div>

        {/* APARTMENT NUMBER (non-negative integer) */}
        <div className="mb-3">
          <label className="form-label">מספר דירה:</label>
          <input
            type="text"
            className="form-control"
            value={apartmentNumber}
            onChange={(e) => setApartmentNumber(e.target.value)}
            placeholder="לדוגמה: 12"
          />
          {errors.apartmentNumber && (
            <div className="text-danger">{errors.apartmentNumber}</div>
          )}
        </div>

        <button type="submit" className="btn btn-success w-100">
          הרשם
        </button>
      </form>
    </div>
  )
}

export default Register

// src/hooks/useSessionStorage.js
import { useState } from 'react'

export default function useSessionStorage(key, initialValue) {
  const storedValue = sessionStorage.getItem(key)
  const [value, setValue] = useState(storedValue ? JSON.parse(storedValue) : initialValue)

  const setSessionStorageValue = (newValue) => {
    setValue(newValue)
    sessionStorage.setItem(key, JSON.stringify(newValue))
  }

  return [value, setSessionStorageValue]
}

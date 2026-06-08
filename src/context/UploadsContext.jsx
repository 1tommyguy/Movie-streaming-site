import { createContext, useContext, useState, useEffect } from 'react'

const UploadsContext = createContext(null)
const STORAGE_KEY = 'tommymovie_uploads'

export function UploadsProvider({ children }) {
  const [uploads, setUploads] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploads))
  }, [uploads])

  const addUpload = (movie) => {
    const entry = { ...movie, id: `upload_${Date.now()}`, uploadedAt: Date.now() }
    setUploads((prev) => [entry, ...prev])
    return entry.id
  }

  const removeUpload = (id) => setUploads((prev) => prev.filter((u) => u.id !== id))

  const getUpload = (id) => uploads.find((u) => u.id === id)

  return (
    <UploadsContext.Provider value={{ uploads, addUpload, removeUpload, getUpload }}>
      {children}
    </UploadsContext.Provider>
  )
}

export const useUploads = () => useContext(UploadsContext)

import { createContext, useContext, useState, useEffect } from 'react'

const WatchlistContext = createContext()

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cinestream_watchlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('cinestream_watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const addToWatchlist = (item) => {
    setWatchlist((prev) => {
      if (prev.find((m) => m.id === item.id)) return prev
      return [item, ...prev]
    })
  }

  const removeFromWatchlist = (id) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== id))
  }

  const isInWatchlist = (id) => watchlist.some((m) => m.id === id)

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  )
}

export const useWatchlist = () => useContext(WatchlistContext)

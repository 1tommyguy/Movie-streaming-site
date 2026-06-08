import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG } from '../api/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

export default function Hero({ items }) {
  const [current, setCurrent] = useState(0)
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

  useEffect(() => {
    if (!items || items.length === 0) return
    const timer = setInterval(() => setCurrent((c) => (c + 1) % Math.min(items.length, 5)), 8000)
    return () => clearInterval(timer)
  }, [items])

  if (!items || items.length === 0) {
    return (
      <div className="h-[70vh] bg-gray-900 shimmer flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    )
  }

  const item = items[current]
  const mediaType = item.media_type || 'movie'
  const title = item.title || item.name
  const backdrop = IMG.backdrop(item.backdrop_path)
  const inList = isInWatchlist(item.id)

  return (
    <div className="relative h-[70vh] sm:h-[80vh] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url(${backdrop})` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-32 hero-bottom-gradient" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-lg fade-in" key={item.id}>
          <span className="inline-block bg-[#E50914] text-white text-xs font-bold px-2.5 py-1 rounded mb-3 uppercase tracking-wide">
            {mediaType === 'tv' ? 'TV Show' : 'Movie'} • Trending
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">{title}</h1>
          <p className="text-gray-300 text-sm sm:text-base mb-6 line-clamp-3">{item.overview}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/${mediaType}/${item.id}`)}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play
            </button>

            <button
              onClick={() => navigate(`/${mediaType}/${item.id}`)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/30 transition-colors border border-white/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>

            <button
              onClick={() => inList ? removeFromWatchlist(item.id) : addToWatchlist({ ...item, media_type: mediaType })}
              className={`flex items-center gap-2 font-semibold px-4 py-3 rounded-lg transition-colors border ${inList ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-transparent border-white/40 text-white hover:border-white'}`}
            >
              {inList ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              )}
              {inList ? 'In My List' : 'My List'}
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-8 flex gap-1.5">
        {items.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all ${i === current ? 'bg-[#E50914] w-6' : 'bg-white/40 w-2'}`}
          />
        ))}
      </div>
    </div>
  )
}

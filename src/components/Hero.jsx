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
      <div className="h-[70vh] shimmer flex items-center justify-center">
        <div className="text-gray-600 text-xl">Loading...</div>
      </div>
    )
  }

  const item = items[current]
  const mediaType = item.media_type || 'movie'
  const title = item.title || item.name
  const backdrop = IMG.backdrop(item.backdrop_path)
  const inList = isInWatchlist(item.id)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null

  return (
    <div className="relative h-[75vh] sm:h-[85vh] overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105"
        style={{ backgroundImage: `url(${backdrop})` }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-48 hero-bottom-gradient" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06060f] via-transparent to-[#06060f]/30" />

      {/* Content */}
      <div className="relative h-full flex items-end pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-xl fade-in" key={item.id}>
          {/* Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/40 text-primary-light text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              {mediaType === 'tv' ? 'TV Show' : 'Movie'} • Trending
            </span>
            {rating && (
              <span className="rating-badge text-xs font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {rating}
              </span>
            )}
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 leading-tight tracking-tight">
            {title}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base mb-8 line-clamp-3 leading-relaxed max-w-lg">
            {item.overview}
          </p>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => navigate(`/watch/${mediaType}/${item.id}`)}
              className="btn-primary pulse-glow"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch Now
            </button>

            <button
              onClick={() => navigate(`/${mediaType}/${item.id}`)}
              className="btn-secondary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              More Info
            </button>

            <button
              onClick={() => inList ? removeFromWatchlist(item.id) : addToWatchlist({ ...item, media_type: mediaType })}
              className={`flex items-center gap-2 font-semibold px-4 py-3 rounded-lg transition-all border ${
                inList
                  ? 'bg-primary/20 border-primary/50 text-primary-light'
                  : 'bg-transparent border-white/20 text-white hover:border-primary/50 hover:bg-primary/10'
              }`}
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
      <div className="absolute bottom-6 right-6 sm:right-10 flex gap-2 items-center">
        {items.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-gradient-to-r from-indigo-500 to-primary w-8'
                : 'bg-white/25 w-2 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

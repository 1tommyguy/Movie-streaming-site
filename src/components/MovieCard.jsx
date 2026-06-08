import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IMG } from '../api/tmdb'
import { useWatchlist } from '../context/WatchlistContext'

export default function MovieCard({ item, type }) {
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [imgError, setImgError] = useState(false)

  if (!item) return null

  const mediaType = type || item.media_type || 'movie'
  const title = item.title || item.name
  const poster = IMG.poster(item.poster_path)
  const rating = item.vote_average ? item.vote_average.toFixed(1) : 'N/A'
  const year = (item.release_date || item.first_air_date || '').slice(0, 4)
  const inList = isInWatchlist(item.id)

  const handleClick = () => navigate(`/${mediaType}/${item.id}`)

  const handleWatchlist = (e) => {
    e.stopPropagation()
    if (inList) removeFromWatchlist(item.id)
    else addToWatchlist({ ...item, media_type: mediaType })
  }

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group movie-card rounded-md overflow-hidden"
      style={{ width: '160px' }}
      onClick={handleClick}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-gray-800 rounded-md overflow-hidden">
        {!imgError ? (
          <img
            src={poster}
            alt={title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 gap-2 p-2">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <span className="text-gray-500 text-xs text-center">{title}</span>
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center gap-2">
            <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 shadow-lg">
              <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Rating badge */}
        <div className="absolute top-1.5 left-1.5 bg-black/70 text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          {rating}
        </div>

        {/* Watchlist button */}
        <button
          onClick={handleWatchlist}
          className={`absolute top-1.5 right-1.5 w-7 h-7 rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-all ${inList ? 'bg-[#E50914]' : 'bg-black/70 hover:bg-white/20'}`}
        >
          {inList ? (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="mt-1.5 px-0.5">
        <p className="text-white text-xs font-medium truncate">{title}</p>
        <p className="text-gray-500 text-xs">{year} • {mediaType === 'tv' ? 'TV' : 'Movie'}</p>
      </div>
    </div>
  )
}

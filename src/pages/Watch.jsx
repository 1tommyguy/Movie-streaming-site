import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetails, getTVDetails, IMG } from '../api/tmdb'
import LoadingSpinner from '../components/LoadingSpinner'
import DownloadModal from '../components/DownloadModal'

export default function Watch() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDownload, setShowDownload] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailFn = type === 'movie' ? getMovieDetails : getTVDetails
        const res = await detailFn(id)
        setDetails(res.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, type])

  if (loading) return <LoadingSpinner fullPage />

  const title = details?.title || details?.name
  const embedUrl = type === 'movie'
    ? `https://vidsrc.to/embed/movie/${id}`
    : `https://vidsrc.to/embed/tv/${id}`

  return (
    <div className="min-h-screen bg-[#06060f]">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 glass-nav">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex items-center gap-0.5">
          <span className="text-white font-black text-lg tracking-tight">TOMMY</span>
          <span className="grad-text font-black text-lg tracking-tight ml-1">MOVIE</span>
        </div>

        {title && (
          <span className="text-gray-500 text-sm hidden sm:flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary/60" />
            {title}
          </span>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Player */}
        <div className="video-container rounded-2xl overflow-hidden shadow-2xl mb-8" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}>
          <iframe
            src={embedUrl}
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen"
            title={title}
            referrerPolicy="origin"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {details?.poster_path && (
            <img
              src={IMG.poster(details.poster_path, 'w185')}
              alt={title}
              className="w-28 rounded-xl shadow-glow flex-shrink-0 hidden sm:block"
            />
          )}
          <div className="flex-1">
            <h1 className="text-white text-2xl sm:text-3xl font-black mb-2 tracking-tight">{title}</h1>
            <div className="flex items-center gap-3 text-sm mb-3 flex-wrap">
              {details?.vote_average > 0 && (
                <span className="rating-badge px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {details.vote_average.toFixed(1)}
                </span>
              )}
              <span className="text-gray-500">{(details?.release_date || details?.first_air_date || '').slice(0, 4)}</span>
              <span className="genre-tag">{type === 'tv' ? 'TV Show' : 'Movie'}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-5">{details?.overview}</p>
            <button
              onClick={() => setShowDownload(true)}
              className="btn-secondary inline-flex"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </div>

      {showDownload && details && (
        <DownloadModal
          title={title}
          tmdbId={details.id}
          type={type}
          year={(details.release_date || details.first_air_date || '').slice(0, 4)}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  )
}

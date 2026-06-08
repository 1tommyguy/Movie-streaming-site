import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetails, getTVDetails, IMG } from '../api/tmdb'
import LoadingSpinner from '../components/LoadingSpinner'
import DownloadModal from '../components/DownloadModal'

const SOURCES = [
  {
    key: 'vidlink',
    name: 'VidLink',
    tag: 'HD',
    movie: (id) => `https://vidlink.pro/movie/${id}`,
    tv: (id) => `https://vidlink.pro/tv/${id}`,
  },
  {
    key: 'vidsrc',
    name: 'VidSrc',
    tag: null,
    movie: (id) => `https://vidsrc.to/embed/movie/${id}`,
    tv: (id) => `https://vidsrc.to/embed/tv/${id}`,
  },
  {
    key: 'vidsrc2',
    name: 'VidSrc 2',
    tag: null,
    movie: (id) => `https://vidsrc.me/embed/movie?tmdb=${id}`,
    tv: (id) => `https://vidsrc.me/embed/tv?tmdb=${id}`,
  },
  {
    key: 'embedsu',
    name: 'Embed.su',
    tag: null,
    movie: (id) => `https://embed.su/embed/movie/${id}`,
    tv: (id) => `https://embed.su/embed/tv/${id}`,
  },
  {
    key: 'twoembed',
    name: '2Embed',
    tag: null,
    movie: (id) => `https://www.2embed.cc/embed/${id}`,
    tv: (id) => `https://www.2embed.cc/embedtv/${id}`,
  },
]

export default function Watch() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDownload, setShowDownload] = useState(false)
  const [activeSource, setActiveSource] = useState(0)
  const [iframeKey, setIframeKey] = useState(0)
  const iframeRef = useRef(null)

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

  const switchSource = (index) => {
    setActiveSource(index)
    setIframeKey((k) => k + 1)
  }

  if (loading) return <LoadingSpinner fullPage />

  const title = details?.title || details?.name
  const source = SOURCES[activeSource]
  const year = (details?.release_date || details?.first_air_date || '').slice(0, 4)
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  const frameUrl = `${base}/watchframe.html?id=${id}&type=${type}&src=${source.key}`

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
        {/* Source picker */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold mr-1">Source:</span>
          {SOURCES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => switchSource(i)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                i === activeSource
                  ? 'bg-primary/20 border-primary/50 text-primary-light'
                  : 'bg-[#0e0e1c] border-primary/10 text-gray-400 hover:border-primary/30 hover:text-white'
              }`}
            >
              {i === activeSource && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
              {s.name}
              {s.tag && (
                <span className={`text-[10px] font-bold px-1 py-0 rounded ${
                  s.tag === 'HD' ? 'text-cyan-400 bg-cyan-400/10' : 'text-amber-400 bg-amber-400/10'
                }`}>
                  {s.tag}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Player */}
        <div
          className="video-container rounded-2xl overflow-hidden mb-4"
          style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}
        >
          <iframe
            key={iframeKey}
            ref={iframeRef}
            src={frameUrl}
            allowFullScreen
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock"
            sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-presentation"
            title={title}
          />
        </div>

        {/* Source not working tip */}
        <div className="flex items-start gap-2 bg-[#0e0e1c] border border-primary/10 rounded-xl px-4 py-3 mb-8">
          <svg className="w-4 h-4 text-primary/60 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500 text-xs leading-relaxed">
            If this source isn't loading or showing an error, try switching to a different source above.
            Different sources carry different movies — if one doesn't have it, another likely will.
          </p>
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
              {year && <span className="text-gray-500">{year}</span>}
              <span className="genre-tag">{type === 'tv' ? 'TV Show' : 'Movie'}</span>
              <span className="text-gray-600 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500/60" />
                Playing via {source.name}
              </span>
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
          year={year}
          onClose={() => setShowDownload(false)}
        />
      )}
    </div>
  )
}

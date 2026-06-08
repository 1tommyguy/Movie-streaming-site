import { useParams, useNavigate, Link } from 'react-router-dom'
import { useUploads } from '../context/UploadsContext'

function getEmbedUrl(url) {
  if (!url) return null
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`
  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1`
  // Direct video or other embed — return as-is
  return url
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}

export default function CommunityWatch() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getUpload, removeUpload } = useUploads()
  const movie = getUpload(id)

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#06060f] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Movie not found or was removed.</p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  const embedUrl = getEmbedUrl(movie.videoUrl)
  const direct = isDirectVideo(movie.videoUrl)

  const handleDelete = () => {
    if (confirm('Remove this movie?')) {
      removeUpload(id)
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-[#06060f]">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 glass-nav">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-0.5">
          <span className="text-white font-black text-lg tracking-tight">TOMMY</span>
          <span className="grad-text font-black text-lg tracking-tight ml-1">MOVIE</span>
        </div>
        <span className="text-gray-500 text-sm hidden sm:flex items-center gap-2">
          <span className="w-1 h-1 rounded-full bg-accent/60" />
          {movie.title}
        </span>
        <div className="ml-auto">
          <span className="genre-tag">Community Upload</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Player */}
        {direct ? (
          <div className="rounded-2xl overflow-hidden mb-8" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}>
            <video
              src={movie.videoUrl}
              controls
              autoPlay
              className="w-full aspect-video bg-black"
              title={movie.title}
            />
          </div>
        ) : embedUrl ? (
          <div className="video-container rounded-2xl overflow-hidden mb-8" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.2)' }}>
            <iframe
              src={embedUrl}
              allowFullScreen
              allow="autoplay; encrypted-media; fullscreen"
              title={movie.title}
              referrerPolicy="origin"
            />
          </div>
        ) : (
          <div className="aspect-video bg-surface rounded-2xl flex items-center justify-center mb-8 border border-primary/10">
            <p className="text-gray-500">Unable to play this video URL.</p>
          </div>
        )}

        {/* Info */}
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {movie.posterUrl && (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-28 rounded-xl shadow-glow flex-shrink-0 hidden sm:block object-cover"
              style={{ aspectRatio: '2/3' }}
              onError={(e) => { e.target.style.display = 'none' }}
            />
          )}
          <div className="flex-1">
            <h1 className="text-white text-2xl sm:text-3xl font-black mb-2 tracking-tight">{movie.title}</h1>
            <div className="flex items-center gap-3 text-sm mb-4 flex-wrap">
              {movie.year && <span className="text-gray-500">{movie.year}</span>}
              <span className="genre-tag">{movie.genre}</span>
              <span className="genre-tag">{movie.type === 'tv' ? 'TV Show' : 'Movie'}</span>
              {movie.uploader && (
                <span className="text-gray-600 text-xs flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                  Uploaded by {movie.uploader}
                </span>
              )}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-6">{movie.description}</p>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove this movie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

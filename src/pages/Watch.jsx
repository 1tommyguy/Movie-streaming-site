import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { getMovieDetails, getTVDetails, getMovieVideos, getTVVideos, IMG } from '../api/tmdb'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Watch() {
  const { type, id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [details, setDetails] = useState(null)
  const [videos, setVideos] = useState([])
  const [activeVideo, setActiveVideo] = useState(searchParams.get('key') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const detailFn = type === 'movie' ? getMovieDetails : getTVDetails
        const videoFn = type === 'movie' ? getMovieVideos : getTVVideos
        const [detailRes, videoRes] = await Promise.all([detailFn(id), videoFn(id)])
        setDetails(detailRes.data)
        const allVideos = videoRes.data.results.filter((v) => v.site === 'YouTube')
        setVideos(allVideos)
        if (!activeVideo && allVideos.length > 0) {
          setActiveVideo(allVideos[0].key)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, type])

  if (loading) return <LoadingSpinner fullPage />

  const title = details?.title || details?.name

  return (
    <div className="min-h-screen bg-black">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-4 py-3 bg-[#141414] border-b border-gray-800">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          <span className="text-[#E50914] font-black text-lg">CINE</span>
          <span className="text-white font-black text-lg">STREAM</span>
        </div>
        {title && <span className="text-gray-400 text-sm hidden sm:block">• {title}</span>}
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Player */}
        {activeVideo ? (
          <div className="video-container rounded-xl overflow-hidden shadow-2xl mb-6 border border-gray-800">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0&modestbranding=1`}
              allowFullScreen
              allow="autoplay; encrypted-media"
              title={title}
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-900 rounded-xl flex flex-col items-center justify-center mb-6 border border-gray-800">
            <div className="text-5xl mb-4">🎬</div>
            <h3 className="text-white text-xl font-semibold mb-2">No videos available</h3>
            <p className="text-gray-500 text-sm">No trailers or clips found for this title.</p>
          </div>
        )}

        {/* Info + video list */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold mb-1">{title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
              {details?.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {details.vote_average.toFixed(1)}
                </span>
              )}
              <span>{(details?.release_date || details?.first_air_date || '').slice(0, 4)}</span>
              <span className="bg-gray-800 px-2 py-0.5 rounded text-xs uppercase">{type}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{details?.overview}</p>
          </div>

          {videos.length > 1 && (
            <div className="lg:w-80 flex-shrink-0">
              <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">More Videos</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-hide">
                {videos.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setActiveVideo(v.key)}
                    className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                      activeVideo === v.key
                        ? 'bg-[#E50914]/20 border border-[#E50914]/40'
                        : 'bg-gray-800/50 hover:bg-gray-800 border border-transparent'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white text-xs font-medium truncate">{v.name}</p>
                      <p className="text-gray-500 text-xs">{v.type}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

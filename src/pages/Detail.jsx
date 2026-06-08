import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getMovieDetails, getTVDetails, IMG } from '../api/tmdb'
import { useWatchlist } from '../context/WatchlistContext'
import LoadingSpinner from '../components/LoadingSpinner'
import MovieRow from '../components/MovieRow'

export default function Detail({ type }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()
  const [details, setDetails] = useState(null)
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTrailer, setShowTrailer] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    setShowTrailer(false)
    const fetch = type === 'movie' ? getMovieDetails : getTVDetails
    fetch(id)
      .then((res) => {
        setDetails(res.data)
        const videos = res.data.videos?.results || []
        const t = videos.find((v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
        setTrailer(t || null)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id, type])

  if (loading) return <LoadingSpinner fullPage />
  if (!details) return null

  const title = details.title || details.name
  const inList = isInWatchlist(details.id)
  const runtime = details.runtime
    ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
    : details.number_of_seasons
    ? `${details.number_of_seasons} Season${details.number_of_seasons > 1 ? 's' : ''}`
    : ''
  const year = (details.release_date || details.first_air_date || '').slice(0, 4)
  const similar = details.similar?.results || details.recommendations?.results || []

  return (
    <div className="min-h-screen bg-[#141414]">
      {/* Backdrop */}
      <div className="relative h-[60vh] sm:h-[70vh]">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${IMG.backdrop(details.backdrop_path)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 to-transparent" />

        {showTrailer && trailer && (
          <div className="absolute inset-0 bg-black z-10">
            <div className="video-container h-full" style={{ paddingBottom: '0', height: '100%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=0`}
                allowFullScreen
                allow="autoplay"
                className="w-full h-full"
              />
            </div>
            <button onClick={() => setShowTrailer(false)} className="absolute top-4 right-4 bg-black/70 text-white rounded-full w-10 h-10 flex items-center justify-center z-20 hover:bg-black">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-40 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0">
            <img
              src={IMG.poster(details.poster_path, 'w342')}
              alt={title}
              className="w-52 rounded-xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {details.genres?.map((g) => (
                <span key={g.id} className="bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/30 text-xs px-2 py-0.5 rounded-full font-medium">{g.name}</span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">{title}</h1>

            <div className="flex items-center flex-wrap gap-4 text-sm text-gray-400 mb-4">
              {details.vote_average > 0 && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {details.vote_average.toFixed(1)} / 10
                </span>
              )}
              {year && <span>{year}</span>}
              {runtime && <span>{runtime}</span>}
              {details.status && <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">{details.status}</span>}
            </div>

            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-2xl">{details.overview}</p>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap mb-8">
              {trailer ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-white text-black font-bold px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </button>
              ) : (
                <button className="flex items-center gap-2 bg-white/20 text-white font-bold px-6 py-3 rounded-lg cursor-not-allowed opacity-50">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  No Trailer
                </button>
              )}

              <button
                onClick={() => navigate(`/watch/${type}/${details.id}${trailer ? `?key=${trailer.key}` : ''}`)}
                className="flex items-center gap-2 bg-[#E50914] text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </button>

              <button
                onClick={() => inList ? removeFromWatchlist(details.id) : addToWatchlist({ ...details, media_type: type })}
                className={`flex items-center gap-2 font-semibold px-5 py-3 rounded-lg border transition-colors ${inList ? 'bg-[#E50914] border-[#E50914] text-white' : 'bg-transparent border-gray-600 text-white hover:border-white'}`}
              >
                {inList ? (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> In My List</>
                ) : (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg> My List</>
                )}
              </button>
            </div>

            {/* Cast */}
            {details.credits?.cast?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-semibold mb-2 text-sm uppercase tracking-wider">Cast</h3>
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {details.credits.cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="flex-shrink-0 text-center" style={{ width: '72px' }}>
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 mx-auto mb-1">
                        {person.profile_path ? (
                          <img src={IMG.poster(person.profile_path, 'w185')} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs font-medium leading-tight">{person.name}</p>
                      <p className="text-gray-500 text-xs truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-8">
            <MovieRow title="More Like This" items={similar} type={type} />
          </div>
        )}
      </div>
    </div>
  )
}

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
    setLoading(true)
    const fetch = type === 'movie' ? getMovieDetails : getTVDetails
    fetch(id)
      .then((res) => setDetails(res.data))
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
    <div className="min-h-screen bg-[#06060f]">
      {/* Backdrop */}
      <div className="relative h-[55vh] sm:h-[65vh]">
        <div
          className="absolute inset-0 bg-cover bg-top"
          style={{ backgroundImage: `url(${IMG.backdrop(details.backdrop_path)})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06060f] via-[#06060f]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06060f]/90 via-transparent to-transparent" />
      </div>

      {/* Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-44 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="hidden md:block flex-shrink-0">
            <img
              src={IMG.poster(details.poster_path, 'w342')}
              alt={title}
              className="w-52 rounded-2xl shadow-glow"
            />
          </div>

          {/* Info */}
          <div className="flex-1">
            {/* Genres */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {details.genres?.map((g) => (
                <span key={g.id} className="genre-tag">{g.name}</span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white mb-3 tracking-tight leading-tight">{title}</h1>

            <div className="flex items-center flex-wrap gap-4 text-sm mb-5">
              {details.vote_average > 0 && (
                <span className="rating-badge px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {details.vote_average.toFixed(1)} / 10
                </span>
              )}
              {year && <span className="text-gray-400">{year}</span>}
              {runtime && <span className="text-gray-400">{runtime}</span>}
              {details.status && (
                <span className="bg-[#0e0e1c] border border-primary/20 text-gray-400 px-2.5 py-0.5 rounded-full text-xs">
                  {details.status}
                </span>
              )}
            </div>

            <p className="text-gray-300 text-base leading-relaxed mb-7 max-w-2xl">{details.overview}</p>

            {/* Buttons */}
            <div className="flex gap-3 flex-wrap mb-10">
              <button
                onClick={() => navigate(`/watch/${type}/${details.id}`)}
                className="btn-primary"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Now
              </button>

              <button
                onClick={() => inList ? removeFromWatchlist(details.id) : addToWatchlist({ ...details, media_type: type })}
                className={`flex items-center gap-2 font-semibold px-5 py-3 rounded-lg border transition-all ${
                  inList
                    ? 'bg-primary/20 border-primary/50 text-primary-light'
                    : 'btn-secondary'
                }`}
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
                <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-widest text-primary-light">Cast</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                  {details.credits.cast.slice(0, 10).map((person) => (
                    <div key={person.id} className="flex-shrink-0 text-center" style={{ width: '72px' }}>
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-surface border border-primary/10 mx-auto mb-2">
                        {person.profile_path ? (
                          <img src={IMG.poster(person.profile_path, 'w185')} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <p className="text-white text-xs font-medium leading-tight truncate">{person.name}</p>
                      <p className="text-gray-600 text-xs truncate">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-10">
            <MovieRow title="More Like This" items={similar} type={type} />
          </div>
        )}
      </div>
    </div>
  )
}

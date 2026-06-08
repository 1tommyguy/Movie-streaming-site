import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import LoadingSpinner from '../components/LoadingSpinner'
import { getTrending, getMovies, getTVShows } from '../api/tmdb'
import { useUploads } from '../context/UploadsContext'

function CommunityCard({ movie }) {
  const navigate = useNavigate()
  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group movie-card rounded-xl overflow-hidden"
      style={{ width: '160px' }}
      onClick={() => navigate(`/community/${movie.id}`)}
    >
      <div className="relative aspect-[2/3] bg-surface rounded-xl overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900/40 to-primary/20 gap-2 p-3">
            <svg className="w-10 h-10 text-primary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.361a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
            <span className="text-gray-500 text-xs text-center leading-snug">{movie.title}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-4">
          <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-primary rounded-full flex items-center justify-center shadow-glow opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="genre-tag text-[10px]">Community</span>
        </div>
      </div>
      <div className="mt-2 px-0.5">
        <p className="text-white text-xs font-semibold truncate">{movie.title}</p>
        <p className="text-gray-500 text-xs mt-0.5">{movie.year} · {movie.genre}</p>
      </div>
    </div>
  )
}

function CommunityRow({ uploads }) {
  const navigate = useNavigate()
  if (!uploads.length) return null
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-white text-xl font-bold tracking-tight">Community Uploads</h2>
          <span className="bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold px-2 py-0.5 rounded-full">{uploads.length}</span>
        </div>
        <button
          onClick={() => navigate('/upload')}
          className="flex items-center gap-1.5 text-xs font-semibold text-primary-light hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add yours
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-3">
        {uploads.map((u) => <CommunityCard key={u.id} movie={u} />)}
      </div>
    </div>
  )
}

export default function Home() {
  const [trending, setTrending] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { uploads } = useUploads()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [trendRes, npRes, popRes, trRes, tvRes] = await Promise.all([
          getTrending('all', 'week'),
          getMovies('now_playing'),
          getMovies('popular'),
          getMovies('top_rated'),
          getTVShows('popular'),
        ])
        setTrending(trendRes.data.results)
        setNowPlaying(npRes.data.results)
        setPopular(popRes.data.results)
        setTopRated(trRes.data.results)
        setPopularTV(tvRes.data.results)
      } catch (err) {
        setError('Failed to load content. Please check your connection.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <LoadingSpinner fullPage />

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060f] px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06060f]">
      <Hero items={trending} />

      {/* Upload CTA banner — shown when no uploads yet */}
      {uploads.length === 0 && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-8 mb-2">
          <div
            className="relative rounded-2xl overflow-hidden p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer group"
            style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.1) 50%, rgba(34,211,238,0.08) 100%)', border: '1px solid rgba(139,92,246,0.2)' }}
            onClick={() => navigate('/upload')}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Share a movie with everyone</h3>
                <p className="text-gray-400 text-sm">Upload your own movies and they'll appear right here for everyone to watch.</p>
              </div>
            </div>
            <button className="btn-primary flex-shrink-0">
              Upload a Movie
            </button>
          </div>
        </div>
      )}

      <div className="pt-6">
        <CommunityRow uploads={uploads} />
        <MovieRow title="Now Playing" items={nowPlaying} type="movie" />
        <MovieRow title="Trending This Week" items={trending} />
        <MovieRow title="Popular Movies" items={popular} type="movie" />
        <MovieRow title="Top Rated Movies" items={topRated} type="movie" />
        <MovieRow title="Popular TV Shows" items={popularTV} type="tv" />
      </div>
    </div>
  )
}

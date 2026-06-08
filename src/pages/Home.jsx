import { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import MovieRow from '../components/MovieRow'
import LoadingSpinner from '../components/LoadingSpinner'
import { getTrending, getMovies, getTVShows } from '../api/tmdb'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [nowPlaying, setNowPlaying] = useState([])
  const [popular, setPopular] = useState([])
  const [topRated, setTopRated] = useState([])
  const [popularTV, setPopularTV] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
        setError('Failed to load content. Please check your TMDB API key.')
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
      <div className="min-h-screen flex items-center justify-center bg-[#141414] px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-white text-2xl font-bold mb-2">Oops!</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <p className="text-gray-600 text-sm">Set your TMDB API key in the <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-300">.env</code> file as <code className="bg-gray-800 px-1 py-0.5 rounded text-gray-300">VITE_TMDB_API_KEY</code></p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <Hero items={trending} />
      <div className="pt-4">
        <MovieRow title="Now Playing" items={nowPlaying} type="movie" />
        <MovieRow title="Trending This Week" items={trending} />
        <MovieRow title="Popular Movies" items={popular} type="movie" />
        <MovieRow title="Top Rated Movies" items={topRated} type="movie" />
        <MovieRow title="Popular TV Shows" items={popularTV} type="tv" />
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { getMovies, getGenres, getMoviesByGenre } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = [
  { id: 'popular', label: 'Popular' },
  { id: 'now_playing', label: 'Now Playing' },
  { id: 'top_rated', label: 'Top Rated' },
  { id: 'upcoming', label: 'Upcoming' },
]

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('popular')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    getGenres('movie').then((r) => setGenres(r.data.genres)).catch(() => {})
  }, [])

  useEffect(() => {
    setMovies([])
    setPage(1)
    fetchMovies(1, true)
  }, [selectedCategory, selectedGenre])

  const fetchMovies = async (p, reset = false) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      const res = selectedGenre
        ? await getMoviesByGenre(selectedGenre, p)
        : await getMovies(selectedCategory)
      setTotalPages(res.data.total_pages || 1)
      if (reset) setMovies(res.data.results)
      else setMovies((prev) => [...prev, ...res.data.results])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchMovies(next)
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-3xl font-bold mb-6">Movies</h1>

        <div className="flex gap-2 flex-wrap mb-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setSelectedCategory(c.id); setSelectedGenre(null) }}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === c.id && !selectedGenre ? 'bg-[#E50914] text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          {genres.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id === selectedGenre ? null : g.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${selectedGenre === g.id ? 'border-[#E50914] bg-[#E50914]/20 text-[#E50914]' : 'border-gray-700 text-gray-400 hover:border-gray-500'}`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((m) => (
                <MovieCard key={m.id} item={m} type="movie" />
              ))}
            </div>
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {loadingMore ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

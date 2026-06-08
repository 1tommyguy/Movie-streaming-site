import { useState, useEffect } from 'react'
import { getTVShows, getGenres, getTVByGenre } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = [
  { id: 'popular', label: 'Popular' },
  { id: 'on_the_air', label: 'On The Air' },
  { id: 'top_rated', label: 'Top Rated' },
  { id: 'airing_today', label: 'Airing Today' },
]

export default function TVShows() {
  const [shows, setShows] = useState([])
  const [genres, setGenres] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('popular')
  const [selectedGenre, setSelectedGenre] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  useEffect(() => {
    getGenres('tv').then((r) => setGenres(r.data.genres)).catch(() => {})
  }, [])

  useEffect(() => {
    setShows([])
    setPage(1)
    fetchShows(1, true)
  }, [selectedCategory, selectedGenre])

  const fetchShows = async (p, reset = false) => {
    if (p === 1) setLoading(true)
    else setLoadingMore(true)
    try {
      let res
      if (selectedGenre) res = await getTVByGenre(selectedGenre, p)
      else res = await getTVShows(selectedCategory)
      setTotalPages(res.data.total_pages || 1)
      if (reset) setShows(res.data.results)
      else setShows((prev) => [...prev, ...res.data.results])
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    fetchShows(next)
  }

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-white text-3xl font-bold mb-6">TV Shows</h1>

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

        {loading ? <LoadingSpinner /> : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {shows.map((s) => (
                <div key={s.id} style={{ width: '100%' }}>
                  <MovieCard item={s} type="tv" />
                </div>
              ))}
            </div>
            {page < totalPages && (
              <div className="flex justify-center mt-10">
                <button onClick={loadMore} disabled={loadingMore} className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
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

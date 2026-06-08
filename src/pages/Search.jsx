import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchMulti } from '../api/tmdb'
import MovieCard from '../components/MovieCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useDebounce } from '../hooks/useDebounce'

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQ)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery })
      setResults([])
      setPage(1)
      doSearch(debouncedQuery, 1)
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  const doSearch = async (q, p) => {
    setLoading(true)
    try {
      const res = await searchMulti(q, p)
      setTotalPages(res.data.total_pages)
      setResults((prev) => p === 1 ? res.data.results : [...prev, ...res.data.results])
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    const next = page + 1
    setPage(next)
    doSearch(debouncedQuery, next)
  }

  const filtered = results.filter((r) => r.media_type === 'movie' || r.media_type === 'tv')

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative max-w-xl">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies, TV shows..."
              className="w-full bg-gray-900 border border-gray-700 text-white pl-10 pr-4 py-3 rounded-xl text-base outline-none focus:border-gray-500 placeholder-gray-500"
            />
          </div>
        </div>

        {debouncedQuery && (
          <h2 className="text-gray-400 text-sm mb-6">
            {loading ? 'Searching...' : `${filtered.length} results for "${debouncedQuery}"`}
          </h2>
        )}

        {!debouncedQuery && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-white text-xl font-semibold mb-2">Search for movies & TV shows</h2>
            <p className="text-gray-500">Type above to search our catalog</p>
          </div>
        )}

        {loading && results.length === 0 ? <LoadingSpinner /> : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filtered.map((item) => (
                <div key={`${item.id}-${item.media_type}`} style={{ width: '100%' }}>
                  <MovieCard item={item} type={item.media_type} />
                </div>
              ))}
            </div>

            {page < totalPages && debouncedQuery && (
              <div className="flex justify-center mt-10">
                <button onClick={loadMore} disabled={loading} className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-50">
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

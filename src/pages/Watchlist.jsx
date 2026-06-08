import { useWatchlist } from '../context/WatchlistContext'
import MovieCard from '../components/MovieCard'
import { Link } from 'react-router-dom'

export default function Watchlist() {
  const { watchlist } = useWatchlist()

  return (
    <div className="min-h-screen bg-[#141414] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold">My List</h1>
          <p className="text-gray-500 text-sm mt-1">
            {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'}
          </p>
        </div>

        {watchlist.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-white text-xl font-semibold mb-2">Your list is empty</h2>
            <p className="text-gray-500 mb-6">Add movies and TV shows you want to watch later</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#E50914] text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Browse Content
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {watchlist.map((item) => (
              <MovieCard key={item.id} item={item} type={item.media_type} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

import { useRef } from 'react'
import MovieCard from './MovieCard'

export default function MovieRow({ title, items, type }) {
  const rowRef = useRef(null)

  const scroll = (dir) => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: dir * 500, behavior: 'smooth' })
    }
  }

  if (!items || items.length === 0) return null

  return (
    <div className="mb-10">
      <h2 className="text-white text-xl font-bold mb-4 px-4 sm:px-6 lg:px-8 tracking-tight">{title}</h2>
      <div className="relative group">
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 z-10 w-14 bg-gradient-to-r from-[#06060f] to-transparent flex items-center justify-start pl-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[#0e0e1c] border border-primary/20 flex items-center justify-center hover:border-primary/60 hover:bg-primary/10 transition-all">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>

        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-3"
        >
          {items.map((item) => (
            <MovieCard key={item.id} item={item} type={type} />
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 z-10 w-14 bg-gradient-to-l from-[#06060f] to-transparent flex items-center justify-end pr-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-[#0e0e1c] border border-primary/20 flex items-center justify-center hover:border-primary/60 hover:bg-primary/10 transition-all">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

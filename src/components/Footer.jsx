import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-[#141414] border-t border-gray-800 mt-16 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-1 mb-6">
          <span className="text-[#E50914] font-black text-xl">CINE</span>
          <span className="text-white font-black text-xl">STREAM</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          {[
            { title: 'Browse', links: [{ to: '/', label: 'Home' }, { to: '/movies', label: 'Movies' }, { to: '/tv', label: 'TV Shows' }] },
            { title: 'My Account', links: [{ to: '/watchlist', label: 'My List' }] },
            { title: 'Help', links: [{ to: '/', label: 'FAQ' }, { to: '/', label: 'Contact' }] },
            { title: 'Legal', links: [{ to: '/', label: 'Privacy' }, { to: '/', label: 'Terms' }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-gray-500 text-sm hover:text-gray-300 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-gray-800">
          <p className="text-gray-600 text-xs">© 2024 CineStream. All rights reserved. Movie data provided by TMDB.</p>
          <p className="text-gray-700 text-xs">For entertainment purposes only.</p>
        </div>
      </div>
    </footer>
  )
}

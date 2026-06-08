import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-primary/10 py-12 px-4 sm:px-6 lg:px-8 bg-[#06060f]">
      <div className="max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-0.5 mb-8">
          <span className="text-white font-black text-2xl tracking-tight">TOMMY</span>
          <span className="grad-text font-black text-2xl tracking-tight ml-1.5">MOVIE</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          {[
            { title: 'Browse', links: [{ to: '/', label: 'Home' }, { to: '/movies', label: 'Movies' }, { to: '/tv', label: 'TV Shows' }] },
            { title: 'My Account', links: [{ to: '/watchlist', label: 'My List' }] },
            { title: 'Help', links: [{ to: '/', label: 'FAQ' }, { to: '/', label: 'Contact' }] },
            { title: 'Legal', links: [{ to: '/', label: 'Privacy' }, { to: '/', label: 'Terms' }] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-primary-light text-xs font-bold uppercase tracking-widest mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-gray-500 text-sm hover:text-white transition-colors hover:translate-x-0.5 inline-block"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-primary/10">
          <p className="text-gray-700 text-xs">
            © 2025 <span className="text-gray-500">Tommy Movie</span>. Movie data provided by TMDB.
          </p>
          <p className="text-gray-700 text-xs">For entertainment purposes only.</p>
        </div>
      </div>
    </footer>
  )
}

import { useEffect } from 'react'

export default function DownloadModal({ title, tmdbId, type, year, onClose }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const query = encodeURIComponent(title)

  const sources = type === 'movie'
    ? [
        {
          name: 'YTS',
          desc: 'High quality movie torrents',
          icon: '🎬',
          url: `https://yts.mx/movies/${encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))}-${year}`,
          color: 'from-green-600 to-emerald-500',
        },
        {
          name: '1337x',
          desc: 'Large torrent index',
          icon: '📦',
          url: `https://1337x.to/search/${query}/1/`,
          color: 'from-orange-600 to-amber-500',
        },
        {
          name: 'The Pirate Bay',
          desc: 'Classic torrent site',
          icon: '🏴‍☠️',
          url: `https://thepiratebay.org/search.php?q=${query}&cat=200`,
          color: 'from-slate-600 to-slate-500',
        },
        {
          name: 'Nyaa',
          desc: 'Anime & Asian content',
          icon: '🐱',
          url: `https://nyaa.si/?q=${query}`,
          color: 'from-blue-600 to-indigo-500',
        },
      ]
    : [
        {
          name: 'EZTV',
          desc: 'TV show torrents',
          icon: '📺',
          url: `https://eztv.re/search/${query}`,
          color: 'from-purple-600 to-violet-500',
        },
        {
          name: '1337x',
          desc: 'Large torrent index',
          icon: '📦',
          url: `https://1337x.to/search/${query}/1/`,
          color: 'from-orange-600 to-amber-500',
        },
        {
          name: 'The Pirate Bay',
          desc: 'Classic torrent site',
          icon: '🏴‍☠️',
          url: `https://thepiratebay.org/search.php?q=${query}&cat=205`,
          color: 'from-slate-600 to-slate-500',
        },
      ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-[#0e0e1c] border border-primary/20 rounded-2xl w-full max-w-md p-6 fade-in shadow-2xl" style={{ boxShadow: '0 0 60px rgba(139,92,246,0.15)' }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h2 className="text-white font-black text-lg">Download</h2>
            </div>
            <p className="text-gray-500 text-sm line-clamp-1">{title}</p>
          </div>
          <button onClick={onClose} className="text-gray-600 hover:text-white p-1 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Notice */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-5">
          <p className="text-amber-400/80 text-xs leading-relaxed">
            These links open external download sites. Make sure downloading is legal in your country and always use a VPN for privacy.
          </p>
        </div>

        {/* Sources */}
        <div className="space-y-2.5">
          {sources.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-3.5 rounded-xl bg-[#131325] border border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center text-lg flex-shrink-0`}>
                {s.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold">{s.name}</p>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </div>
              <svg className="w-4 h-4 text-gray-600 group-hover:text-primary transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

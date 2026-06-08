import { HashRouter, Routes, Route } from 'react-router-dom'
import { WatchlistProvider } from './context/WatchlistContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Movies from './pages/Movies'
import TVShows from './pages/TVShows'
import Search from './pages/Search'
import Watchlist from './pages/Watchlist'
import Detail from './pages/Detail'
import Watch from './pages/Watch'

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#06060f]">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <WatchlistProvider>
        <Routes>
          <Route path="/watch/:type/:id" element={<Watch />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/movies" element={<Layout><Movies /></Layout>} />
          <Route path="/tv" element={<Layout><TVShows /></Layout>} />
          <Route path="/search" element={<Layout><Search /></Layout>} />
          <Route path="/watchlist" element={<Layout><Watchlist /></Layout>} />
          <Route path="/movie/:id" element={<Layout><Detail type="movie" /></Layout>} />
          <Route path="/tv/:id" element={<Layout><Detail type="tv" /></Layout>} />
        </Routes>
      </WatchlistProvider>
    </HashRouter>
  )
}

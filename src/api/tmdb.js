import axios from 'axios'

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || '8265bd1679663a7ea12ac168da84d2e8'
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE = 'https://image.tmdb.org/t/p'

export const IMG = {
  poster: (path, size = 'w342') => path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-poster.jpg',
  backdrop: (path, size = 'w1280') => path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-backdrop.jpg',
  original: (path) => path ? `${IMAGE_BASE}/original${path}` : '/placeholder.jpg',
}

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY, language: 'en-US' },
})

export const getTrending = (type = 'all', time = 'week') =>
  api.get(`/trending/${type}/${time}`)

export const getMovies = (category) => api.get(`/movie/${category}`)

export const getTVShows = (category) => api.get(`/tv/${category}`)

export const getGenres = (type = 'movie') => api.get(`/genre/${type}/list`)

export const getMoviesByGenre = (genreId, page = 1) =>
  api.get('/discover/movie', { params: { with_genres: genreId, page, sort_by: 'popularity.desc' } })

export const getTVByGenre = (genreId, page = 1) =>
  api.get('/discover/tv', { params: { with_genres: genreId, page, sort_by: 'popularity.desc' } })

export const getMovieDetails = (id) => api.get(`/movie/${id}`, { params: { append_to_response: 'credits,videos,similar,recommendations' } })

export const getTVDetails = (id) => api.get(`/tv/${id}`, { params: { append_to_response: 'credits,videos,similar,recommendations' } })

export const searchMulti = (query, page = 1) =>
  api.get('/search/multi', { params: { query, page, include_adult: false } })

export const getMovieVideos = (id) => api.get(`/movie/${id}/videos`)

export const getTVVideos = (id) => api.get(`/tv/${id}/videos`)

export const getWatchProviders = (type, id) => api.get(`/${type}/${id}/watch/providers`)

export default api

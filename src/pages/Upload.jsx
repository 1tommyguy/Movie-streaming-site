import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUploads } from '../context/UploadsContext'

const GENRES = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Documentary', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western', 'Other']

const empty = {
  title: '',
  description: '',
  posterUrl: '',
  videoUrl: '',
  year: new Date().getFullYear().toString(),
  genre: 'Action',
  type: 'movie',
  uploader: '',
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-300 mb-2">
        {label} {required && <span className="text-primary">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = 'w-full bg-[#0e0e1c] border border-primary/20 focus:border-primary/60 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition-colors'

export default function Upload() {
  const [form, setForm] = useState(empty)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const { addUpload } = useUploads()
  const navigate = useNavigate()

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.videoUrl.trim()) e.videoUrl = 'Video URL is required'
    if (!form.description.trim()) e.description = 'Description is required'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    setSubmitting(true)
    setTimeout(() => {
      const id = addUpload(form)
      setSubmitting(false)
      setSuccess(true)
      setTimeout(() => navigate(`/community/${id}`), 1800)
    }, 600)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#06060f] flex items-center justify-center px-4">
        <div className="text-center max-w-sm fade-in">
          <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-black mb-2">Movie Uploaded!</h2>
          <p className="text-gray-400 text-sm">Your movie is now live. Taking you there...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#06060f] py-24 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div>
              <h1 className="text-white text-2xl font-black tracking-tight">Upload a Movie</h1>
              <p className="text-gray-500 text-sm">Share a movie with the Tommy Movie community</p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-primary/30 via-accent/20 to-transparent" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Type toggle */}
          <Field label="Content Type">
            <div className="flex gap-2">
              {['movie', 'tv'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                    form.type === t
                      ? 'bg-primary/20 border-primary/50 text-primary-light'
                      : 'bg-[#0e0e1c] border-primary/10 text-gray-400 hover:border-primary/30'
                  }`}
                >
                  {t === 'movie' ? 'Movie' : 'TV Show'}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Title" required>
            <input
              value={form.title}
              onChange={set('title')}
              placeholder="Enter the movie title"
              className={inputCls}
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </Field>

          <Field label="Description" required>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="What's this movie about?"
              rows={3}
              className={inputCls + ' resize-none'}
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description}</p>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Year">
              <input
                value={form.year}
                onChange={set('year')}
                placeholder="2024"
                maxLength={4}
                className={inputCls}
              />
            </Field>
            <Field label="Genre">
              <select value={form.genre} onChange={set('genre')} className={inputCls + ' cursor-pointer'}>
                {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Video URL" required>
            <input
              value={form.videoUrl}
              onChange={set('videoUrl')}
              placeholder="YouTube, Vimeo, or direct video link"
              className={inputCls}
            />
            {errors.videoUrl && <p className="text-red-400 text-xs mt-1">{errors.videoUrl}</p>}
            <p className="text-gray-600 text-xs mt-1.5">Supports YouTube links, Vimeo links, or direct .mp4 URLs</p>
          </Field>

          <Field label="Poster Image URL">
            <input
              value={form.posterUrl}
              onChange={set('posterUrl')}
              placeholder="https://... (optional)"
              className={inputCls}
            />
            {form.posterUrl && (
              <div className="mt-3 flex gap-3 items-start">
                <img
                  src={form.posterUrl}
                  alt="preview"
                  className="w-16 rounded-lg object-cover aspect-[2/3] bg-surface border border-primary/20"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
                <p className="text-gray-500 text-xs mt-1">Poster preview</p>
              </div>
            )}
          </Field>

          <Field label="Your Name">
            <input
              value={form.uploader}
              onChange={set('uploader')}
              placeholder="Anonymous"
              className={inputCls}
            />
          </Field>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
              ) : (
                <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> Publish Movie</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

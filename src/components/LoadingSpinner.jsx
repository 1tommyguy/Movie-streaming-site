export default function LoadingSpinner({ fullPage }) {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="grad-text-primary text-sm font-semibold">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  )
}

export default function LoadingSpinner({ fullPage }) {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#141414]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#E50914] rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="flex justify-center py-12">
      <div className="w-8 h-8 border-4 border-gray-700 border-t-[#E50914] rounded-full animate-spin" />
    </div>
  )
}

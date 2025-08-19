export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full size-16 border-b-2 border-white"></div>
        <p className="text-neutral-300 mt-4">Loading...</p>
      </div>
    </div>
  );
}

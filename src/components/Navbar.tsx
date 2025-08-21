export default function Navbar() {
  return (
    // Makes the navbar sticky, semi-transparent with a blur effect, and adds a subtle bottom border.
    <nav className="sticky top-0 z-50 w-full bg-gray-900/80 backdrop-blur-lg border-b border-gray-500/30">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Title with a vibrant gradient text effect */}
        <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-teal-400">
          🧠 Mind Mashup
        </span>

        {/* Styled link with hover effects for better user feedback */}
        <a
          href="/leaderboard"
          className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-800/60 rounded-lg border border-gray-700 hover:bg-gray-700/80 hover:border-gray-600 hover:text-white transition-all duration-200"
        >
          Leaderboard
        </a>
      </div>
    </nav>
  );
}
"use client";
import useSWR from "swr";
import { motion, AnimatePresence } from "framer-motion";

// Define a type for a player for better type safety
type Player = {
  _id: string;
  name: string;
  score: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

// Helper to get medal emojis for top ranks
const getMedal = (rank: number) => {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return rank;
};

export default function Scoreboard() {
  const { data: players, error, isLoading } = useSWR<Player[]>("/api/leaderboard", fetcher, {
    refreshInterval: 2000,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Stagger the animation of children
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full max-w-3xl p-6 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-100">🏆 Live Scoreboard</h2>
        {isLoading && (
          <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900/50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-1/6">Rank</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider w-3/6">Player</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider w-2/6">Score</th>
            </tr>
          </thead>
          <motion.tbody
            className="bg-gray-800 divide-y divide-gray-700/50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence>
              {players && players.map((p: Player, i: number) => (
                <motion.tr key={p._id} variants={rowVariants} className="hover:bg-gray-700/50 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap text-lg font-bold text-cyan-300 text-center">{getMedal(i + 1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-100">{p.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono text-lg text-teal-300">{p.score} pts</td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </motion.tbody>
        </table>

        {!isLoading && !error && (!players || players.length === 0) && (
            <div className="text-center py-10 text-gray-500">
                <p>No players on the board yet.</p>
                <p className="text-sm">Waiting for the first results...</p>
            </div>
        )}
        {error && (
             <div className="text-center py-10 text-red-400">
                <p>Failed to load scoreboard.</p>
             </div>
        )}
      </div>
    </div>
  );
}
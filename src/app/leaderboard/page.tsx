"use client";
import useSWR from "swr";
import { motion } from "framer-motion";

// Define a type for a player for better type safety
type Player = {
  _id: string;
  name: string;
  score: number;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Leaderboard() {
  const { data: players, error, isLoading } = useSWR<Player[]>(
    "/api/leaderboard",
    fetcher,
    {
      refreshInterval: 5000, // Refresh every 5 seconds
    }
  );

  const topThree = players ? players.slice(0, 3) : [];
  const restOfPlayers = players ? players.slice(3) : [];

  const podiumStyles = [
    // 1st Place (Gold)
    "bg-gradient-to-b from-amber-400 to-yellow-500 border-amber-300 scale-110 z-10",
    // 2nd Place (Silver)
    "bg-gradient-to-b from-slate-300 to-gray-400 border-slate-200",
    // 3rd Place (Bronze)
    "bg-gradient-to-b from-amber-600 to-orange-700 border-amber-500",
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
        <p className="mt-4 text-lg">Loading Leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <p>Failed to load leaderboard data.</p>
      </div>
    );
  }
  
  if (!players || players.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <h1 className="text-4xl font-bold text-gray-300 mb-6">🏆 Leaderboard</h1>
        <p>No players on the board yet. Be the first!</p>
      </div>
    );
  }


  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold text-center text-gray-100 mb-6">
        🏆 Leaderboard
      </h1>

      {/* Podium for Top 3 */}
      <motion.div
        className="flex justify-center items-end gap-4 mb-12 h-48"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {topThree.length > 1 && ( // 2nd Place
          <PodiumCard player={topThree[1]} rank={2} style={podiumStyles[1]} />
        )}
        {topThree.length > 0 && ( // 1st Place
          <PodiumCard player={topThree[0]} rank={1} style={podiumStyles[0]} />
        )}
        {topThree.length > 2 && ( // 3rd Place
          <PodiumCard player={topThree[2]} rank={3} style={podiumStyles[2]} />
        )}
      </motion.div>

      {/* Table for the rest of the players */}
      <motion.div
        className="overflow-hidden rounded-lg border border-gray-700"
        variants={itemVariants}
      >
        <table className="min-w-full">
          <motion.tbody
            className="bg-gray-800 divide-y divide-gray-700/50"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {restOfPlayers.map((p, i) => (
              <motion.tr key={p._id} variants={itemVariants} className="hover:bg-gray-700/50 transition-colors duration-200">
                <td className="px-6 py-4 w-1/6 text-center text-lg font-bold text-gray-400">{i + 4}</td>
                <td className="px-6 py-4 w-3/6 font-medium text-gray-100">{p.name}</td>
                <td className="px-6 py-4 w-2/6 text-right font-mono text-lg text-teal-300">{p.score} pts</td>
              </motion.tr>
            ))}
          </motion.tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}

// Helper component for podium cards
type PodiumCardProps = {
  player: Player;
  rank: number;
  style: string;
};

const PodiumCard: React.FC<PodiumCardProps> = ({ player, rank, style }) => {
  const medal = ["🥇", "🥈", "🥉"][rank - 1];

  return (
    <motion.div
      className={`w-1/3 p-4 rounded-t-lg border-b-4 text-center text-gray-900 shadow-lg ${style}`}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
      }}
    >
      <div className="text-4xl">{medal}</div>
      <div className="text-xl font-bold truncate">{player.name}</div>
      <div className="text-lg font-semibold">{player.score} pts</div>
    </motion.div>
  );
};
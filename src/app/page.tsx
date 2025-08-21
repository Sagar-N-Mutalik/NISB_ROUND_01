"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

const imageURL = "/images/og-image.png"; 

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// A new component for the "Welcome" screen after successful start
const WelcomeScreen = ({ name }: { name: string }) => {
  const router = useRouter();

  const handleProceed = () => {
    router.push("/games");
  };

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700">
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 p-10 md:p-20 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-3xl font-bold tracking-tight text-center"
          variants={itemVariants}
        >
          Welcome, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">{name}</span>!
        </motion.h1>
        <motion.p className="text-center text-gray-300" variants={itemVariants}>
          Your challenge awaits. Are you ready to begin?
        </motion.p>
        <motion.button
          onClick={handleProceed}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          variants={itemVariants}
        >
          Proceed to Games
        </motion.button>
      </motion.div>
    </div>
  );
};


export default function Home() {
  const [name, setName] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false); // 1. New state to control UI transition

  const handleStart = async () => {
    if (!name.trim() || isStarting) return;
    
    setIsStarting(true);
    setError(null);

    try {
      const res = await fetch("/api/start", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create player.");
      }

      if (data.playerId) {
        if (typeof window !== "undefined") {
          localStorage.setItem("playerId", data.playerId);
        }
      } else {
        throw new Error("Player ID was not returned from the server.");
      }
      
      // 2. On success, update the 'isReady' state instead of navigating
      setIsReady(true);

    } catch (err) {
      console.error("Failed to start game:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
        // 3. Always stop the loading indicator
        setIsStarting(false);
    }
  };

  // 4. Conditionally render the WelcomeScreen or the input form based on 'isReady' state
  if (isReady) {
    return <WelcomeScreen name={name} />;
  }

  return (
    <div className="relative w-full max-w-md overflow-hidden rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm border border-gray-700">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <Image
          src={imageURL}
          alt="Tech Background"
          layout="fill"
          objectFit="cover"
          priority
          onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/000000/FFFFFF?text=Image+Not+Found'; }}
        />
      </div>
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center gap-6 p-10 md:p-20 text-white"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400"
          variants={itemVariants}
        >
          🧠 Mind Mashup
        </motion.h1>
        <motion.input
          className="w-full px-4 py-3 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-100 placeholder-gray-400"
          placeholder="Enter your name, problem-solver"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleStart()}
          variants={itemVariants}
        />
        <motion.button
          onClick={handleStart}
          disabled={!name.trim() || isStarting}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: name.trim() && !isStarting ? 1.03 : 1 }}
          whileTap={{ scale: name.trim() && !isStarting ? 0.97 : 1 }}
          variants={itemVariants}
        >
          {isStarting ? "Starting..." : "Join the Challenge"}
        </motion.button>
        
        {error && (
            <motion.p 
                className="mt-2 text-sm text-red-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {error}
            </motion.p>
        )}
      </motion.div>
    </div>
  );
}

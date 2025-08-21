"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Timer from "@/components/Timer";

export default function ReasoningPuzzle({ onNext }: { onNext?: () => void }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = async () => {
    // Prevent empty submission if the function is called by the timer
    const finalAnswer = answer || ""; 
    const playerId = localStorage.getItem("playerId");

    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        playerId,
        correct: finalAnswer.toLowerCase() === "transistor",
        position: 1, // Ensure this position is correct for your game flow
        gameName: "reasoningPuzzle",
      }),
    });
    if (onNext) onNext();
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { type: "spring", duration: 0.6 } 
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <motion.div
        className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 border border-indigo-500/20 rounded-xl shadow-2xl shadow-indigo-500/10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-indigo-400">
            🧩 Reasoning Puzzle
          </h1>
          <Timer duration={300} onExpire={handleSubmit} />
        </div>

        <p className="text-lg leading-relaxed text-gray-300 pt-2">
          I control the flow of current in a circuit. I can amplify signals or act as a switch. What electronic component am I?
        </p>
        
        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4">
          <input
            className="flex-grow w-full px-4 py-3 bg-gray-700 border-2 border-transparent rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Enter your answer here"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <motion.button
            onClick={handleSubmit}
            className="px-8 py-3 font-semibold text-white bg-indigo-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(129, 140, 248, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            Submit
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
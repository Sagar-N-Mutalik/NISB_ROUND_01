"use client";
import { useState } from "react";
// 1. Import the 'Variants' type from framer-motion
import { motion, Variants } from "framer-motion";
import Timer from "@/components/Timer";

export default function TechRiddle({ onNext }: { onNext?: () => void }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = async () => {
    const playerId = localStorage.getItem("playerId");
    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        playerId,
        correct: answer.toLowerCase() === "operating_system",
        position: 1,
        gameName: "techRiddle",
      }),
    });
    if (onNext) onNext();
  };
  
  // 2. Annotate the constant with the 'Variants' type
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5, 
        ease: "easeInOut" 
      }
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-sans">
      
      <motion.div
        className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-cyan-400">
            💡 Tech Riddle
          </h1>
          <Timer duration={180} onExpire={handleSubmit} />
        </div>
        
        <p className="text-lg leading-relaxed text-gray-300 border-l-4 border-cyan-500 pl-4">
          I manage processes, memory, and files, yet you rarely see me directly. I can be preemptive or cooperative, and without me, your programs would be lost in chaos. What am I?
        </p>

        <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-4">
          <input
            className="flex-grow w-full px-4 py-3 bg-gray-700 border-2 border-transparent rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer (use _ for spaces)"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <motion.button
            onClick={handleSubmit}
            className="px-8 py-3 font-semibold text-gray-900 bg-cyan-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-cyan-500"
            whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(34, 211, 238, 0.7)" }}
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
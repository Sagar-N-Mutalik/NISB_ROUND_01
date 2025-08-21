"use client";
import { useState } from "react";
import { motion, Variants } from "framer-motion";
import Timer from "@/components/Timer";

export default function BonusQuestion() {
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const playerId = localStorage.getItem("playerId");
    await fetch("/api/bonus", {
      method: "POST",
      body: JSON.stringify({ playerId, answer }),
    });

    // Redirect to the leaderboard after submission
    window.location.href = "/leaderboard";
  };
  
  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -5 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.7,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <motion.div
        className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 border border-purple-500/20 rounded-xl shadow-2xl shadow-purple-500/10"
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-400">
            ⭐ Bonus Question
          </h1>
          <Timer duration={60} onExpire={handleSubmit} />
        </div>

        <blockquote className="border-l-4 border-purple-500 pl-6 py-2">
            <p className="text-xl italic leading-relaxed text-gray-300">
            IEEE was founded in which year?
            </p>
        </blockquote>
        
        <div className="flex flex-col items-stretch gap-3 pt-4">
          <textarea
            className="w-full px-4 py-3 h-28 bg-gray-700 border-2 border-transparent rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Don't panic, just type your answer here..."
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full px-8 py-3 font-semibold text-white bg-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:opacity-60 disabled:cursor-wait"
            whileHover={{ scale: isSubmitting ? 1 : 1.05, boxShadow: "0px 0px 12px rgba(192, 132, 252, 0.7)" }}
            whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {isSubmitting ? "Submitting..." : "Final Answer"}
          </motion.button>
        </div>
        <p className="text-center text-xs text-gray-500">
          Tip: You can press <kbd className="font-sans border border-gray-600 rounded px-1.5 py-0.5">Cmd</kbd> + <kbd className="font-sans border border-gray-600 rounded px-1.5 py-0.5">Enter</kbd> to submit.
        </p>
      </motion.div>
    </div>
  );
}
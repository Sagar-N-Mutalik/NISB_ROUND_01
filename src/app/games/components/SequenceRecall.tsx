"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Timer from "@/components/Timer";

export default function SequenceRecall({ onNext }: { onNext?: () => void }) {
  // A longer, more challenging sequence
  const [sequence] = useState([
    "8", "6", "4", "2", "5", "1", "9", "3", "7", "0","X","Y"
  ]);
  const [show, setShow] = useState(true);
  const [answer, setAnswer] = useState("");

  // Hide the sequence after 15 seconds
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 15000); // hide after 15s
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async () => {
    const playerId = localStorage.getItem("playerId");
    const correct = answer.replace(/\s/g, "") === sequence.join("");
    await fetch("/api/submit", {
      method: "POST",
      body: JSON.stringify({
        playerId,
        correct,
        position: 1, // Make sure this is the correct position
        gameName: "sequenceRecall",
      }),
    });
    if (onNext) onNext();
  };

  // Animation variants for the views
  const viewVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-200 font-sans p-4">
      <motion.div
        className="w-full max-w-2xl p-8 space-y-6 bg-gray-800 border border-amber-500/20 rounded-xl shadow-2xl shadow-amber-500/10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-amber-400">
            🔢 Sequence Recall
          </h1>
          <Timer duration={180} onExpire={handleSubmit} />
        </div>
        
        {/* AnimatePresence handles the switch between showing sequence and input */}
        <div className="relative h-40 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {show ? (
              <motion.div
                key="sequence"
                className="text-center"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-gray-400 mb-2">Memorize this sequence:</p>
                <p
                  className="text-4xl font-mono tracking-widest p-4 rounded-lg bg-gray-900 select-none"
                  onCopy={(e) => e.preventDefault()} // Disable copying
                >
                  {sequence.join(" ")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="input"
                className="w-full text-center"
                variants={viewVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <p className="text-lg text-gray-300 mb-4">
                  Enter the sequence you remember:
                </p>
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  <input
                    className="flex-grow w-full px-4 py-3 bg-gray-700 border-2 border-transparent rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onPaste={(e) => e.preventDefault()} // Disable pasting
                    placeholder="e.g., 8642519370"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    autoFocus
                  />
                  <motion.button
                    onClick={handleSubmit}
                    className="px-8 py-3 font-semibold text-gray-900 bg-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-amber-500"
                    whileHover={{ scale: 1.05, boxShadow: "0px 0px 12px rgba(251, 191, 36, 0.7)" }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    Submit
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}